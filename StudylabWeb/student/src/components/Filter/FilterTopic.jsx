import React from 'react';
import { icons } from '../../assets/assets';
import { SelectPicker, CustomProvider } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import { ptBR } from 'rsuite/esm/locales';

const FilterTopic = ({ setTopicoFilter, topicos, setCurrentPage, topicoFilter, copulateTopico = true }) => {

    const handleTopicoSelect = (topico) => {
        setCurrentPage(1);
        if (copulateTopico)
            setTopicoFilter(topico);
    };

    return (
        <div className="w-full md:w-auto">
            <CustomProvider locale={ptBR}>
                <SelectPicker
                    id="topicos"
                    data={topicos}
                    value={topicoFilter || 0}
                    onChange={handleTopicoSelect}
                    menuMaxHeight={200}
                    cleanable={false}
                    appearance="default"
                    style={{ width: '100%' }}
                    className="w-full md:w-[220px] hidden-selector"
                    renderValue={(value, item) => (
                        <div className="flex items-center gap-2">
                            <img src={icons.filter} alt="Filtro" className="w-5 h-5" />
                            <span className='text-gray-700'>{item?.label || "Tópicos"}</span>
                        </div>
                    )}
                />
            </CustomProvider>
        </div>
    );
};

export default FilterTopic;