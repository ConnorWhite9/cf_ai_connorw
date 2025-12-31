const TextInput = ({ label, name, value, onChange, placeholder, required = false }: any) => (
  <div>
    <label className="block text-sm font-medium text-emerald-200 mb-1">
      {label} {required && '*'}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2.5 bg-gray-900 border border-green-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-gray-100 placeholder-gray-500"
      placeholder={placeholder}
    />
  </div>
);


export default TextInput;