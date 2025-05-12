import { Link } from 'react-router-dom';

const ButtonActivate = ({
  text,
  link,
  onClick,
  type = 'submit',
  disabled = false,
}) => {
  const baseClasses = `w-full text-center py-2 rounded-full transition-colors duration-200 ${
    disabled
      ? 'bg-americanOrange-300 mt-3 cursor-not-allowed text-white pointer-events-none'
      : 'bg-americanOrange-500 mt-3 hover:bg-americanOrange-600 text-white'
  }`;

  if (link) {
    return (
      <Link
        to={link}
        onClick={(e) => disabled && e.preventDefault()} // bloqueia a navegação
        className={baseClasses}
      >
        {text}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={baseClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default ButtonActivate;
