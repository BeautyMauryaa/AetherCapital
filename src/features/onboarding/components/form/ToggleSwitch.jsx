

const ToggleSwitch = ({ label, checked, onChange }) => {
  return (
    <div className="flex justify-between items-center">
      <p>{label}</p>
      <button
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full ${
          checked ? "bg-purple-500" : "bg-gray-600"
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full transition ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;