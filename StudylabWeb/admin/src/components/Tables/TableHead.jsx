const TableHead = ({ headers }) => {
    return (
        <thead className='sticky top-0 bg-gray-100 border-b-2 uppercase font-semibold shadow-md'>
            <tr>
                {headers.map((header, i) => (
                    <th key={i} className='px-4 py-2'>
                        {header}
                    </th>
                ))}
            </tr>
        </thead>
    );
};

export default TableHead;
