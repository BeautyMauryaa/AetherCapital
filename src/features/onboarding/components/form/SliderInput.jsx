
const SliderInput = ({ label, value, onChange }) => {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-2">{label}</p>
      <input
        type="range"
        min={1}
        max={200}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <p className="text-sm mt-2">{value}</p>
    </div>
  );
};

export default SliderInput;