import React, {useRef } from 'react';
import { icons } from '../../assets/assets';
import { SelectPicker,CustomProvider } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import { ptBR } from 'rsuite/esm/locales';

const SubjectFilter = ({ setDisciplinaFilter, disciplinas, setCurrentPage }) => {
  const prevDisciplinaFilter = useRef('');

  const handleDisciplinaSelect = (disciplina) => {
    if (prevDisciplinaFilter.current !== disciplina)
      setCurrentPage(1)

    setDisciplinaFilter(disciplina)
  };

  return (
    <div className="w-full md:w-auto">
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
              style={{ width: '100%' }}
              className="w-full md:w-[220px] hidden-selector"
              // Quando uma opção estiver selecionada
              renderValue={(value, item) => (
                <div className="flex items-center gap-2">
                  <img src={icons.filter} alt="Filtro" className="w-5 h-5" />
                  <span className='text-gray-700'>{item?.label || "Todas as disciplinas"}</span>  
                </div>
              )}
            />
        </CustomProvider>
    </div>
  );
};

export default SubjectFilter;