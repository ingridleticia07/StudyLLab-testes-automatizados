import { useState, useEffect } from 'react';
import InputField from '../Inputs/InputField';
import SelectField from '../SelectField/SelectField';
import AlertError from '../../components/Alerts/AlertErro';
import Loading from '../../components/Loading/LoadingForm';
import { isEmptyString } from '../../../../common/services/validation';
import { createTopico } from '../../../../platform/repository/topico';

export function getCookie(name) {
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find(row => row.startsWith(`${name}=`));
  return cookie ? cookie.split('=')[1] : null;
}

const cursoOptions = [
    { value: 'ES', label: 'Engenharia de Software' },
    { value: 'CC', label: 'Ciência da Computação' },
    { value: 'EC', label: 'Engenharia Civil' },
    { value: 'EP', label: 'Engenharia de Produção' },
    { value: 'EM', label: 'Engenharia Mecânica' }
];

const initialFormData = {
  nome: '',
  disciplina: '',
};

const RegisterTopic = ({ handleCancel, setIterationData, currentPage,selectDisciplinas }) => {
    
  const [formData, setFormData] = useState(initialFormData);
  const [showError, setShowError] = useState(false);
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
    return !Object.values(formData).some(isEmptyString);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isSubmitting: true}));
    if (!isFormValid()) {
      return;
    }

    setState((prev) => ({ ...prev, showLoader: true }));

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    let idUser = getCookie('id-user');

    const topicoDTO = {
      nomeTopico:formData.nome,
      dataTopico:formattedDate,
      disciplina:formData.disciplina,
      idUsuario: idUser
    };
    
    try {
      await createTopico(topicoDTO);
      
      setIterationData((prev) => prev + 1);

      handleCancel();
    } catch (error) {
      setState((prev) => ({
        ...prev,
        errorMessage: error?.response?.data || 'Erro ao cadastrar tópico.',
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
      label: 'Nome do tópico',
      placeholder: 'Digite o nome do tópico',
      value: formData.nome,
      type:'text'
    },
    {
      id: 'disciplina',
      name: 'disciplina',
      label: 'Disciplina',
      placeholder: 'Disciplina',
      value: formData.disciplina,
      type:'select'
    },
  ];

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-opacity-30 bg-gray-300'>
      <div className='bg-white p-7 rounded-md shadow-lg'>
        <h2 className='text-2xl font-bold text-black mb-5'>
          <div className="flex justify-center mb-2">
            {state.showLoader && <Loading />}
          </div>
          Cadastrar Tópico
        </h2>

        <form onSubmit={handleSubmit} autoComplete='off' className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {state.showError && (
            <div className="col-span-1 md:col-span-2">
              <AlertError onHide={() => setShowError(false)} text={state.errorMessage} />
            </div>
          )}

          {fields.map((field) => (
            <div className="flex flex-col" key={field.id}>
                {field.type === "text" ? (
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
                    {field.value.length <= 0 && state.isSubmitting && (
                    <h5 className="text-red-500 text-sm self-start">
                        *Insira {field.name.toLowerCase() === 'quantidade' ? 'a' : 'o'} {field.label.toLowerCase()}
                    </h5>
                    )}
                </>
                ) : (
                <>
                    <SelectField
                        id={field.id}
                        name={field.name}
                        fisrtField={field.name}
                        promom='a'
                        label={field.label}
                        options={selectDisciplinas}
                        value={formData.disciplina}
                        onChange={handleChange(field.name)}
                    />
                    {formData.disciplina.length <= 0 && state.isSubmitting && (
                    <h5 className="text-red-500 text-sm self-start">
                        *Insira a disciplina do tópico
                    </h5>
                    )}
                </>
                )}
            </div>
            ))}


          <div></div>

          <div className='flex flex-col md:flex-row items-center md:justify-end gap-3 md:gap-5 col-span-1 md:col-span-2'>
            <button
              type='button'
              onClick={handleCancel}
              className='border-2 border-americanOrange-500 text-americanOrange-500 px-3 py-1 rounded-md hover:bg-americanOrange-50'
              aria-label='Cancelar cadastro da disciplina'
            >
              Cancelar
            </button>
            <button
              type='submit'
              className='border-2 border-americanOrange-500 bg-americanOrange-500 text-white px-3 py-1 rounded-md hover:bg-americanOrange-600 hover:border-americanOrange-600'
              aria-label='Cadastrar nova disciplina'
            >
              Cadastrar
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default RegisterTopic;
