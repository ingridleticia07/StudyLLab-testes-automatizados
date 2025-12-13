import { useState} from 'react';
import AuthHeader from '../components/AuthHeader/AuthHeader';
import AuthFooter from '../components/AuthFooter/AuthFooter';
import InputField from '../components/InputField/InputField';
import ButtonActivate from '../components/Buttons/ButtonActivate';
import { useNavigate } from 'react-router-dom';
import { icons } from '../assets/assets';
import {activateUserWithCode, resendConfirmationEmail} from "../../../platform/repository/auth";
import AlertRegisterUserError from '../components/Alerts/AlertRegisterUserError';
import Loading from '../components/Loading/Loading';

const LoginVerification = () => {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [storedCode, setStoredCode] = useState('');
    const [showError, setShowError] = useState(false);
    const [isFormSubmited, setIsFormSubmited] = useState(false);

    const navigate = useNavigate();

    const isValidCode = (inputCode) => {
        return inputCode === storedCode;
    };

    const handleSubmit = async (e) => {
        setIsFormSubmited(true);
        e.preventDefault();
        setIsLoading(false);
        setErrorMessage('');
        
        if(!isLoading){
            try {
                setIsLoading(true);
                await activateUserWithCode(code);
                window.location.href = 'https://localhost:5175/'
                //alterar a rota de navegação, para a dashboard de usuário, quando a mesma for criada.
                setIsFormSubmited(false);
                setShowError(false);
            } catch (error) {
                setErrorMessage('Código de verificação inválido!');
                setShowError(true);
                setIsFormSubmited(false);
            }
        }
        setIsLoading(false);
    };

    const handleCodeChange = (value) => {
        const numericValue = value.replace(/\D/g, '').slice(0, 4);
        setCode(numericValue);
    };

    const handleResendCode = async() => {
        setIsFormSubmited(true);
        setIsLoading(false);
        setErrorMessage('');
        
        if(!isLoading){
            try {
                setIsLoading(true);
                await resendConfirmationEmail(code);
                setIsFormSubmited(false);
                alert("Código de verificação reenviado. Verifique seu email!");
            } catch (error) {
                setErrorMessage('Erro ao reenviar código. Tente novamente ou fale conosco!');
                setShowError(true);
                setIsFormSubmited(false);
            }
        }
        setIsLoading(false);
    };

    return (
        <div>
            <AuthHeader color="text-white" />

            <div className="bg-white rounded-xl px-10 py-10 text-gray-800 max-w-md mx-auto">
                {showError && <AlertRegisterUserError onHide={() => setShowError(false)} text={errorMessage}/>}
                <form className="flex flex-col items-center" onSubmit={handleSubmit}>
                    {isFormSubmited &&  <Loading/>}
                    <h2 className="text-2xl font-bold mb-6">Verificação de Login</h2>
                    <InputField
                        type="text"
                        id="verificationCode"
                        label="Código de Verificação"
                        placeholder="Digite o código de 4 dígitos"
                        icon={icons.shield}
                        value={code}
                        onChange={(e) => handleCodeChange(e.target.value)}
                        maxLength={4}
                        inputMode="numeric"
                        pattern="\d{4}"
                        autoFocus
                        isValid={code.length === 0 ? null : isValidCode(code)}
                        errorMessage={errorMessage}
                    />

                    <div className="w-full mt-4">
                        <ButtonActivate
                            text="Continuar"
                            type="submit"
                            disabled={code.length !== 4 || isLoading}
                            isLoading={isLoading}
                        />
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                            Não recebeu o código?{' '}
                            <button
                                type="button"
                                className="text-americanOrange-500 hover:underline focus:outline-none"
                                onClick={() => handleResendCode()}
                            >
                                Reenviar código
                            </button>
                        </p>
                    </div>
                </form>
            </div>
            <AuthFooter showSecondLink={false} />
        </div>
    );
};

export default LoginVerification;