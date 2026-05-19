import { useEffect, useState } from "react";
import SubmissionTable from "../components/tables/SubmissionTable";
import { getSubmissions } from "../services/submissionService";

export default function Rejected() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSubmissions();

        const filtered = data.filter(
          (item) =>
            item.status?.toString().trim().toLowerCase() === "rejected"
        );

        setSubmissions(filtered);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <SubmissionTable
      submissions={submissions}
      title="Rejected Submissions"
      isApprovedPage={false}
    />
  );
}