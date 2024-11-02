const TableHead = () => {
    return (
        <thead className='table-header-group bg-gray-100 border-b-2 uppercase font-semibold'>
            <tr>
                <th scope='col'>
                    <input type='checkbox' disabled />
                </th>
                <th scope='col'>Código</th>
                <th scope='col' className='text-start'>
                    Nome da Disciplina
                </th>
                <th scope='col' className='text-start'>
                    Professor(a)
                </th>
                <th scope='col' className='text-start'>
                    Curso
                </th>
                <th scope='col'>Alunos</th>
                <th scope='col'>Ações</th>
            </tr>
        </thead>
    );
};

export default TableHead;
