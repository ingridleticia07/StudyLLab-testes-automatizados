import React, {useRef } from 'react';
import { icons } from '../../assets/assets';
import { SelectPicker,CustomProvider } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import { ptBR } from 'rsuite/esm/locales';


const TopicsFilter = ({ setDisciplinaFilter, disciplinas, setCurrentPage }) => {
  const prevDisciplinaFilter = useRef('');

  const handleDisciplinaSelect = (disciplina) => {
    if (prevDisciplinaFilter.current !== disciplina)
      setCurrentPage(1)

    setDisciplinaFilter(disciplina)
  };

  return (
    <div className="flex flex-col col">
        <CustomProvider locale={ptBR} > 
            <SelectPicker
              id="topicos"
              data={disciplinas}
              defaultValue=""
              value={disciplinas.value}
              onChange={handleDisciplinaSelect}
              menuMaxHeight={200}
              cleanable={false}
              appearance="default"
              style={{ width: 220 }}
              // Quando uma opção estiver selecionada
              renderValue={(value, item) => (
                <div className="flex items-center gap-2">
                    <img src={icons.filter} alt="Filtro" className="w-5 h-5" />
                    <span>{item?.label || "Todas as disciplinas"}</span>  
                </div>
              )}

                className="hidden-selector !rounded-md !border !shadow-sm !px-0 !py-0 !bg-white text-sm font-medium text-gray-700 hover:!bg-gray-100 focus:!outline-none focus:!ring-2 focus:!ring-offset-2 focus:!ring-indigo-10"
            />


        </CustomProvider>
    </div>
  );
};

export default TopicsFilter;
