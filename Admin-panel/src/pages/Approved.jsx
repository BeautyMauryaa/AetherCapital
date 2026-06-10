import { useEffect, useState } from "react";
import SubmissionTable from "../components/tables/SubmissionTable";
import { getSubmissions } from "../services/submissionService";

export default function Approved() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchApproved = async () => {
      try {
        const data = await getSubmissions();

        console.log("Raw API Data:", data);

        const allItems = data || [];

        const approvedOnly = allItems.filter((item) =>
          item.status?.toString().trim().toLowerCase() === "approved"
        );

        console.log("Filtered Data:", approvedOnly);

        setSubmissions(approvedOnly);

      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchApproved();
  }, []);

  return (
    <SubmissionTable
      submissions={submissions}
      title="Approved Submissions"
      isApprovedPage={true}
    />
  );
}