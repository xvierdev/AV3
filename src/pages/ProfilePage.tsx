import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { updatePassword } from '../utils/mockUsers';
import pageStyles from './ProfilePage.module.css';

function ProfilePage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!oldPassword || !newPassword || !confirmPassword) {
            setError('Todos os campos de senha são obrigatórios.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('As senhas não coincidem. Tente novamente.');
            return;
        }

        try {
            const wasUpdated = await updatePassword(user!.id, oldPassword, newPassword);
            if (wasUpdated) {
                setSuccess('Senha atualizada com sucesso! Você será desconectado por segurança.');
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(() => {
                    logout();
                    navigate('/login');
                }, 3000);
            }
        } catch (err) {
            const errorMessage = (err instanceof Error) ? err.message : 'Erro ao atualizar a senha.';
            setError(errorMessage);
        }
    };

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className={pageStyles.container}>
            <div className={pageStyles.profileCard}>
                <header className={pageStyles.header}>
                    <h2>Meu Perfil</h2>
                </header>

                <section className={pageStyles.userInfo}>
                    <p><strong>Nome:</strong> {user.name}</p>
                    <p><strong>Usuário:</strong> {user.username}</p>
                    <p><strong>Nível de Acesso:</strong> <strong>{user.levelName}</strong></p>
                </section>

                <hr className={pageStyles.divider} />

                <section>
                    <h3>Alterar Senha</h3>
                    <form onSubmit={handleSubmit} className={pageStyles.form}>
                        <div className={pageStyles.inputGroup}>
                            <label htmlFor="oldPassword">Senha Antiga:</label>
                            <input
                                id="oldPassword"
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className={pageStyles.inputGroup}>
                            <label htmlFor="newPassword">Nova Senha:</label>
                            <input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className={pageStyles.inputGroup}>
                            <label htmlFor="confirmPassword">Confirmar Nova Senha:</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <p className={pageStyles.error}>{error}</p>}
                        {success && <p className={pageStyles.success}>{success}</p>}

                        <button type="submit" className={pageStyles.button} disabled={!!success}>
                            {success ? 'Aguarde...' : 'Salvar Nova Senha'}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}

export default ProfilePage;