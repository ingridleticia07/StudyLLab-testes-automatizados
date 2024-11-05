import { icons } from '../assets/assets';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import StatusTag from '../components/StatusTag/StatusTag';
import TableFoot from '../components/TableFoot/TableFoot';
import TableHead from '../components/TableHead/TableHead';
import TableRow from '../components/TableRow/TableRow';

const Report = () => {
    const tableCols = [
        '#',
        'título',
        'disciplina',
        'autor',
        'data',
        'status',
        'ações',
    ];

    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    // const data = false

    return (
        <div className='flex flex-col h-full'>
            <Breadcrumb page={'Denúncias'} />
            <section className='bg-white flex flex-col rounded-lg h-full mb-4 min-h-[450px] px-3'>
                <div className='flex items-center justify-between'>
                    <h1 className='text-3xl font-bold py-8'>Denúncias</h1>
                    <button
                        disabled={!data}
                        aria-label='filtro'
                        className='flex h-12 items-center gap-4 mr-4 font-bold text-gray-800 text-xl border-2 rounded-lg px-4 py-6 shadow-md disabled:bg-gray-200 disabled:opacity-90'
                    >
                        <img src={icons.filter} alt='Filtro' />
                        Filtro
                    </button>
                </div>
                <div className='overflow-y-scroll h-full max-h-[350px] rounded-md'>
                    <table className='min-w-full h-full text-left border-separate border-spacing-0'>
                        <TableHead cols={tableCols} />
                        <tbody>
                            {data.map((d, i) => (
                                <tr key={i}>
                                    <TableRow
                                        content={<input type='checkbox' />}
                                    />
                                    <TableRow content={'Lista 2 de Lógica'} />
                                    <TableRow
                                        content={'Lógica para Computação'}
                                    />
                                    <TableRow content={'Alicia Santos'} />
                                    <TableRow content={'01/11/2023'} />
                                    <TableRow
                                        content={
                                            <StatusTag
                                                status={'green'}
                                                text={'aprovado'}
                                            />
                                        }
                                    />
                                    <TableRow
                                        content={
                                            <div className='flex gap-5'>
                                                <button aria-label='visualizar'>
                                                    <img
                                                        src={icons.eyeOpen}
                                                        alt='Visualizar'
                                                    />
                                                </button>
                                                <button aria-label='bloquear'>
                                                    <img
                                                        src={icons.block}
                                                        alt='bloquear'
                                                    />
                                                </button>
                                                <button aria-label='excluir'>
                                                    <img
                                                        src={icons.deleteIcon}
                                                        alt='Excluir'
                                                    />
                                                </button>
                                            </div>
                                        }
                                    />
                                </tr>
                            ))}
                        </tbody>
                        <TableFoot cols={7} />
                    </table>
                </div>
            </section>
        </div>
    );
};

export default Report;
