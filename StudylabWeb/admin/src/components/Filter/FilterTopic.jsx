import React, {useRef } from 'react';
import { icons } from '../../assets/assets';
import { SelectPicker,CustomProvider } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import { ptBR } from 'rsuite/esm/locales';

const TopicFilter = ({ setTopicoFilter, topicos, setCurrentPage,copulateTopico=true }) => {
  const prevDisciplinaFilter = useRef('');

  const handleDisciplinaSelect = (topico) => {
    if (prevDisciplinaFilter.current !== topico)
      setCurrentPage(1)
    if(copulateTopico == true)
        setTopicoFilter(topico)
  };

  return (
    <div className="w-full md:w-auto">
        <CustomProvider locale={ptBR} > 
            <SelectPicker
              id="topicos"
              data={topicos}
              defaultValue=""
              value={topicos.value}
              onChange={handleDisciplinaSelect}
              menuMaxHeight={110}
              cleanable={false}
              appearance="default"
              style={{ width: '100%' }}
              className="w-full md:w-[220px] hidden-selector !rounded-md !border !shadow-sm !px-0 !py-0 !bg-white text-sm font-medium text-gray-700 hover:!bg-gray-100 focus:!outline-none focus:!ring-2 focus:!ring-offset-2 focus:!ring-indigo-10"
              // Quando uma opção estiver selecionada
              renderValue={(value, item) => (
                <div className="flex items-center gap-2">
                    <img src={icons.filter} alt="Filtro" className="w-5 h-5" />
                    <span>{item?.label || "Tópicos"}</span>  
                </div>
              )}
            />
        </CustomProvider>
    </div>
  );
};

export default TopicFilter;