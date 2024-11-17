import { useState } from 'react';
import { icons } from '../assets/assets';
import InputField from '../components/InputField/InputField';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = (e) => {
        e.preventDefault();
        setShowPassword((prev) => !prev);
    };

    return (
        <div className='flex flex-col justify-center items-center rounded-lg px-10 py-6 bg-white'>
            <div className='max-w-md w-full'>
                <h1 className='text-americanOrange-500 text-center text-4xl font-urbanist '>
                    Study
                    <span className='font-bold'>Lab</span>
                </h1>
                <h2 className='text-lg font-bold text-center text-gray-800 my-6'>
                    Entrar na sua conta
                </h2>
                <form action='#' className='space-y-6'>
                    <InputField
                        type='email'
                        id='email'
                        label='E-mail institucional'
                        placeholder='Seu email'
                        icon={icons.at}
                    />
                    <InputField
                        type={showPassword ? 'text' : 'password'}
                        id='senha'
                        label='Senha'
                        placeholder='Sua senha'
                        icon={icons.padlock}
                        rightElement={
                            <button
                                onClick={togglePasswordVisibility}
                                className='ml-2'
                                aria-label='Alternar visibilidade da senha'
                            >
                                <img
                                    src={
                                        showPassword
                                            ? icons.eyeClose
                                            : icons.eyeOpen
                                    }
                                    alt=''
                                />
                            </button>
                        }
                    />
                    <button
                        type='submit'
                        className='w-full bg-americanOrange-500 text-white py-2 rounded-md hover:bg-americanOrange-600'
                    >
                        Entrar
                    </button>
                </form>
                <div className='text-center mt-4 text-sm'>
                    Não tem uma conta?{' '}
                    <a href='#' className='text-blue-500 hover:underline'>
                        Cadastre-se
                    </a>
                </div>
                <div className='text-center mt-2 text-sm'>
                    <a href='#' className='text-blue-500 hover:underline'>
                        Esqueceu a senha? Recuperar
                    </a>
                </div>
            </div>
            <div className='mt-6 text-sm text-center'>
                <a href='#' className='text-gray-600 hover:underline'>
                    Voltar para a página inicial
                </a>
                <br />
                <a href='#' className='text-gray-600 hover:underline'>
                    Termos de Serviço e Políticas de Privacidade
                </a>
            </div>
        </div>
    );
};

export default Login;
