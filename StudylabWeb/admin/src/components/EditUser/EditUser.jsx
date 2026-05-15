import { useState } from 'react';
import InputField from '../Inputs/InputField';
import SelectField from '../SelectField/SelectField';
import AlertError from '../../components/Alerts/AlertErro';
import Loading from '../../components/Loading/LoadingForm';
import { isEmptyString } from '../../../../common/services/validation';
import { changeUser } from '../../../../platform/repository/user';

const cursoOptions = [
  { value: 'ES', label: 'Engenharia de Software' },
  { value: 'CC', label: 'Ciência da Computação' },
  { value: 'EC', label: 'Engenharia Civil' },
  { value: 'EP', label: 'Engenharia de Produção' },
  { value: 'EM', label: 'Engenharia Mecânica' },
];

const tipoUserOptions = [
  { role:0, value: "student", label: 'Aluno' },
  { role:1, value: "admin", label: 'Admin' },
  { role:2, value: "prof", label: 'Professor' }
];

const statusUserOptions = [ 
  {value:'true', label:'Ativo'},
  {value:'false', label:'Inativo'}
];

// Função para validar senha forte
const isPasswordStrong = (password) => {
  // Se a senha estiver vazia, não precisa validar (campo opcional)
  if (password.length === 0) return true;
  
  // Se tiver conteúdo, valida os critérios
  return password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password);
};

const EditUser = ({ row, handleClose, setIterationData }) => {
  
  const initialFormData = {
    id: row?.item.id || '',
    nome: row?.item.username || '',
    email: row?.item.email || '',
    matricula: row?.item.matricula || '',
    status:String(row?.item.active) || '',
    curso: cursoOptions.find(option => option.label.toLowerCase() == row.item.curso.nome.toLowerCase())?.value ||  '',
    password: '',
    role: tipoUserOptions[row.item.role]?.value ||  ''
  };
  
  const [formData, setFormData] = useState(initialFormData);
  const [originalFormData] = useState(initialFormData);
  const [passwordModified, setPasswordModified] = useState(false);
  
  const [state, setState] = useState({
    showError: false,
    errorMessage: '',
    isSubmitting: false,
    showLoader: false,
  });
  
  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    
    // Marcar se o campo de senha foi modificado
    if (field === 'password') {
      setPasswordModified(true);
    }
  };

  // Verifica se pelo menos um campo foi alterado
  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalFormData);
  };

  // Verifica se os campos obrigatórios estão preenchidos
  const isFormValid = () => {
    return (
      !isEmptyString(formData.nome) &&
      !isEmptyString(formData.email) &&
      !isEmptyString(formData.matricula) &&
      !isEmptyString(formData.curso) &&
      !isEmptyString(formData.role)
    );
  };

  // Verifica se a senha é válida (se foi modificada)
  const isPasswordValid = () => {
    // Se a senha não foi modificada, é válida
    if (!passwordModified) return true;
    
    // Se foi modificada, valida o formato
    return isPasswordStrong(formData.password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isSubmitting: true, showError: false }));

    // Verifica se houve alguma alteração
    if (!hasChanges()) {
      setState((prev) => ({
        ...prev,
        errorMessage: 'Nenhuma alteração detectada.',
        showError: true,
        isSubmitting: false,
      }));
      return;
    }

    // Verifica campos obrigatórios
    if (!isFormValid()) {
      setState((prev) => ({
        ...prev,
        errorMessage: 'Por favor, preencha todos os campos obrigatórios.',
        showError: true,
        isSubmitting: false,
      }));
      return;
    }

    // Verifica se a senha é válida (se foi alterada)
    if (!isPasswordValid()) {
      setState((prev) => ({
        ...prev,
        errorMessage: 'A senha precisa ter no mínimo 8 caracteres e deve conter números, letras minúsculas e maiúsculas.',
        showError: true,
        isSubmitting: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, showLoader: true }));

    // Remove o campo password se estiver vazio para não enviar senha vazia
    const dataToSubmit = { ...formData };
    if (!dataToSubmit.password) {
      delete dataToSubmit.password;
    }

    try {
      await changeUser(dataToSubmit);
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
      name: 'nome',
      label: 'Nome Completo',
      placeholder: 'Digite seu nome',
      value: formData.nome,
      type: 'text',
      required: true,
    },
    {
      id: 'curso',
      name: 'curso',
      label: 'Curso',
      value: formData.curso,
      options: cursoOptions,
      type: 'select',
      required: true,
    },
    {
      id: 'status',
      name: 'status',
      label: 'Status do usuário',
      fisrtField: 'status do usuário',
      value: formData.status,
      options: statusUserOptions,
      type: 'select',
    },
    {
      id: 'matricula',
      name: 'matricula',
      label: 'Matrícula/Siape',
      placeholder: 'Matrícula/Siape',
      value: formData.matricula,
      type: 'text',
      required: true,
    },
    {
      id: 'email',
      name: 'email',
      label: 'Email institucional',
      placeholder: 'email@alu.ufc.br',
      value: formData.email,
      type: 'text',
      required: true,
    },
    {
      id: 'password',
      name: 'password',
      label: 'Nova senha',
      placeholder: 'Nova Senha',
      value: formData.password,
      type: 'text',
      required: false, // Campo opcional
    }
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
              {field.type == "text" && (
                <>
                  <InputField
                    id={field.id}
                    name={field.name}
                    label={field.label}
                    placeholder={field.placeholder}
                    value={field.value}
                    type={field.type}
                    onChange={handleChange(field.name)}
                  />
                  
                  {/* Validação para campo de senha */}
                  {field.name === 'password' && 
                   passwordModified && 
                   state.isSubmitting && 
                   !isPasswordStrong(formData.password) && 
                   formData.password.length > 0 && (
                    <h5 className='text-red-500 text-sm self-start'>
                      *A senha precisa ter no mínimo 8 caracteres e deve conter números e letras minúsculas e maiúsculas
                    </h5>
                  )}
                  
                  {/* Validação para campos obrigatórios (exceto senha que é opcional) */}
                  {isEmptyString(field.value) && 
                   state.isSubmitting && 
                   field.required && (
                    <h5 className='text-red-500 text-sm self-start'>
                      *Insira {field.name.toLowerCase() === 'quantidade' ? 'a' : 'o'} {field.label.toLowerCase()}
                    </h5>
                  )}
                </>
              )}
              
              {field.type != "text" && (
                <>
                  <SelectField
                    id={field.id}
                    name={field.name}
                    label={field.label}
                    options={field.options}
                    value={field.value}
                    onChange={handleChange(field.name)}
                    fisrtField={field.fisrtField}
                  />
                  
                  {/* Validação para selects obrigatórios */}
                  {isEmptyString(field.value) && 
                   state.isSubmitting && 
                   field.required && (
                    <h5 className='text-red-500 text-sm self-start'>
                      *Selecione {field.name.toLowerCase() === 'quantidade' ? 'a' : 'o'} {field.label.toLowerCase()}
                    </h5>
                  )}
                </>
              )}
            </div>
          ))}

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
              disabled={state.showLoader}
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