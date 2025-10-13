import { Link } from 'react-router-dom';

const SidebarItem = ({
    link = '#',
    icon,
    alt = 'sidebar item icon',
    selected = false,
    onClick, // <- nova prop
}) => {
    const baseClass =
        'flex items-center justify-center w-14 h-14 rounded-lg cursor-pointer select-none transition duration-300 ease-in-out';

    const selectedClass = selected
        ? 'bg-americanOrange-500'
        : 'hover:bg-americanOrange-200';

    const content = (
        <div className={`${baseClass} ${selectedClass}`}>
            <img src={icon} alt={alt} />
        </div>
    );

    return (
        <li>
            {onClick ? (
                <div onClick={onClick}>
                    {content}
                </div>
            ) : (
                <Link to={link}>
                    {content}
                </Link>
            )}
        </li>
    );
};

export default SidebarItem;
