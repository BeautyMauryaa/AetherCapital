
const TextInput = ({ label, value, onChange }) => {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-2">{label}</p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 rounded-lg bg-[#14141F] border border-white/10 focus:outline-none"
      />
    </div>
  );
};

export default TextInput;