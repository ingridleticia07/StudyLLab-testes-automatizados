import { Link } from 'react-router-dom';
import AuthFooter from '../components/AuthFooter/AuthFooter';
import AuthHeader from '../components/AuthHeader/AuthHeader';
import InputField from '../components/InputField/InputField';
import { icons } from '../assets/assets';
import Button from '../components/Buttons/Button';

const PassowordEmail = () => {
    return (
        <div className='flex flex-col justify-center items-center rounded-lg px-10 py-6 bg-white'>
            <AuthHeader infoText='Recuperar senha' />
            <form className='mb-5' onSubmit={(e) => e.preventDefault()}>
                <InputField
                    type='email'
                    id='email'
                    label='E-mail cadastrado'
                    placeholder='Seu email'
                    icon={icons.at}
                    invalidText={'Email invalido'}
                />
                <Button text='Continuar' link='/verificacao' />
            </form>
            <div>
                Não tem uma conta?{' '}
                <Link to='/cadastro' className='text-blue-500'>
                    Cadastre-se
                </Link>
            </div>
            <AuthFooter />
        </div>
    );
};

export default PassowordEmail;
