
import StepSidebar from "./StepSidebar";

const AppLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#0B0B0F] text-white">
      
      {/* Sidebar */}
      <StepSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>

    </div>
  );
};

export default AppLayout;