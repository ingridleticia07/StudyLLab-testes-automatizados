import TableFoot from '../TableFoot/TableFoot';
import TableHead from './TableHead';
import TableRow from './TableRow';

const TableUses = () => {
    return (
        <div className='overflow-y-auto h-[350px]'>
            <table className='min-w-full border-separate border-spacing-y-4 table-auto'>
                <TableHead />
                <tbody className='h-[238px]'>
                    <TableRow
                        matricula={999999}
                        aluno={'fulano de beltrano'}
                        curso={'ciencia da computação'}
                        email={'fulanobeltrano2332@gmail.com'}
                    />
                    <TableRow
                        matricula={999999}
                        aluno={'fulano de beltrano'}
                        curso={'ciencia da computação'}
                        email={'fulanobeltrano2332@gmail.com'}
                    />
                    <TableRow
                        matricula={999999}
                        aluno={'fulano de beltrano'}
                        curso={'ciencia da computação'}
                        email={'fulanobeltrano2332@gmail.com'}
                    />
                    <TableRow
                        matricula={999999}
                        aluno={'fulano de beltrano'}
                        curso={'ciencia da computação'}
                        email={'fulanobeltrano2332@gmail.com'}
                    />
                    <TableRow
                        matricula={999999}
                        aluno={'fulano de beltrano'}
                        curso={'ciencia da computação'}
                        email={'fulanobeltrano2332@gmail.com'}
                    />
                    <TableRow
                        matricula={999999}
                        aluno={'fulano de beltrano'}
                        curso={'ciencia da computação'}
                        email={'fulanobeltrano2332@gmail.com'}
                    />
                    <tr className="h-full"></tr>
                </tbody>
                <TableFoot cols={4} />
            </table>
        </div>
    );
};

export default TableUses;
