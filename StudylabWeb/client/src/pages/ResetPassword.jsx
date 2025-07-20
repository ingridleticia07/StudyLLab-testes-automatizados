import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import AuthFooter from '../components/AuthFooter/AuthFooter';
import AuthHeader from '../components/AuthHeader/AuthHeader';
import InputField from '../components/InputField/InputField';
import Button from '../components/Buttons/Button';
import VisibilityButton from '../components/Buttons/VisibilityButton';
import Loading from '../components/Loading/Loading';
import AlertError from '../components/Alerts/AlertErro';

import { icons } from '../assets/assets';
import { resetPasswordUser, getCookie } from "../../../platform/repository/auth";
import { isEmptyString } from "../../../common/services/validation";

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(prev => !prev);
  };

  const showAlert = (text) => {
    setErrorText(text);
    setShowError(true);
  };

  const validatePassword = () => {
    if (password !== confirmPassword && password.length > 0 && confirmPassword.length > 0) {
      showAlert("As senhas não coincidem!");
      return false;
    }
    
    const isStrong =
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password);
    
    if (!isStrong && password.length > 0 && confirmPassword.length > 0) {
      showAlert("A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e ao menos um número.");
      return false;
    }

    if (isEmptyString(password) || isEmptyString(confirmPassword)) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFormSubmitted(true);

    if (!validatePassword()) return;

    const email = getCookie('emailForReset');
    const code = getCookie('codeForReset');

    setShowLoader(true);
    try {
      await resetPasswordUser(email, code, password);
      setIsPasswordChanged(true);
    } catch (error) {
      console.error(error.response);
      const status = error.response?.data?.status;
      const message = status === 404
        ? `Usuário com email ${email} não encontrado.`
        : `O código ${code} não corresponde ao enviado para o email ${email}.`;
      showAlert(message);
    } finally {
      setShowLoader(false);
    }
  };

  const renderPasswordField = (id, label, value, onChange, showWarning) => (
    <>
      <InputField
        type={showPassword ? 'text' : 'password'}
        id={id}
        label={label}
        placeholder='Sua Senha'
        icon={icons.padlock}
        value={value}
        onChange={onChange}
        invalidText='senha inválida'
        rightElement={
          <VisibilityButton handleClick={togglePasswordVisibility} showPassword={showPassword} />
        }
      />
      {showWarning && (
        <h5 style={{ color: 'red' }} className="self-start">
          *{label === 'Senha' ? 'Insira' : 'Repita'} a senha
        </h5>
      )}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 md:px-0">
          <div className="w-full max-w-2lg bg-white rounded-xl px-4 sm:px-6 md:px-10 py-10 shadow-lg">
        <AuthHeader
          infoText={
            isPasswordChanged
              ? 'Sua senha foi alterada com sucesso!'
              : 'Recuperar senha - Nova senha'
          }
        />

        {showLoader &&(
            <div className="flex justify-center items-center my-4">
                <Loading />
            </div>
        )}

        {!isPasswordChanged ? (
          <form onSubmit={handleSubmit}>
            {showError && (
              <AlertError onHide={() => setShowError(false)} text={errorText} />
            )}

            {renderPasswordField(
              'senha',
              'Senha',
              confirmPassword,
              (e) => setConfirmPassword(e.target.value),
              isFormSubmitted && confirmPassword.length <= 0
            )}

            {renderPasswordField(
              'confSenha',
              'Confirma sua Senha',
              password,
              (e) => setPassword(e.target.value),
              isFormSubmitted && password.length <= 0
            )}

            <Button text='Recuperar Acesso' type='submit' />
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
    </div>
    <AuthFooter/>
    </div>
  );
};

export default ResetPassword;
