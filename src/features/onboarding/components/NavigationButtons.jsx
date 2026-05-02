const FileUpload = ({ label }) => {
  return (
    <div className="p-8 border border-dashed border-white/20 rounded-2xl text-center hover:border-purple-500/40 hover:bg-white/5 transition">
      <p className="text-sm font-medium text-white">{label}</p>
      <p className="text-xs text-gray-400 mt-1">
        Drop file or click to upload
      </p>
    </div>
  );
};