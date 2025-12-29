export const Textarea: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  error?: string;
}> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  required = false,
  error
}) => {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className={`
          w-full px-4 py-2.5 rounded-lg border transition-colors resize-none
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
          ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}
        `}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
