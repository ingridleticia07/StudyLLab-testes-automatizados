import { useState } from 'react';
import InputField from '../Inputs/InputField';
import SelectField from '../SelectField/SelectField';
import AlertError from '../../components/Alerts/AlertErro';
import Loading from '../../components/Loading/LoadingForm';
import { isEmptyString } from '../../../../common/services/validation';
import { editarDisciplina } from '../../../../platform/repository/disciplina';

const cursoOptions = [
  { value: 'ES', label: 'Engenharia de Software' },
  { value: 'CC', label: 'Ciência da Computação' },
  { value: 'EC', label: 'Engenharia Civil' },
  { value: 'EP', label: 'Engenharia de Produção' },
  { value: 'EM', label: 'Engenharia Mecânica' },
];

const EditSubject = ({ row, handleClose, setDisciplinas, currentPage, setIterationData }) => {
  const initialFormData = {
    id: row.item.idDisciplina,
    codigo: row.item.codigoDisciplina || '',
    nome: row.item.nomeDisciplina || '',
    curso: cursoOptions.find(option => option.value === row.item.curso.value)?.value || cursoOptions[row.item.curso.idCurso - 1]?.value || '',
    professor: row.item.professorDisciplina || '',
    quantidade: row.item.quantidadeAluno?.toString() || '',
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
    return !Object.values(formData).some(isEmptyString);
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
        isSubmitting: true,
      }));
      return;
    }

    setState((prev) => ({ ...prev, showLoader: true }));

    const cursoIndex = cursoOptions.findIndex(opt => opt.value === formData.curso);

    const disciplinaDTO = {
      idDisciplina: formData.id,
      codigoDisciplina: formData.codigo,
      nomeDisciplina: formData.nome,
      curso: cursoIndex !== -1 ? cursoIndex + 1 : null,
      professorDisciplina: formData.professor,
      quantidadeAluno: parseInt(formData.quantidade),
    };

    try {
      await editarDisciplina(disciplinaDTO);
      setIterationData((prev) => prev + 1);
      handleClose();
    } catch (error) {
      setState((prev) => ({
        ...prev,
        errorMessage: error?.response?.data || 'Erro ao editar disciplina.',
        showError: true,
      }));
    } finally {
      setState((prev) => ({ ...prev, showLoader: false, isSubmitting: false }));
    }
  };

  const fields = [
    {
      id: 'codigo',
      name: 'codigo',
      label: 'Código da Disciplina',
      placeholder: 'xxxxxx',
      value: formData.codigo,
      type: 'text',
    },
    {
      id: 'nome',
      name: 'nome',
      label: 'Nome da Disciplina',
      placeholder: 'Digite o nome da disciplina',
      value: formData.nome,
      type: 'text',
    },
    {
      id: 'professor',
      name: 'professor',
      label: 'Professor(a) Responsável',
      placeholder: 'Nome do professor',
      value: formData.professor,
      type: 'text',
    },
    {
      id: 'quantidade',
      name: 'quantidade',
      label: 'Quantidade de Alunos',
      placeholder: 'Quantidade de alunos',
      value: formData.quantidade,
      type: 'number',
    },
  ];

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-opacity-30 bg-gray-300'>
      <div className='bg-white p-7 rounded-md shadow-lg'>
        <h2 className='text-2xl font-bold text-black mb-5'>
          <div className="flex justify-center mb-2">
            {state.showLoader && <Loading />}
          </div>
          Editar Disciplina
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

          <div className='flex flex-col'>
            <SelectField
              id='curso'
              name='curso'
              label='Curso'
              options={cursoOptions}
              value={formData.curso}
              onChange={handleChange('curso')}
            />
            {isEmptyString(formData.curso) && state.isSubmitting && (
              <h5 className='text-red-500 text-sm self-start'>*Insira o curso da disciplina</h5>
            )}
          </div>

          <div className="hidden md:block"></div>

          <div className='flex flex-col md:flex-row items-center md:justify-end gap-3 md:gap-5 col-span-1 md:col-span-2'>
            <button
              type='button'
              onClick={handleClose}
              className='border-2 border-americanOrange-500 text-americanOrange-500 px-3 py-1 rounded-md hover:bg-americanOrange-50'
              aria-label='Cancelar edição da disciplina'
            >
              Cancelar
            </button>
            <button
              type='submit'
              className='border-2 border-americanOrange-500 bg-americanOrange-500 text-white px-3 py-1 rounded-md hover:bg-americanOrange-600 hover:border-americanOrange-600'
              aria-label='Salvar edição da disciplina'
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSubject;