export const Input: React.FC<{
  label: string;
  type?: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  helper?: string;
}> = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helper
}) => {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`
          w-full px-4 py-2.5 rounded-lg border transition-colors
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
          ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}
        `}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {helper && !error && <p className="text-sm text-gray-500">{helper}</p>}
    </div>
  );
};