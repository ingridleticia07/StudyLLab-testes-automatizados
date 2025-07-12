import InputField from '../Inputs/InputField';
import SelectField from '../SelectField/SelectField';
import { createDisciplina } from '../../../../platform/repository/disciplina';
import { useState } from 'react';
import AlertError from "../../components/Alerts/AlertErro";
import Loading from '../../components/Loading/LoadingForm';
import {isEmptyString} from "../../../../common/services/validation";
import { getAllDisciplinasWithPagination } from "../../../../platform/repository/disciplina";

const RegisterSubject = ({ handleCancel,setDisciplinas,currentPage }) => {
    /* Colocar nos values o ID do curso especifico */
    const [nomeDisciplina, setNomeDisciplina] = useState('');
    const [professorDisciplina, setProfessorDisciplina] = useState('');
    const [curso, setCurso] = useState([]);
    const [quantidadeAluno, setQuantidadeAluno] = useState('');
    const [codigoDisciplina, setCodigoDisciplinaa] = useState('');
    const [AlertText, setAlertText] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showError, setShowError] = useState(false);
    const [isFormSubmited, setIsFormSubmited] = useState(false);
    const [canTry,setCanTry] = useState(true);

    const cursoOptions = [
        { value: 'CC', label: 'Ciência da Computação' },
        { value: 'ES', label: 'Engenharia de software' },
        { value: 'EM', label: 'Engenharia da Mecânica' },
        { value: 'EP', label: 'Engenharia de produção' },
        { value: 'EC', label: 'Engenharia civil' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsFormSubmited(true);
        setCanTry(false);
        setShowError(false);

        if (!canTry) return;

        const disciplinaDTO = {
            nomeDisciplina:nomeDisciplina,
            professorDisciplina:professorDisciplina,
            curso:curso,
            quantidadeAluno:quantidadeAluno,
            codigoDisciplina:codigoDisciplina
        };

        if(!(isEmptyString(nomeDisciplina) || isEmptyString(professorDisciplina))){
            try {
                await createDisciplina(disciplinaDTO);
                alert('Disciplina cadastrada com sucesso!');
                let disciplinas = await getAllDisciplinasWithPagination(currentPage,10);
                setDisciplinas(disciplinas);
                setIsFormSubmited(false);
            } catch (error) {
                console.error('Erro ao cadastrar disciplina:', error);
                setShowError(true);
                setIsFormSubmited(false);
                setAlertText("Erro ao cadastrar disciplina!");
            }
        }else{
            setIsFormSubmited(false);
        }
        setCanTry(true);
    };

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-opacity-30 bg-gray-300'>
            <div className='bg-white p-7 rounded-md shadow-lg'>
                <h2 className='text-2xl font-bold text-black mb-5'>
                    <div className="flex justify-center mb-2">
                        {isFormSubmited &&  <Loading/>}
                    </div>
                    Cadastrar Disciplina
                </h2>
                <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-4'>
                    {showError && (
                        <div className="col-span-2">
                            <AlertError onHide={() => setShowError(false)} text={AlertText} />
                        </div>
                    )}

                    <div className="flex flex-col">
                        <InputField
                        id='codigo'
                        name='codigo'
                        label='Código da Disciplina'
                        placeholder='xxxxxx'
                        value={codigoDisciplina}
                        onChange={(e) => setCodigoDisciplinaa(e.target.value)}
                        />
                        {codigoDisciplina.length <= 0 && isFormSubmited && (
                        <h5 className="text-red-500 text-sm self-start">
                            *Insira o código da disciplina
                        </h5>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <InputField
                        id='nome'
                        name='nome'
                        label='Nome da disciplina'
                        placeholder='Digite o nome da discipliana'
                        value={nomeDisciplina}
                        onChange={(e) => setNomeDisciplina(e.target.value)}
                        />
                        {nomeDisciplina.length <= 0 && isFormSubmited && (
                        <h5 className="text-red-500 text-sm self-start">
                            *Insira o nome da disciplina
                        </h5>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <SelectField
                            id='curso'
                            name='curso'
                            label='Curso'
                            options={cursoOptions}
                            value={curso}
                            onChange={(e) => setCurso(e.target.value)}
                        />
                        {curso.length <= 0 && isFormSubmited && (
                        <h5 className="text-red-500 text-sm self-start">
                            *Insira o curso da disciplina
                        </h5>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <InputField
                        id='professor'
                        name='professor'
                        label='Professor(a) Responsável'
                        placeholder='Nome do professor'
                        value={professorDisciplina}
                        onChange={(e) => setProfessorDisciplina(e.target.value)}
                        />
                        {professorDisciplina.length <= 0 && isFormSubmited && (
                        <h5 className="text-red-500 text-sm self-start">
                            *Insira o professor da disciplina
                        </h5>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <InputField
                            id='quantidade'
                            name='quantidade'
                            label='Quantidade de Alunos'
                            placeholder='Quantidade de alunos'
                            value={quantidadeAluno}
                            onChange={(e) => setQuantidadeAluno(e.target.value)}
                        />
                        {quantidadeAluno.length <= 0 && isFormSubmited && (
                        <h5 className="text-red-500 text-sm self-start">
                            *Insira a quantidade de alunos da disciplina
                        </h5>
                        )}
                    </div>

                    {/* Preenchendo o espaço ao lado de "quantidade" para manter layout em par */}
                    <div></div>

                    <div className='flex items-center justify-end gap-5 col-span-2'>
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
