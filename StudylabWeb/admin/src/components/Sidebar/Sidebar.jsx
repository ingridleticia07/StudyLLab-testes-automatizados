import { useLocation, useNavigate } from 'react-router-dom';
import SidebarItem from '../SidebarItem/SidebarItem';
import { icons } from '../../assets/assets';
import { logoutSession } from '../../../../platform/repository/auth';

const Sidebar = () => {
    const location = useLocation();

    const navigate = useNavigate();

    const handleLogout = () => {
        const confirmed = window.confirm('Clique em ok para sair!');
        if (confirmed) {
            logoutSession();
            window.location.href = 'http://localhost:5174'
        }
    };
    
    return (
        <nav className='bg-white h-full w-28 pt-32 shadow-sm'>
            <ul className='flex flex-col items-center gap-4'>
                <SidebarItem
                    link='/'
                    icon={icons.home}
                    alt='item sidebar inicial'
                    selected={location.pathname === '/'}
                />
                <SidebarItem
                    link='disciplinas'
                    icon={icons.book}
                    alt='item sidebar disciplinas'
                    selected={location.pathname === '/disciplinas'}
                />
                <SidebarItem
                    link='usuarios'
                    icon={icons.user}
                    alt='item sidebar usuarios'
                    selected={location.pathname === '/usuarios'}
                />
                <SidebarItem
                    link='conteudos'
                    icon={icons.folder}
                    alt='item sidebar conteudos'
                    selected={location.pathname === '/conteudos'}
                />
                <SidebarItem
                    link='denucias'
                    icon={icons.info}
                    alt='item sidebar denucias'
                    selected={location.pathname === '/denucias'}
                />
                <SidebarItem
                    link='ajuda'
                    icon={icons.help}
                    alt='item sidebar ajuda'
                    selected={location.pathname === '/ajuda'}
                />
                <SidebarItem
                    link='Sair'
                    icon={icons.arrowRight}
                    alt='item sidebar logout'
                    onClick={handleLogout}
                    selected={false}
                />

            </ul>
        </nav>
    );
};

export default Sidebar;
