import { useLocation, useNavigate } from 'react-router-dom';
import SidebarItem from '../SidebarItem/SidebarItem';
import { icons } from '../../assets/assets';
import { logoutSession } from '../../../../platform/repository/auth';

const Sidebar = ({ isMobile = false }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm('Clique em ok para sair!');
    if (confirmed) {
      logoutSession();
      window.location.href = 'http://localhost:5174';
    }
  };

  const links = [
    { link: '/', icon: icons.home, alt: 'item sidebar inicial' },
    { link: '/disciplinas', icon: icons.subject, alt: 'item sidebar disciplinas' },
    { link: '/topicos', icon: icons.topic, alt: 'item sidebar topicos' },
    { link: '/usuarios', icon: icons.user, alt: 'item sidebar usuarios' },
    { link: '/conteudos', icon: icons.pdfIcon, alt: 'item sidebar conteudos' },
    /*{ link: '/denucias', icon: icons.info, alt: 'item sidebar denuncias' },
    { link: '/ajuda', icon: icons.help, alt: 'item sidebar ajuda' },*/
  ];

  return (
    <nav
      className={`bg-white shadow-sm z-40
        ${isMobile
          ? 'w-full fixed top-0 left-0 py-2 px-4 flex justify-around items-center'
          : 'h-full w-28 pt-32 flex flex-col items-center'}
      `}
    >
      <ul className={`flex ${isMobile ? 'flex-row gap-5' : 'flex-col gap-4'}`}>
        {links.map(({ link, icon, alt }) => (
          <SidebarItem
            key={link}
            link={link}
            icon={icon}
            alt={alt}
            selected={location.pathname === link}
          />
        ))}
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
