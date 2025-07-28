import { useState } from 'react';
import InputField from '../Inputs/InputField';
import SelectField from '../SelectField/SelectField';
import AlertRegisterUserError from '../Alerts/AlertRegisterUserError';
import Loading from '../Loading/LoadingForm';
import { registerAdminOrProf } from '../../../../platform/repository/auth';
import { icons } from '../../assets/assets';

const cursoOptions = [
  { value: 'ES', label: 'Engenharia de Software' },
  { value: 'CC', label: 'Ciência da Computação' },
  { value: 'EC', label: 'Engenharia Civil' },
  { value: 'EP', label: 'Engenharia de Produção' },
  { value: 'EM', label: 'Engenharia Mecânica' }
];

const tipoUserOptions = [
  { value: "student", label: 'Aluno' },
  { value: "prof", label: 'Professor' },
  { value: "admin", label: 'Admin' }
];

const initialFormData = {
  nome: '',
  email: '',
  matricula: '',
  curso: '',
  senha: '',
  role:'',
  confirmarSenha: '',
};

const RegisterUserModal = ({ handleCancel }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [state, setState] = useState({
    showError: false,
    errorMessage: '',
    isSubmitting: false,
    showLoader: false,
  });

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  const isEmailValid = formData.email.endsWith('@alu.ufc.br') || formData.email.endsWith('@ufc.br');
  const isPasswordStrong = formData.senha.length >= 8 &&
    /[A-Z]/.test(formData.senha) &&
    /[a-z]/.test(formData.senha) &&
    /[0-9]/.test(formData.senha);
  const isConfirmMatch = formData.senha === formData.confirmarSenha;

  const isFormValid = () => {
    return (
      formData.nome &&
      formData.email &&
      formData.matricula &&
      formData.curso &&
      formData.senha &&
      isEmailValid &&
      isPasswordStrong
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isSubmitting: true }));

    if (!isFormValid()) return;

    try {
      console.log(formData.role)
      setState((prev) => ({ ...prev, showLoader: true }));
      await registerAdminOrProf(
        formData.nome,
        formData.email,
        formData.senha,
        formData.matricula,
        formData.curso,
        formData.role
      );
      handleCancel();
    } catch (error) {
      const message =
        error.response?.data?.tipo === 2
          ? 'Já existe um usuário com esta matrícula ou email!'
          : 'Erro ao cadastrar usuário.';
      setState((prev) => ({
        ...prev,
        showError: true,
        errorMessage: message,
      }));
    } finally {
      setState((prev) => ({
        ...prev,
        showLoader: false,
        isSubmitting: false,
      }));
    }
  };

  const requiredError = (condition, message) =>
    !condition && state.isSubmitting && (
      <h5 className="text-red-500 text-sm self-start">{message}</h5>
    );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-30 bg-gray-300">
      <div className="bg-white p-7 rounded-md shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-black mb-5 text-center">
          <div className="flex justify-center mb-2">
            {state.showLoader && <Loading />}
          </div>
          Cadastrar Usuário
        </h2>

        <form onSubmit={handleSubmit} autoComplete="off" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.showError && (
            <div className="col-span-1 md:col-span-2">
              <AlertRegisterUserError
                onHide={() => setState((prev) => ({ ...prev, showError: false }))}
                text={state.errorMessage}
              />
            </div>
          )}

          <div className="flex flex-col">
            <InputField
              id="nome"
              name="nome"
              label="Nome Completo"
              placeholder="Digite seu nome"
              type="text"
              value={formData.nome}
              onChange={handleChange('nome')}
            />
            {requiredError(formData.nome.length > 0, '*Insira o nome')}
          </div>

          <div className="flex flex-col">
            <SelectField
              id="curso"
              name="curso"
              label="Curso"
              options={cursoOptions}
              value={formData.curso}
              onChange={handleChange('curso')}
            />
            {requiredError(formData.curso.length > 0, '*Insira o curso')}
          </div>

          <div className="flex flex-col">
            <SelectField
              id="role"
              name="role"
              label="Tipo de usuário"
              options={tipoUserOptions}
              value={formData.role}
              onChange={handleChange('role')}
            />
            {requiredError(formData.role.length > 0, '*Insira o tipo de usuário')}
          </div>

          <div className="flex flex-col">
            <InputField
              id="matricula"
              name="matricula"
              label="Matrícula/siape"
              placeholder="Digite sua matrícula/siape"
              type="text"
              value={formData.matricula}
              onChange={handleChange('matricula')}
              maxLength={6}
            />
            {requiredError(formData.matricula.length > 0, '*Insira a matrícula/siape')}
          </div>

          <div className="flex flex-col">
            <InputField
              id="email"
              name="email"
              label="Email Institucional"
              placeholder="email@alu.ufc.br"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
            />
            {requiredError(isEmailValid, '*Insira um email institucional válido')}
          </div>

          <div className="flex flex-col">
            <InputField
              id="senha"
              name="senha"
              label="Senha"
              placeholder="Crie sua senha"
              type={showPassword ? 'text' : 'password'}
              value={formData.senha}
              onChange={handleChange('senha')}
              icon={icons.padlock}
            />
            {requiredError(formData.senha.length > 0, '*Insira a senha')}
          </div>

          <div className="flex flex-col md:flex-row items-center md:justify-end gap-3 md:gap-5 col-span-1 md:col-span-2 mt-3">
            <button
              type="button"
              onClick={handleCancel}
              className="border-2 border-americanOrange-500 text-americanOrange-500 px-3 py-1 rounded-md hover:bg-americanOrange-50"
              aria-label="Cancelar cadastro"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="border-2 border-americanOrange-500 bg-americanOrange-500 text-white px-3 py-1 rounded-md hover:bg-americanOrange-600 hover:border-americanOrange-600"
              aria-label="Cadastrar novo usuário"
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterUserModal;
