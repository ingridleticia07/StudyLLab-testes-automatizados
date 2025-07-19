import { useState } from 'react';
import AuthFooter from '../components/AuthFooter/AuthFooter';
import AuthHeader from '../components/AuthHeader/AuthHeader';
import InputField from '../components/InputField/InputField';
import Button from '../components/Buttons/Button';
import { icons } from '../assets/assets';
import { Link } from 'react-router-dom';
import VisibilityButton from '../components/Buttons/VisibilityButton';
import {resetPasswordUser, getCookie} from "../../../platform/repository/auth";
import Loading from '../components/Loading/Loading';
import AlertError from "./../components/Alerts/AlertErro";

const ResetPassword = () => {
    const [isPasswordChanged, setisPasswordChanged] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordAux, setPasswordAux] = useState('');
    const [password, setPassword] = useState('');
    const [isFormSubmited, setIsFormSubmited] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [AlertText, setAlertText] = useState("");
    const [showError, setShowError] = useState(false);

    const togglePasswordVisibility = (e) => {
        e.preventDefault();
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        setShowLoader(true);
        setIsFormSubmited(true);
        let emailCookie = getCookie('emailForReset');
        let codeCookie = getCookie('codeForReset');

        try {
            await resetPasswordUser(emailCookie,codeCookie,password);
            setisPasswordChanged(true);
        } catch (error) {
            console.log(error)
            setShowError(true);
            setAlertText(error.response.data)
            setShowLoader(false);
        }
    };

    return (
        <div>
            <div className='flex flex-col justify-center items-center rounded-xl px-10 py-10 bg-white'>
                <AuthHeader
                    infoText={
                        isPasswordChanged ? 'Sua senha foi alterada com acesso!' : 'Recuperar senha - Nova senha'
                    }
                />
                {isFormSubmited && showLoader && <Loading/>}
                {!isPasswordChanged ? (
                    <form onSubmit={handleSubmit}>
                        {showError && <AlertError onHide={() => setShowError(false)} text={AlertText} />}
                        <InputField
                            type={showPassword ? 'text' : 'password'}
                            id='senha'
                            value={passwordAux}
                            onChange={(e) => setPasswordAux(e.target.value)}
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        <Button text='Recuperar Acesso' type="submit"/>
                    </form>
                ) : (
                    <div className='w-full'>
                        <Button text='Continuar' link='/' />
                    </div>
                )}
                {!isPasswordChanged && (
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
