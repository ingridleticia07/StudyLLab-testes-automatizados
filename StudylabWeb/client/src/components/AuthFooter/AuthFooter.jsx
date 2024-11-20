import { Link } from 'react-router-dom';

const AuthFooter = () => {
    return (
        <footer className='mt-6 text-sm text-center'>
            <Link to={'/'} className='text-gray-600 hover:underline'>
                Voltar para a página inicial
            </Link>
            <br />
            <Link to={'/termos'} className='text-gray-600 hover:underline'>
                Termos de Serviço e Políticas de Privacidade
            </Link>
        </footer>
    );
};

export default AuthFooter;
