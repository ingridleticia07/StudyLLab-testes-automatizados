import { useState } from 'react';
import AuthFooter from '../components/AuthFooter/AuthFooter';
import AuthHeader from '../components/AuthHeader/AuthHeader';
import InputField from '../components/InputField/InputField';
import Button from '../components/Buttons/Button';
import { icons } from '../assets/assets';
import { Link } from 'react-router-dom';
import VisibilityButton from '../components/Buttons/VisibilityButton';

const ResetPassword = () => {
    const [a, setA] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = (e) => {
        e.preventDefault();
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setA(true);
    };

    return (
        <div>
            <div className='flex flex-col justify-center items-center rounded-xl px-10 py-10 bg-white'>
                <AuthHeader
                    infoText={
                        a ? 'Sua senha foi alterada com acesso!' : 'Recuperar senha - Nova senha'
                    }
                />
                {!a ? (
                    <form onSubmit={handleSubmit}>
                        <InputField
                            type={showPassword ? 'text' : 'password'}
                            id='senha'
                            label='Senha'
                            placeholder='Sua Senha'
                            icon={icons.padlock}
                            invalidText={'senha invalida'}
                            rightElement={
                                <VisibilityButton
                                    handleClick={togglePasswordVisibility}
                                    showPassword={showPassword}
                                />
                            }
                        />
                        <InputField
                            type={showPassword ? 'text' : 'password'}
                            id='confSenha'
                            label='Confirma sua Senha'
                            placeholder='Sua Senha'
                            icon={icons.padlock}
                            invalidText={'senha invalida'}
                            rightElement={
                                <VisibilityButton
                                    handleClick={togglePasswordVisibility}
                                    showPassword={showPassword}
                                />
                            }
                        />
                        <Button text='Recuperar Acesso' />
                    </form>
                ) : (
                    <div className='w-full'>
                        <Button text='Continuar' link='/' />
                    </div>
                )}
                {!a && (
                    <div className='text-center mb-8 mt-6 text-sm text-americanOrange-500'>
                        <p>
                            Não tem uma conta?{' '}
                            <Link to='/cadastro' className='text-americanOrange-500 hover:underline'>
                                Cadastre-se
                            </Link>
                        </p>
                    </div>
                )}
            </div>
            <AuthFooter showFirstLink={false}/>
        </div>
    );
};

export default ResetPassword;
