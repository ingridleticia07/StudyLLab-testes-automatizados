import InputField from '../Inputs/InputField';
import SelectField from '../SelectField/SelectField';
import { createDisciplina } from '../../../../platform/repository/disciplina';
import { useState } from 'react';

const RegisterSubject = ({ handleCancel }) => {
    /* Colocar nos values o ID do curso especifico */
    const [nomeDisciplina, setNomeDisciplina] = useState('');
    const [professorDisciplina, setProfessorDisciplina] = useState('');
    const [curso, setCurso] = useState([]);
    const [quantidadeAluno, setQuantidadeAluno] = useState('');
    const [codigoDisciplina, setCodigoDisciplinaa] = useState('');

    const cursoOptions = [
        { value: 'computacao', label: 'Ciência da Computação' },
        { value: 'software', label: 'Engenharia de Software' },
        { value: 'producao', label: 'Engenharia de Produção' },
        { value: 'mecanica', label: 'Engenharia Mecânica' },
        { value: 'civil', label: 'Engenharia Civil' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const disciplinaDTO = {
            nomeDisciplina:nomeDisciplina,
            professorDisciplina:professorDisciplina,
            curso:curso,
            quantidadeAluno:quantidadeAluno,
            codigoDisciplina:codigoDisciplina
        };
        console.log(disciplinaDTO)
        /*try {
            await createDisciplina(disciplinaDTO);
            alert('Disciplina cadastrada com sucesso!');
        } catch (error) {
            console.error('Erro ao cadastrar disciplia:', error);
        }*/
    };

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-opacity-30 bg-gray-300'>
            <div className='bg-white p-7 rounded-md shadow-lg'>
                <h2 className='text-2xl font-bold text-black mb-5'>
                    Cadastrar Disciplina
                </h2>
                <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                    <InputField
                        id='codigo'
                        name='codigo'
                        label='Código da Disciplina'
                        placeholder='xxxxxx'
                        required 
                        value={codigoDisciplina}
                        onChange={(e) => setCodigoDisciplinaa(e.target.value)}
                    />
                    <InputField
                        id='nome'
                        name='nome'
                        label='Nome da disciplina'
                        placeholder='Digite o nome da discipliana'
                        required
                        value={nomeDisciplina}
                        onChange={(e) => setNomeDisciplina(e.target.value)}
                    />
                    <SelectField
                        id='curso'
                        name='curso'
                        label='Curso'
                        options={cursoOptions}
                        value={curso}
                        onChange={(e) => setCurso(e.target.value)}
                    />
                    <InputField
                        id='professor'
                        name='professor'
                        label='Professor(a) Responsável'
                        placeholder='Quantidade de alunos'
                        required
                        value={professorDisciplina}
                        onChange={(e) => setProfessorDisciplina(e.target.value)}
                    />
                    <InputField
                        id='professor'
                        name='professor'
                        label='Professor(a) Responsável'
                        placeholder='Quantidade de alunos'
                        required
                        value={quantidadeAluno}
                        onChange={(e) => setQuantidadeAluno(e.target.value)}
                    />
                    <div className='flex items-center justify-end gap-5'>
                        <button
                            onClick={handleCancel}
                            className='border-2 border-americanOrange-500 text-americanOrange-500 px-3 py-1 rounded-md hover:bg-americanOrange-50'
                            aria-label='Cancelar cadastro da disciplina'
                        >
                            Cancelar
                        </button>
                        <button
                            className='border-2 border-americanOrange-500 bg-americanOrange-500 text-white px-3 py-1 rounded-md hover:bg-americanOrange-600 hover:border-americanOrange-600'
                            type='submit'
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

export default RegisterSubject;
