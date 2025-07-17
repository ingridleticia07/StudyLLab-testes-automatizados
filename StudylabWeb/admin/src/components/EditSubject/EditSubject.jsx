import { toast } from 'react-toastify';
import { useState, useContext } from 'react';
import InputField from '../Inputs/InputField';
import SelectField from '../SelectField/SelectField';
import { StudylabContext } from '../../context/StudylabContext';

const EditSubject = ({ row, handleClose }) => {
    const { editSubject } = useContext(StudylabContext);

    const cursoOptions = [
        { value: 'ES', label: 'Engenharia de Software' },
        { value: 'CC', label: 'Ciência da Computação' },
        { value: 'EC', label: 'Engenharia Civil' },
        { value: 'EP', label: 'Engenharia de Produção' },
        { value: 'EM', label: 'Engenharia Mecânica' }
    ];

    const [formData, setFormData] = useState({
        codigo: row.item.codigoDisciplina || '',
        nomeDisciplina: row.item.nomeDisciplina || '',
        curso: cursoOptions[row.item.curso.idCurso - 1]?.value || '',
        professor: row.item.professorDisciplina || '',
    });
    
    const notifyEdit = () => {
        toast.success('Item Editado', {
            theme: 'colored',
            position: 'top-center',
            autoClose: 1300,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = (e) => {
        e.preventDefault(); // Evita o reload da página
        editSubject({
            id: item.id, // Preserva o ID original
            ...formData,
        });
        notifyEdit();
        handleClose();
    };

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-opacity-30 bg-gray-300'>
            <div className='bg-white p-7 rounded-md shadow-lg'>
                <h2 className='text-2xl font-bold text-black mb-5'>
                    Editar Disciplina
                </h2>
                <form
                    action='#'
                    className='flex flex-col gap-5'
                    onSubmit={handleEdit}
                >
                    <InputField
                        id='codigo'
                        name='codigo'
                        label='Código da Disciplina'
                        placeholder='xxxxxx'
                        value={formData.codigo}
                        onChange={handleChange}
                        required
                    />
                    <InputField
                        id='nomeDisciplina'
                        name='nomeDisciplina'
                        label='Nome da disciplina'
                        placeholder='Digite o nome da discipliana'
                        value={formData.nomeDisciplina}
                        onChange={handleChange}
                        required
                    />
                    <SelectField
                        id='curso'
                        name='curso'
                        label='Curso'
                        value={formData.curso}
                        options={cursoOptions}
                        onChange={handleChange}
                    />
                    <InputField
                        id='professor'
                        name='professor'
                        label='Professor(a) Responsável'
                        placeholder='Nome do Professor(a)'
                        value={formData.professor}
                        onChange={handleChange}
                        required
                    />
                    <div className='flex items-center justify-end gap-5'>
                        <button
                            onClick={handleClose}
                            className='border-2 border-americanOrange-500 text-americanOrange-500 px-3 py-1 rounded-md hover:bg-americanOrange-50'
                            aria-label='Cancelar edição da disciplina'
                        >
                            Cancelar
                        </button>
                        <button
                            className='border-2 border-americanOrange-500 bg-americanOrange-500 text-white px-3 py-1 rounded-md hover:bg-americanOrange-600 hover:border-americanOrange-600'
                            type='submit'
                            aria-label='Editar disciplina'
                        >
                            Editar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSubject;
