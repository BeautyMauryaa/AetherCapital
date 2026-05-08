import StepSidebar from "./StepSidebar";
import { useTheme } from "@/context/ThemeContext";

const AppLayout = ({ children }) => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen transition-colors duration-300"
         style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
      <StepSidebar />
      <main className="flex-1 overflow-y-auto h-screen px-4 md:px-10">
        <div className="max-w-5xl mx-auto py-6 md:py-10">
          {children}
        </div>
      </main>
    </div>
  );
};
export default AppLayout;