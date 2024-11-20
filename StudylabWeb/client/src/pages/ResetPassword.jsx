import { useState } from 'react';
import AuthFooter from '../components/AuthFooter/AuthFooter';
import AuthHeader from '../components/AuthHeader/AuthHeader';
import InputField from '../components/InputField/InputField';
import Button from '../components/Buttons/Button';
import { icons } from '../assets/assets';
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
        <div className='flex flex-col justify-center items-center rounded-lg px-10 py-6 bg-white'>
            <AuthHeader
                infoText={
                    a ? 'Sua senha foi alterada com acesso!' : 'Nova Senha'
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
            <AuthFooter />
        </div>
    );
};

export default ResetPassword;
