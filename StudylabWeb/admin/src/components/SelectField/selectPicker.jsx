import { SelectPicker,CustomProvider  } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import { ptBR } from 'rsuite/esm/locales';

const SelectField = ({ id, label, options, defaultValue = 0, onChange }) => {
    
    return (
        <div className="flex flex-col col">
            <label htmlFor={id} className="font-bold text-gray-500">
                {label}
            </label>
            <CustomProvider locale={ptBR} > 
                {!defaultValue > 0  ?(
                    <SelectPicker
                        id={id}
                        data={options}
                        value={options.value}
                        onChange={onChange}
                        placeholder="Selecione..."
                        menuMaxHeight={200}
                        cleanable={false}
                        className='custom-select'
                    />
                ):(
                    <SelectPicker
                        id={id}
                        data={options}
                        value={options.value}
                        defaultValue={defaultValue}
                        onChange={onChange}
                        placeholder="Selecione..."
                        menuMaxHeight={200}
                        cleanable={false}
                        className='custom-select'
                    />
                )}
            </CustomProvider>
        </div>
    );
};

export default SelectField;
