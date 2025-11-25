import { useState, type FormEvent } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from '../context/useAuth';
import pageStyles from './LoginPage.module.css';

function LoginPage() {

    const { user, login, loading } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('Preencha todos os campos!');
            return;
        }

        const success = await login(username, password);
        if (success) {
            navigate('/aeronaves', { replace: true });
        } else {
            setError('Usuário ou senha incorretos. Tente novamente.');
        }
    };

    if (loading) {
        return <div className={pageStyles.container}>Carregando Autenticação...</div>;
    }

    if (user) {
        return <Navigate to="/aeronaves" replace />;
    }

    return (
        <div className={pageStyles.container}>
            <h2>Aerocode | Acesso ao Sistema</h2>
            <form onSubmit={handleSubmit} className={pageStyles.form}>
                <div className={pageStyles.inputGroup}>
                    <label htmlFor="username">Usuário:</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={pageStyles.input}
                        required
                    />
                </div>
                <div className={pageStyles.inputGroup}>
                    <label htmlFor="password">Senha:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={pageStyles.input}
                        required
                    />
                </div>
                {error && <p className={pageStyles.error}>{error}</p>}

                <button type="submit" className={pageStyles.button} disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>

                <p className={pageStyles.hint}>
                    Usuários de Teste: admin/123, eng/123, op/123
                </p>
            </form>
        </div>
    );
}

export default LoginPage;