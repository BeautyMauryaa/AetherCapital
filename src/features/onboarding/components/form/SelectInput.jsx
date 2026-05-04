
const SelectInput = ({ label, value, options, onChange }) => {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-2">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 rounded-lg bg-[#14141F] border border-white/10"
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;