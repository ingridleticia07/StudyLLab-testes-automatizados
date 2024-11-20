import { useState } from 'react';
import { icons } from '../assets/assets';
import AuthHeader from '../components/AuthHeader/AuthHeader';
import VisibilityButton from '../components/Buttons/VisibilityButton';
import InputField from '../components/InputField/InputField';
import Button from '../components/Buttons/Button';
import { Link } from 'react-router-dom';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = (e) => {
        e.preventDefault();
        setShowPassword((prev) => !prev);
    };

    return (
        <div>
            <div className='bg-white rounded-lg px-10 py-5 text-gray-800'>
                <AuthHeader
                    infoText={
                        'O cadastro deve ser feito com um e-mail institucional'
                    }
                />
                <form className='flex flex-col items-center '>
                    <InputField
                        type='email'
                        id='email'
                        label='Seu e-mail institucional'
                        placeholder='meuemail@alu.ufc.br'
                        icon={icons.at}
                        invalidText='e-mail invalido'
                    />
                    <InputField
                        type={showPassword ? 'text' : 'password'}
                        id='senha'
                        label='Senha'
                        placeholder='crie sua senha'
                        icon={icons.padlock}
                        invalidText='senha invalido'
                        rightElement={
                            <VisibilityButton
                                handleClick={togglePasswordVisibility}
                                showPassword={showPassword}
                            />
                        }
                    />
                    <InputField
                        type={showPassword ? 'text' : 'password'}
                        id='senha'
                        label='Confirmar Senha'
                        placeholder='Confirme a sua senha'
                        icon={icons.padlock}
                        invalidText='senha invalido'
                        rightElement={
                            <VisibilityButton
                                handleClick={togglePasswordVisibility}
                                showPassword={showPassword}
                            />
                        }
                    />
                    <InputField
                        type='text'
                        id='matricula'
                        label='Matricula'
                        placeholder='Sua Matricula'
                        invalidText='Matricula invalida'
                    />
                    <div className='flex gap-2 text-start w-full mb-5'>
                        <input type='checkbox' name='terms' id='terms' />
                        <p>
                            Eu aceito os{' '}
                            <Link to={'/termos'} className='underline font-medium hover:text-black'>
                                Termos de serviço e Política de privacidade{' '}
                            </Link>
                        </p>
                    </div>
                    <Button text='Concluir meu cadastro' />
                </form>
                <div className='w-full text-center mt-5'>
                    <p>
                        Ja tem uma conta? <Link to={'/'} className='text-blue-500 hover:underline'>Entre aqui</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
