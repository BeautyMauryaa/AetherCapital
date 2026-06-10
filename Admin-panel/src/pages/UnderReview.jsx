import { useEffect, useState } from "react";
import SubmissionTable from "../components/tables/SubmissionTable";
import { getSubmissions } from "../services/submissionService";

export default function UnderReview() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSubmissions();

        const filtered = data.filter(
          (item) =>
            item.status
              ?.toString()
              .trim()
              .toLowerCase() === "under_review"
        );

        setSubmissions(filtered);

      } catch (error) {
        console.error("Under Review Fetch Error:", error);
      }
    };

    fetchData();
  }, []);

  

  return (
    <SubmissionTable
      submissions={submissions}
      title="Under Review Submissions"
      isApprovedPage={false}
    />
  );
}
