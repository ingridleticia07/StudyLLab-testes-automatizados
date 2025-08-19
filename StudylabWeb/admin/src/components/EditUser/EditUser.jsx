import { useState } from 'react';
import InputField from '../Inputs/InputField';
import SelectField from '../SelectField/SelectField';
import AlertError from '../../components/Alerts/AlertErro';
import Loading from '../../components/Loading/LoadingForm';
import { isEmptyString } from '../../../../common/services/validation';
import { registerAdminOrProf } from '../../../../platform/repository/auth';

const cursoOptions = [
  { value: 'ES', label: 'Engenharia de Software' },
  { value: 'CC', label: 'Ciência da Computação' },
  { value: 'EC', label: 'Engenharia Civil' },
  { value: 'EP', label: 'Engenharia de Produção' },
  { value: 'EM', label: 'Engenharia Mecânica' },
];

const tipoUserOptions = [
  { value: "student", label: 'Aluno' },
  { value: "prof", label: 'Professor' },
  { value: "admin", label: 'Admin' }
];

const EditUser = ({ row, handleClose, setIterationData }) => {

  const initialFormData = {
    id: row?.id || '',
    nome: row?.item.username || '',
    email: row?.item.email || '',
    matricula: row?.item.matricula || '',
    curso: row?.item.curso || '',
    senha: '', // senha só se quiser alterar
    role: row?.item.tipoUsuario || '',
  };
  
  const [formData, setFormData] = useState(initialFormData);
  const [originalFormData] = useState(initialFormData);
  
  const [state, setState] = useState({
    showError: false,
    errorMessage: '',
    isSubmitting: false,
    showLoader: false,
  });

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const isFormValid = () => {
    return (
      !isEmptyString(formData.nome) &&
      !isEmptyString(formData.email) &&
      !isEmptyString(formData.matricula) &&
      !isEmptyString(formData.curso) &&
      !isEmptyString(formData.role)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isSubmitting: true, showError: false }));

    if (JSON.stringify(formData) === JSON.stringify(originalFormData)) {
      setState((prev) => ({
        ...prev,
        errorMessage: 'Nenhuma alteração detectada.',
        showError: true,
        isSubmitting: false,
      }));
      return;
    }

    if (!isFormValid()) {
      setState((prev) => ({
        ...prev,
        errorMessage: 'Por favor, preencha todos os campos obrigatórios.',
        showError: true,
        isSubmitting: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, showLoader: true }));

    try {
      await registerAdminOrProf(formData); // precisa existir no seu repo
      setIterationData((prev) => prev + 1);
      handleClose();
    } catch (error) {
      setState((prev) => ({
        ...prev,
        errorMessage: error?.response?.data || 'Erro ao editar usuário.',
        showError: true,
      }));
    } finally {
      setState((prev) => ({ ...prev, showLoader: false, isSubmitting: false }));
    }
  };

  const fields = [
    {
      id: 'nome',
      name: 'Nome Completo',
      label: 'Nome Completo',
      placeholder: 'Digete seu nome',
      value: formData.nome,
      type: 'text',
    },
    {
      id: 'Matricula',
      name: 'matricula',
      label: 'Matrícula/Siape',
      placeholder: 'Matrícula/Siape',
      value: formData.matricula,
      type: 'text',
    },
    {
      id: 'email',
      name: 'email',
      label: 'Email institucional',
      placeholder: 'email@alu.ufc.br',
      value: formData.email,
      type: 'text',
    },
  ];
  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-opacity-30 bg-gray-300'>
      <div className='bg-white p-7 rounded-md shadow-lg w-full max-w-2xl'>
        <h2 className='text-2xl font-bold text-black mb-5'>
          <div className="flex justify-center mb-2">
            {state.showLoader && <Loading />}
          </div>
          Editar Usuário
        </h2>

        <form onSubmit={handleSubmit} autoComplete='off' className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {state.showError && (
            <div className="col-span-1 md:col-span-2">
              <AlertError onHide={() => setState((prev) => ({ ...prev, showError: false }))} text={state.errorMessage} />
            </div>
          )}

          {fields.map((field) => (
            <div className="flex flex-col" key={field.id}>
                <InputField
                    id={field.id}
                    name={field.name}
                    label={field.label}
                    placeholder={field.placeholder}
                    value={field.value}
                    type={field.type}
                    onChange={handleChange(field.name)}
                />
                {isEmptyString(field.value) && state.isSubmitting && (
                    <h5 className='text-red-500 text-sm self-start'>
                    *Insira {field.name.toLowerCase() === 'quantidade' ? 'a' : 'o'} {field.label.toLowerCase()}
                    </h5>
                )}
            </div>
        ))}
          <div className="flex flex-col">
            <SelectField
              id="curso"
              name="curso"
              label="Curso"
              options={cursoOptions}
              value={formData.curso}
              onChange={handleChange('curso')}
            />
            {isEmptyString(formData.curso) && state.isSubmitting && (
              <h5 className="text-red-500 text-sm self-start">*Insira o curso</h5>
            )}
          </div>

          <div className="flex flex-col">
            <SelectField
              id="role"
              name="role"
              label="Tipo de Usuário"
              options={tipoUserOptions}
              value={formData.role}
              onChange={handleChange('role')}
            />
            {isEmptyString(formData.role) && state.isSubmitting && (
              <h5 className="text-red-500 text-sm self-start">*Selecione o tipo de usuário</h5>
            )}
          </div>

          <div className="flex flex-col md:flex-row items-center md:justify-end gap-3 md:gap-5 col-span-1 md:col-span-2">
            <button
              type='button'
              onClick={handleClose}
              className='border-2 border-americanOrange-500 text-americanOrange-500 px-3 py-1 rounded-md hover:bg-americanOrange-50'
              aria-label='Cancelar edição de usuário'
            >
              Cancelar
            </button>
            <button
              type='submit'
              className='border-2 border-americanOrange-500 bg-americanOrange-500 text-white px-3 py-1 rounded-md hover:bg-americanOrange-600 hover:border-americanOrange-600'
              aria-label='Salvar edição de usuário'
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
