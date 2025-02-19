import { useState } from 'react';
import { Link } from 'react-router-dom';
import { icons } from '../assets/assets';
import InputField from '../components/InputField/InputField';
import VisibilityButton from '../components/Buttons/VisibilityButton';
import Button from '../components/Buttons/Button';
import AuthHeader from '../components/AuthHeader/AuthHeader';
import AuthFooter from '../components/AuthFooter/AuthFooter';
import {handleLogin} from "../../../platform/business/login";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPaswordValid, setIsPaswordValid] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const togglePasswordVisibility = (e) => {
        e.preventDefault();
        setShowPassword((prev) => !prev);
    };

    const logar = (e) => {
        e.preventDefault();
        handleLogin(email,password);
    };

    return (
        <div className='flex flex-col justify-center items-center rounded-lg px-10 py-6 bg-white'>
            <AuthHeader infoText={'Entrar na sua conta'} />
            <form className='space-y-6' onSubmit={logar}>
                <InputField
                    type='email'
                    id='email'
                    name='email' // O nome agora é fixo como string
                    label='E-mail institucional'
                    placeholder='Seu email'
                    needValidation={isEmailValid}
                    icon={icons.at}
                    invalidText={'Email inválido'}
                    value={email} // Valor controlado pelo estado
                    onChange={(e) => setEmail(e.target.value)} // Atualiza o estado quando o usuário digita
                />
                <InputField
                    type={showPassword ? 'text' : 'password'}
                    id='senha'
                    name='password' // O nome agora é fixo como string
                    label='Senha'
                    placeholder='Sua senha'
                    needValidation={isPaswordValid}
                    icon={icons.padlock}
                    invalidText={'Senha inválida'}
                    value={password} // Valor controlado pelo estado
                    onChange={(e) => setPassword(e.target.value)} // Atualiza o estado quando o usuário digita
                    rightElement={
                        <VisibilityButton
                            handleClick={togglePasswordVisibility}
                            showPassword={showPassword}
                        />
                    }
                />
                <Button text='Entrar' type="submit" />
            </form>
            <div className='text-center mt-4 text-sm'>
                Não tem uma conta?{' '}
                <Link to={'/cadastro'} className='text-blue-500 hover:underline'>
                    Cadastre-se
                </Link>
            </div>
            <div className='text-center mt-4 text-sm'>
                <Link to={'/recuperar'} className='text-blue-500 hover:underline'>
                    Esqueceu a senha? Recuperar
                </Link>
            </div>
            <AuthFooter />
        </div>
    );
};

export default Login;
