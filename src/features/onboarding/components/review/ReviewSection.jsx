const ReviewSection = ({ title, data }) => {
  return (
    <div className="mb-6 p-4 bg-white/10 rounded">
      <div className="flex justify-between mb-3">
        <h3>{title}</h3>
        <button className="text-purple-400 text-sm">Edit</button>
      </div>

      <pre className="text-xs text-gray-300">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default ReviewSection;