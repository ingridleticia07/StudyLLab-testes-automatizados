import { Link } from 'react-router-dom';

const AuthFooter = ({ showSecondLink = true }) => {
    return (
        <footer className='mt-6 text-sm text-center fleex flex-row items-center'>
            <button className='mr-6 bg-white/20 hover:bg-white/10 text-white py-2 px-4 rounded-md'>
            <Link to={'/inicio'} className='text-white'>
                Voltar para a página inicial  
            </Link>
            </button>
            
            {showSecondLink && (
                <Link to={'/termos'} className='text-white hover:underline'>
                    Termos de Serviço e Políticas de Privacidade
                </Link>
            )}
        </footer>
    );
};

export default AuthFooter;
