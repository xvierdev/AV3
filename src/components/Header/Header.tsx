import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import styles from './Header.module.css';

const Header: React.FC = () => {
    const { user, logout, hasPermission, USER_LEVELS } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) {
        return null;
    }
    const navItems = [
        { path: '/', label: 'Dashboard', minLevel: USER_LEVELS.ADMIN },
        { path: '/aeronaves', label: 'Aeronaves', minLevel: USER_LEVELS.OPERATOR },
        { path: '/usuarios', label: 'Funcionários', minLevel: USER_LEVELS.ADMIN },
    ];

    return (
        <header className={styles.header}>
            <div className={styles.title}>
                AeroCode
            </div>

            <nav className={styles.navLinks}>
                {navItems.map((item) => (
                    hasPermission(item.minLevel) && (
                        <Link key={item.path} to={item.path}>
                            {item.label}
                        </Link>
                    )
                ))}
            </nav>

            <div className={styles.userInfo}>
                <Link to="/perfil" className={styles.welcomeText}>
                    Olá, {user.name} ({user.levelName}) | Editar Perfil
                </Link>

                <button
                    onClick={handleLogout}
                    className={styles.logoutButton}
                >
                    Sair
                </button>
            </div>
        </header>
    );
};

export default Header;