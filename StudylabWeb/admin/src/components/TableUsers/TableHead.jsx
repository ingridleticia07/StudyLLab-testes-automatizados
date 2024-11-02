const TableHead = () => {
    return (
        <thead className='table-header-group bg-gray-100 border-b-2 uppercase font-semibold'>
            <tr className="">
                <th scope='col'>
                    <input type='checkbox' disabled />
                </th>
                <th scope='col'>Matrícula</th>
                <th scope='col' className='text-start'>
                    Aluno(a)
                </th>
                <th scope='col' className='text-start '>
                    Curso
                </th>
                <th scope='col' className='text-start'>
                    Email
                </th>
                <th scope='col'>Ações</th>
            </tr>
        </thead>
    );
};

export default TableHead;
