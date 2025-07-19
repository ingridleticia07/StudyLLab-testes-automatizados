import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthFooter from '../components/AuthFooter/AuthFooter';
import AuthHeader from '../components/AuthHeader/AuthHeader';
import InputField from '../components/InputField/InputField';
import Button from '../components/Buttons/Button';
import AlertError from '../components/Alerts/AlertErro';
import Loading from '../components/Loading/Loading';
import { requestResetPasswordUser } from '../../../platform/repository/auth';

const PasswordEmail = () => {
  const [emailForReset, setEmailForReset] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const isEmailValid = () =>
    emailForReset.trim().length > 0 &&
    (emailForReset.endsWith('@alu.ufc.br') || emailForReset.endsWith('@ufc.br'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!isEmailValid()) return;

    setLoading(true);
    setShowError(false);

    try {
      await requestResetPasswordUser(emailForReset);
      navigate('/verificacao');
    } catch (error) {
      setAlertText('Erro ao solicitar recuperação de senha');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='flex flex-col justify-center items-center rounded-xl py-10 px-10 bg-white'>
        <AuthHeader infoText='Recuperar senha' />

        {loading && (
          <div className='mb-4'>
            <Loading />
          </div>
        )}

        <form onSubmit={handleSubmit} className='mb-5 w-full' autoComplete='off'>
          {showError && (
            <AlertError onHide={() => setShowError(false)} text={alertText} />
          )}

          <InputField
            type='email'
            id='email'
            label='E-mail cadastrado'
            placeholder='Seu e-mail institucional'
            value={emailForReset}
            onChange={(e) => setEmailForReset(e.target.value)}
            isEmail={true}
            isValid={emailForReset.length === 0 ? null : isEmailValid()}
          />

          {emailForReset.trim().length === 0 && isSubmitted && (
            <h5 className='text-red-500 text-sm mt-1'>*Insira o e-mail</h5>
          )}

          {!isEmailValid() && emailForReset.length > 0 && isSubmitted && (
            <h5 className='text-red-500 text-sm mt-1'>
              *O e-mail deve terminar com @ufc.br ou @alu.ufc.br
            </h5>
          )}

          <div className='mt-4'>
            <Button
              text='Continuar'
              type='submit'
              className='w-full'
              aria-label='Solicitar recuperação de senha'
            />
          </div>
        </form>

        <div className='text-center mb-3 mt-3 text-sm text-americanOrange-500'>
          <p>
            Não tem uma conta?{' '}
            <Link
              to='/cadastro'
              className='text-americanOrange-500 hover:underline'
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>

      <AuthFooter />
    </div>
  );
};

export default PasswordEmail;
