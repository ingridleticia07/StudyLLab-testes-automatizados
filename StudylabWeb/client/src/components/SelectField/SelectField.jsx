const SelectField = ({ id, label, options, value, onChange, Placeholder }) => {

    return (
        <div className="mb-4 w-full max-w-full">
            <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-700"
            >
                {label}
            </label>
            <select
                id={id}
                value={value}
                onChange={onChange}
                className={`w-full p-2 border border-gray-300 rounded-md bg-white ${
                    value ? 'text-gray-700' : 'text-gray-400'
                }`}
            >
                <option value="" disabled hidden>
                    {Placeholder}
                </option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectField;