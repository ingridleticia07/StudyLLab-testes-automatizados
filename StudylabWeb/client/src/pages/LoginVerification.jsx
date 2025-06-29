import { useState, useEffect} from 'react';
import AuthHeader from '../components/AuthHeader/AuthHeader';
import AuthFooter from '../components/AuthFooter/AuthFooter';
import InputField from '../components/InputField/InputField';
import ButtonActivate from '../components/Buttons/ButtonActivate';
import { useNavigate } from 'react-router-dom';
import { icons } from '../assets/assets';
import {activateUserWithCode} from "../../../platform/repository/auth";

const LoginVerification = () => {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [storedCode, setStoredCode] = useState('');
    const navigate = useNavigate();

    const isValidCode = (inputCode) => {
        return inputCode === storedCode;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(false);
        setErrorMessage('');
        
        if(!isLoading){
            try {
                setIsLoading(true);
                await activateUserWithCode(code);
                if (isValidCode(code))
                    navigate('/dashboard');
                    //alterar a rota de navegação, para a dashboard de usuário, quando a mesma for criada.
            } catch (error) {
                setErrorMessage('Código de verificação inválido!');
            }
        }
        setIsLoading(false);
    };

    const handleCodeChange = (value) => {
        const numericValue = value.replace(/\D/g, '').slice(0, 4);
        setCode(numericValue);
        
        if (numericValue.length === 4) {
            handleSubmit(new Event('submit'));
        }
    };

    return (
        <div>
            <AuthHeader color="text-white" />
            <div className="bg-white rounded-xl px-10 py-10 text-gray-800 max-w-md mx-auto">
                <form className="flex flex-col items-center" onSubmit={handleSubmit}>
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
                    {errorMessage.length > 0 && (
                        <h5 style={{ color: 'red' }}>
                            {errorMessage}
                        </h5>
                    )}
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
                                onClick={() => console.log('Reenviar código')}
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