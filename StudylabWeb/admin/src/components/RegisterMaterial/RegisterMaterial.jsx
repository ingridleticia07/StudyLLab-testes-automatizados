import { useState } from 'react';
import FileInputField from '../Inputs/FileInputField';
import { saveMaterial } from '../../../../platform/repository/material';
import FilterTopic from '../../components/Filter/FilterTopic';
const RegisterMaterial = ({ handleCancel,setTopicoFilter,selectedTopicos, setCurrentPage}) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [topico, setTopico] = useState('');
    
    function getCookie(name) {
        const cookies = document.cookie.split('; ');
        const cookie = cookies.find(row => row.startsWith(`${name}=`));
        return cookie ? cookie.split('=')[1] : null;
    }

    const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files)); // Converte FileList em array
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedFiles.length) {
            alert('Por favor, selecione ao menos um arquivo.');
            return;
        }

        let idUser = getCookie('id-user');

        const materialDTO = {
            Idtopico:topico,
            TipoMaterial:3,
            File:selectedFiles,
            IdUsuario:idUser
        };

        try {
            await saveMaterial(materialDTO);
            alert('Upload realizado com sucesso!');
        } catch (error) {
            console.error('Erro ao enviar o arquivo:', error);
            alert('Erro no upload');
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
                        required
                        onChange={handleFileChange}
                        multiple // permite múltiplos arquivos
                    />

                    <FilterTopic setTopicoFilter={setTopico} topicos={selectedTopicos} setCurrentPage={setCurrentPage}/>

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
