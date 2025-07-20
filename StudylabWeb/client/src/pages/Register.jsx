import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthHeader from '../components/AuthHeader/AuthHeader';
import AuthFooter from '../components/AuthFooter/AuthFooter';
import InputField from '../components/InputField/InputField';
import SelectField from '../components/SelectField/SelectField';
import VisibilityButton from '../components/Buttons/VisibilityButton';
import PasswordValidation from '../components/PasswordValidation/PasswordValidation';
import Button from '../components/Buttons/Button';
import AlertRegisterUserError from '../components/Alerts/AlertRegisterUserError';
import Loading from '../components/Loading/Loading';
import { register } from '../../../platform/repository/auth';
import { icons } from '../assets/assets';

const Register = () => {
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [selectedCurso, setSelectedCurso] = useState('');
  const [exceptionText, setExceptionText] = useState('');
  const [showError, setShowError] = useState(false);
  const [showLoader, setLoader] = useState(false);
  const [isFormSubmited, setIsFormSubmited] = useState(false);

  const cursos = [
    { value: 'CC', label: 'Ciência da Computação' },
    { value: 'ES', label: 'Engenharia de Software' },
    { value: 'EM', label: 'Engenharia Mecânica' },
    { value: 'EP', label: 'Engenharia de Produção' },
    { value: 'EC', label: 'Engenharia Civil' },
  ];

  const navigate = useNavigate();

  const isEmailValid = email.endsWith('@alu.ufc.br') || email.endsWith('@ufc.br');
  const isPasswordStrong = password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password);
  const isConfirmMatch = password === confirmPassword;
  const isNameValid = nome.length > 0;
  const isMatriculaValid = matricula.length > 0;
  const isCurseValid = selectedCurso.length > 0;

  const isFormValid = isEmailValid && isPasswordStrong && isConfirmMatch &&
    isNameValid && isMatriculaValid && isCurseValid && termsAccepted;

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setIsFormSubmited(true);

    if (!isFormValid) return;

    try {
      setLoader(true);
      await register(nome, email, password, matricula, selectedCurso);
      navigate('/LoginVerification');
    } catch (error) {
      setIsFormSubmited(false);
      setShowError(true);
      setLoader(false);
      if (error.response?.data?.tipo === 2) {
        setExceptionText("Já existe um usuário com esta matrícula ou email!");
      } else {
        setExceptionText("Curso não encontrado!");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <AuthHeader color="text-white" />

      <div className="flex-grow grid grid-cols-12 px-4 sm:px-6 md:px-0">
        <div className="col-span-12 md:col-span-6 md:col-start-4">
            <div className="bg-white rounded-xl px-4 sm:px-6 md:px-10 py-10 mt-10 text-gray-800 shadow-lg">

            {showError && (
              <AlertRegisterUserError
                onHide={() => setShowError(false)}
                text={exceptionText}
              />
            )}

            <form className="flex flex-col items-center" onSubmit={registerUser}>
              {isFormSubmited && isFormValid && showLoader && <Loading />}

              <InputField
                type="text"
                id="nome"
                label="Nome Completo"
                placeholder="Digite seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                invalidText="Nome inválido"
              />
              {nome.length <= 0 && isFormSubmited && (
                <h5 className="text-red-500 self-start">*Insira o nome do aluno.</h5>
              )}

              <SelectField
                id="curso"
                label="Seu curso"
                Placeholder="Selecione seu curso"
                options={cursos}
                value={selectedCurso}
                onChange={(e) => setSelectedCurso(e.target.value)}
              />
              {selectedCurso.length <= 0 && isFormSubmited && (
                <h5 className="text-red-500 self-start">*Insira o curso do aluno.</h5>
              )}

              <InputField
                type="text"
                id="matricula"
                label="Matrícula"
                placeholder="Sua matrícula"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                maxLength={6}
                invalidText="Matrícula inválida"
              />
              {matricula.length <= 0 && isFormSubmited && (
                <h5 className="text-red-500 self-start">*Insira a matrícula do aluno.</h5>
              )}

              <InputField
                type="email"
                id="email"
                label="Seu e-mail institucional"
                placeholder="meuemail@alu.ufc.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isEmail={true}
                isValid={email.length === 0 ? null : isEmailValid}
              />
              {email.length <= 0 && isFormSubmited && (
                <h5 className="text-red-500 self-start">*Insira o email institucional do aluno corretamente.</h5>
              )}

              <InputField
                type={showPassword ? 'text' : 'password'}
                id="senha"
                label="Senha"
                placeholder="Crie sua senha"
                icon={icons.padlock}
                maxLength={32}
                rightElement={
                  <VisibilityButton
                    handleClick={togglePasswordVisibility}
                    showPassword={showPassword}
                  />
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {password.length <= 0 && isFormSubmited && (
                <h5 className="text-red-500 self-start">*Insira a senha do aluno.</h5>
              )}

              <InputField
                type={showPassword ? 'text' : 'password'}
                id="confirmar-senha"
                label="Confirmar Senha"
                placeholder="Confirme a sua senha"
                icon={icons.padlock}
                maxLength={32}
                rightElement={
                  <VisibilityButton
                    handleClick={togglePasswordVisibility}
                    showPassword={showPassword}
                  />
                }
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPassword.length <= 0 && isFormSubmited && (
                <h5 className="text-red-500 self-start">*Confirme a senha do aluno.</h5>
              )}
              {confirmPassword && password && confirmPassword !== password && isFormSubmited && (
                <h5 className="text-red-500 self-start">*As senhas não coincidem.</h5>
              )}

              <PasswordValidation password={password} />

              <Button text="Continuar meu cadastro" type="submit" disabled={!isFormValid} />

              <p
                className={`text-sm text-red-500 mt-3 transition-opacity duration-200 ${
                  isFormValid ? 'invisible' : 'visible'
                }`}
              >
                A senha não corresponde ao requisito da diretiva de senha ou algum
                <br /> campo está vazio.
              </p>

              <div className="flex gap-2 text-start w-full mt-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                />
                <label htmlFor="terms">
                  Eu aceito os{' '}
                  <Link to="/termos" className="underline font-medium hover:text-black">
                    Termos de serviço e Política de privacidade
                  </Link>
                </label>
              </div>

              {!termsAccepted && isFormSubmited && (
                <h5 className="text-red-500 self-start">*Aceite os termos de serviço.</h5>
              )}
            </form>

            <div className="w-full text-center mt-5">
              <p>
                Já tem uma conta?{' '}
                <Link to="/" className="text-americanOrange-500 hover:underline">
                  Entre aqui
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <AuthFooter showSecondLink={false} />
    </div>
  );
};

export default Register;
