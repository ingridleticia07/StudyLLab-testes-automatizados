import { useState } from 'react';
import FileInputField from '../Inputs/FileInputField';
import { saveMaterial } from '../../../../platform/repository/material';
import FilterTopic from '../../components/Filter/FilterTopic';
import SelectField from '../SelectField/SelectField';
import {toast } from 'react-toastify';

const RegisterMaterial = ({ handleCancel,setTopicoFilter,selectedTopicos, setCurrentPage}) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [topico, setTopico] = useState('');
    const [isSubmitting, SetIsSubmitting] = useState(false);
    const [typeMaterial, setTypeMaterial] = useState('');

    const typeOption = [
        { value: '1', label: 'Prova' },
        { value: '2', label: 'Trabalho' },
        { value: '3', label: 'Artigo' },
        { value: '4', label: 'Tarefa' },
        { value: '5', label: 'Pesquisa' },
        { value: '6', label: 'Tcc' },
        { value: '7', label: 'Outros' }
    ];

    const handleChange = (field) => (e) => {
        setTypeMaterial(e.target.value);
    };

    function getCookie(name) {
        const cookies = document.cookie.split('; ');
        const cookie = cookies.find(row => row.startsWith(`${name}=`));
        return cookie ? cookie.split('=')[1] : null;
    }

    const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files)); // Converte FileList em array
    };

    const handleSubmit = async (e) => {
        SetIsSubmitting(true);
        e.preventDefault();

        if (selectedFiles.length == 0 || topico.length == 0 || typeMaterial.length == 0) {
            return;
        }

        let idUser = getCookie('id-user');

        const materialDTO = {
            Idtopico:topico,
            TipoMaterial:typeMaterial,
            File:selectedFiles,
            IdUsuario:idUser
        };

        try {
            await saveMaterial(materialDTO);
            toast.success('Upload realizado com sucesso!', {
                theme: 'colored',
                position: 'top-center',
                autoClose: 1300,
            });
            handleCancel();
        } catch (error) {
            
            toast.error('Erro no upload!', {
                theme: 'colored',
                position: 'top-center',
                autoClose: 1300,
            });
        }
    };

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-opacity-30 bg-gray-300'>
            <div className='bg-white p-7 rounded-md shadow-lg'>
                <h2 className='text-2xl font-bold text-black mb-5'>Cadastrar conteúdo</h2>
                <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                    <FileInputField
                        id='files'
                        name='files'
                        label='Selecione os arquivos'
                        placeholder='Selecione os arquivos'
                        onChange={handleFileChange}
                        multiple // permite múltiplos arquivos
                    />
                    {!selectedFiles.length && isSubmitting && (
                        <h5 className="text-red-500 text-sm self-start">
                        *Insira ao menos um arquivo, até 3 imagens ou 1 pdf.
                        </h5>
                    )}

                    <div className="flex flex-col">
                        <SelectField
                            id='typeMaterial'
                            name='typeMaterial'
                            label='Tipo de material'
                            fisrtField='tipo de material'
                            options={typeOption}
                            value={typeMaterial}
                            onChange={handleChange('typeMaterial')}
                        />
                        {typeMaterial.length <= 0 && isSubmitting && (
                            <h5 className="text-red-500 text-sm self-start">
                            *Insira o tipo de material.
                            </h5>
                        )}
                    </div>
                    <label className='font-bold text-gray-500'>Selecione o tópico:</label>
                    <FilterTopic setTopicoFilter={setTopico} topicos={selectedTopicos} setCurrentPage={setCurrentPage}/>
                    
                    {topico.length <= 0 && isSubmitting && (
                        <h5 className="text-red-500 text-sm self-start">
                        *Insira o tópico.
                        </h5>
                    )}
                    <div className='flex items-center justify-end gap-5'>
                        <button
                            type='button'
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

export default RegisterMaterial;
