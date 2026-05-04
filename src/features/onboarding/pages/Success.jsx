const Success = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">

      <div className="text-4xl mb-4">✅</div>

      <h1 className="text-2xl mb-2">Application submitted</h1>
      <p className="text-gray-400 mb-6">
        We’ll review and get back to you.
      </p>

      <button className="px-4 py-2 bg-purple-500 rounded">
        Start Over
      </button>
    </div>
  );
};

export default Success;