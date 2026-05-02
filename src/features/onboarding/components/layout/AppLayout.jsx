import StepSidebar from "./StepSidebar";

const AppLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#0B0B0F] text-white">

      {/* Sidebar — fixed width, full height */}
      <StepSidebar />

      {/* Main content — scrollable, accounts for fixed bottom nav */}
      <main className="flex-1 overflow-y-auto h-screen px-10">
        {children}
      </main>

    </div>
  );
};

export default AppLayout;