import { useState } from 'react';
import { Link } from 'react-router-dom';
import { icons } from '../assets/assets';
import InputField from '../components/InputField/InputField';
import VisibilityButton from '../components/Buttons/VisibilityButton';
import Button from '../components/Buttons/Button';
import AuthHeader from '../components/AuthHeader/AuthHeader';
import AuthFooter from '../components/AuthFooter/AuthFooter';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const isEmailValid = email.length > 0 && (email.endsWith('@alu.ufc.br') || email.endsWith('@ufc.br'));

    const togglePasswordVisibility = (e) => {
        e.preventDefault();
        setShowPassword((prev) => !prev);
    };

    return (
        <div>
            <div className='flex flex-col justify-center items-center rounded-xl px-10 py-6 bg-white'>
                <AuthHeader infoText={'Entrar na sua conta'} />
                <form action='#' className='space-y-6'>
                    <InputField
                        type='email'
                        id='email'
                        label='E-mail institucional'
                        placeholder='Seu e-mail institucional'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        isEmail={true}
                        isValid={email.length === 0 ? null : isEmailValid}
                    />
                    <InputField
                        type={showPassword ? 'text' : 'password'}
                        id='senha'
                        label='Senha'
                        placeholder='Sua senha'
                        icon={icons.padlock}
                        invalidText={'senha invalida'}
                        rightElement={
                            <VisibilityButton
                                handleClick={togglePasswordVisibility}
                                showPassword={showPassword}
                            />
                        }
                    />
                    <Button text='Entrar' />
                </form>
                <div className='text-center mt-8 text-sm text-americanOrange-500'>
                    Não tem uma conta?{' '}
                    <Link
                        to={'/cadastro'}
                        className='text-americanOrange-500 hover:underline'
                    >
                        Cadastre-se
                    </Link>
                </div>
                <div className='text-center mt-8 text-sm'>
                    <Link
                        to={'/recuperar'}
                        className='text-blue-500 hover:underline'
                    >
                        Esqueceu a senha? Recuperar
                    </Link>
                </div>
            </div>
            <AuthFooter />
        </div>
    );
};

export default Login;
