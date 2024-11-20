import { icons } from '../../assets/assets';

const VisibilityButton = ({ handleClick, showPassword }) => {
    return (
        <button
            onClick={handleClick}
            className='ml-2'
            aria-label='Alternar visibilidade da senha'
        >
            <img
                src={showPassword ? icons.eyeClose : icons.eyeOpen}
                alt={
                    showPassword
                        ? 'icone do olho  fechado'
                        : 'icone do olho aberto'
                }
            />
        </button>
    );
};

export default VisibilityButton;
