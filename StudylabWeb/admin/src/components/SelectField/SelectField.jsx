const SelectField = ({ id, name, label, options, value = '', onChange }) => {
    return (
        <div className='flex flex-col'>
            <label htmlFor={id} className='font-bold text-gray-500'>
                {label}
            </label>
            <select
                name={name}
                id={id}
                required
                className='border-2 rounded-lg pl-4 py-2 mt-2 min-w-96 text-lg focus:border-americanOrange-500 outline-none'
                value={value}
                onChange={onChange}
            >
                <option value=''>Selecione o Curso</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectField;
