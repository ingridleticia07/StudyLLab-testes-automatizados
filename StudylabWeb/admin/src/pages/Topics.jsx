import { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Button from '../components/Buttons/Button';
import TableTopics from '../components/Tables/TableTopics';
import RegisterSubject from '../components/RegisterSubject/RegisterSubject';
import { getAllTopicosDisciplinaWithPagination } from "../../../platform/repository/topico";
import Filter from '../components/Filter/Filter';

const Topics = () => {
    const [showRegister, setShowRegister] = useState(false);
    const [cursoFilter, setCursoFilter] = useState('');
    const [topicos, setTopicos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [iterationData, setIterationData] = useState(0);
    const [ hasData, SetHasData ] = useState(true);

    useEffect(() => {
        const getTopicosDisciplinas = async () => {
            
            try {
                
                const idCurso = cursoFilter || 0;
                let currentPageFilter = currentPage || 1;

                let topicosList = await getAllTopicosDisciplinaWithPagination(currentPageFilter, 10);
                
                setTopicos(topicosList);
                if(topicosList.topicoCount == 0)
                    SetHasData(false);
                else
                    SetHasData(true);

                if(currentPage > topicosList.maxPage || currentPage == 0){
                    currentPageFilter = topicosList.maxPage;
                    setCurrentPage(currentPageFilter)
                }
            } catch (error) {
                console.log(error);
            }
        };
        getTopicosDisciplinas();
        
    }, [currentPage, cursoFilter, iterationData]);

    return (
        <div className="flex flex-col h-full">
            <Breadcrumb page="Disciplina" />
            
            <section className='rounded-xl bg-white px-4 '>
                <div className="flex flex-wrap items-center gap-2 px-4 py-4">
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <h1 className="text-3xl font-bold">Tópicos</h1>
                        {/*<Filter data={topicos} setTopicos={setTopicos} setCurrentPage={setCurrentPage}/>*/}
                    </div>
                    
                    <div className="flex-grow flex justify-end"> {/* Added mt-4 for some top margin and px for horizontal padding */}
                        <Button
                            text="Cadastrar Tópico"
                            handleClick={() => setShowRegister(true)}
                            className="w-full sm:w-auto"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto px-2 sm:px-6">
                    <TableTopics
                        data={topicos}
                        setTopicos={setTopicos}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        setIterationData={setIterationData}
                        hasData={hasData}
                    />
                </div>
            </section>

            {showRegister && (
                <RegisterSubject
                    handleCancel={() => setShowRegister(false)}
                    setIterationData={setIterationData}
                    currentPage={currentPage}
                />
            )}
        </div>
    );
};

export default Topics;
