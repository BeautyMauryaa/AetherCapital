import { useEffect, useState } from "react";
import SubmissionTable from "../components/tables/SubmissionTable";
import { getSubmissions } from "../services/submissionService";

export default function AllSubmissions() {

  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {

    const fetchData = async () => {

      try {

        const data =
        await getSubmissions();

        console.log("Fetched:", data);

        setSubmissions(data);

      } catch (error) {

        console.log(error);

      }

    };

    fetchData();

  }, []);

  return (
    <SubmissionTable
      submissions={submissions}
      title="All Submissions"
    />
  );
}