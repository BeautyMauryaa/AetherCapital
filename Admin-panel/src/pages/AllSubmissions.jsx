import { useEffect, useState } from "react";
import SubmissionTable from "../components/tables/SubmissionTable";
import { getSubmissions } from "../services/submissionService";


export default function AllSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  
  // Active Filter States
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [riskFilter, setRiskFilter] = useState("All Risk");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSubmissions();
        setSubmissions(data || []);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    };
    fetchData();
  }, []);

  // Compute filtered submissions dataset client-side
  const filteredSubmissions = submissions.filter((item) => {
    const matchType = typeFilter === "All Types" || 
      (item.accountType || item.type)?.toLowerCase() === typeFilter.toLowerCase();
      
    const matchStatus = statusFilter === "All Status" || 
      (item.status)?.toLowerCase().replace("_", " ") === statusFilter.toLowerCase();
      
    // Risk bands split logic (e.g., Low < 40, Medium 40-74, High >= 75)
    let matchRisk = true;
    if (riskFilter === "Low Risk") matchRisk = (item.riskScore || 0) < 40;
    if (riskFilter === "Medium Risk") matchRisk = (item.riskScore || 0) >= 40 && (item.riskScore || 0) < 75;
    if (riskFilter === "High Risk") matchRisk = (item.riskScore || 0) >= 75;

    return matchType && matchStatus && matchRisk;
  });

  return (
    <main className="w-full min-h-screen px-4 py-6 md:px-8 md:py-12 bg-[#f9fafb]">
      <div className="max-w-7xl mx-auto">
        <SubmissionTable
          submissions={filteredSubmissions}
          title="All Submissions"
          // Pass state controls directly down as configuration props
          filterState={{ typeFilter, setTypeFilter, statusFilter, setStatusFilter, riskFilter, setRiskFilter }}
        />
      </div>
    </main>
  );
}
