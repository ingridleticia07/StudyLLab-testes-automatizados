import { useState } from 'react';
import { Link } from 'react-router-dom';
import { icons } from '../assets/assets';
import InputField from '../components/InputField/InputField';
import VisibilityButton from '../components/Buttons/VisibilityButton';
import Button from '../components/Buttons/Button';
import AuthHeader from '../components/AuthHeader/AuthHeader';
import AuthFooter from '../components/AuthFooter/AuthFooter';
import {handleLogin, validateLoginFields} from "../../../platform/business/login";
import AlertError from "./../components/Alerts/AlertErro";
import {isEmptyString} from "../../../common/services/validation";
import {saveDashboardSessionInfos,AUTH_TOKEN, getCookie } from "../../../platform/repository/auth.js";
import Loading from '../components/Loading/Loading';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [AlertText, setAlertText] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showError, setShowError] = useState(false);
    const [canTry,setCanTry] = useState(true);
    const [isFormSubmited, setIsFormSubmited] = useState(false);

    const isEmailValid = email.length > 0 && (email.endsWith('@alu.ufc.br') || email.endsWith('@ufc.br'));
    
    const togglePasswordVisibility = (e) => {
        e.preventDefault();
        setShowPassword((prev) => !prev);
    };

    const logar = async (e) => {
        e.preventDefault();
        setIsFormSubmited(true);

        setCanTry(false);
        setShowError(false);
        
        if (!canTry) return;

        const InvalidEmail = isEmptyString(email);
        const InvalidPassword = isEmptyString(password);

        if(!(InvalidEmail || InvalidPassword) && isEmailValid){
            try {
                if(getCookie(AUTH_TOKEN) != null)
                    saveDashboardSessionInfos()
                await handleLogin(email,password)   
            } catch (error) {   
                setShowError(true);  
                setAlertText("Email e/ou senha incorreto(s)!"); 
                setIsFormSubmited(false);
            }
        }else{
            setShowError(true);
            setAlertText("Preencha os campos email e senha corretamente!");
            setIsFormSubmited(false);
        }
        setCanTry(true);
    };

    return (
        <div className="min-h-screen flex flex-col overflow-x-hidden">
            {/* Container para centralizar vertical e horizontalmente */}
            <div className="flex-grow flex items-center justify-center px-4 sm:px-6 md:px-0">
                <div className="w-full max-w-2lg bg-white rounded-xl px-4 sm:px-6 md:px-10 py-10 shadow-lg">
                    <AuthHeader infoText={'Entrar na sua conta'} />
                    <form className='space-y-6' onSubmit={logar}>
                        {isFormSubmited && (
                            <div className="flex justify-center items-center my-4">
                                <Loading />
                            </div>
                        )}
                        {showError && <AlertError onHide={() => setShowError(false)} text={AlertText} />}
                        <InputField
                            type='email'
                            id='email'
                            label='E-mail institucional'
                            placeholder='Seu e-mail institucional'
                            invalidText={'E-mail institucional inválido!'}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            isEmail={true}
                            isValid={email.length === 0 ? null : isEmailValid}
                        />
                        {email.length <= 0 && isFormSubmited && (
                            <h5 style={{ color: 'red' }} className="self-start">
                                *Insira o email
                            </h5>
                        )}
                        <InputField
                            type={showPassword ? 'text' : 'password'}
                            id='senha'
                            label='Senha'
                            placeholder='Sua senha'
                            icon={icons.padlock}
                            invalidText={'senha invalida'}
                            value={password}
                            isValid={password.length === 0 ? null : false}
                            onChange={(e) => setPassword(e.target.value)}
                            rightElement={
                                <VisibilityButton
                                    handleClick={togglePasswordVisibility}
                                    showPassword={showPassword}
                                />
                            }
                        />
                        {password.length <= 0 && isFormSubmited && (
                            <h5 style={{ color: 'red' }} className="self-start">
                                *Insira a senha
                            </h5>
                        )}
                        <Button text='Entrar' type="submit"/>
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
            </div>
            <AuthFooter />
        </div>
    );
};

export default Login;
