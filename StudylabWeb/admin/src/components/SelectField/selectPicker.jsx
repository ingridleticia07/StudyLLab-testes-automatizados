import { SelectPicker,CustomProvider  } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import { ptBR } from 'rsuite/esm/locales';

const SelectField = ({ id, label, options, value, onChange }) => {
    
    return (
        <div className="flex flex-col">
            <label htmlFor={id} className="font-bold text-gray-500">
                {label}
            </label>
            <CustomProvider locale={ptBR}> 
                <SelectPicker
                    id={id}
                    data={options}
                    value={options.value}
                    onChange={onChange}
                    placeholder="Selecione..."
                    style={{ width: '100%', marginTop: '0.5rem' }}
                    menuMaxHeight={200}
                              className="custom-select-full-width" 

                />
            </CustomProvider>
        </div>
    );
};

export default SelectField;
