import { useState, useEffect} from 'react';
import AuthHeader from '../components/AuthHeader/AuthHeader';
import AuthFooter from '../components/AuthFooter/AuthFooter';
import InputField from '../components/InputField/InputField';
import ButtonActivate from '../components/Buttons/ButtonActivate';
import { useNavigate } from 'react-router-dom';
import { icons } from '../assets/assets';

const LoginVerification = () => {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [storedCode, setStoredCode] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const savedCode = localStorage.getItem('verificationCode');
        setStoredCode(savedCode);
    }, []);

    const isValidCode = (inputCode) => {
        return inputCode === storedCode;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');


        await new Promise(resolve => setTimeout(resolve, 1500));

        if (isValidCode(code)) {
            navigate('/dashboard');
        } else {
            setErrorMessage('Código de verificação inválido');
        }
        setIsLoading(false);
    };

    const handleCodeChange = (value) => {
        const numericValue = value.replace(/\D/g, '').slice(0, 6);
        setCode(numericValue);
        
        if (numericValue.length === 6) {
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
                        placeholder="Digite o código de 6 dígitos"
                        icon={icons.shield}
                        value={code}
                        onChange={(e) => handleCodeChange(e.target.value)}
                        maxLength={6}
                        inputMode="numeric"
                        pattern="\d{6}"
                        autoFocus
                        isValid={code.length === 0 ? null : isValidCode(code)}
                        errorMessage={errorMessage}
                    />

                    <div className="w-full mt-4">
                        <ButtonActivate
                            text="Continuar"
                            type="submit"
                            disabled={code.length !== 6 || isLoading}
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