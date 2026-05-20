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

  if (!loading && submissions.length === 0) {
    return (
      <Card sx={{ borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0px 1px 3px rgba(0,0,0,0.05)", p: 8, textAlign: "center" }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              bgcolor: '#f9fafb', 
              border: '1px dashed #e5e7eb', 
              borderRadius: '16px', 
              width: 64, 
              height: 64,
              color: '#ef4444' // Using theme matching color pop
            }}
          >
            <ManageSearchRounded sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight="700" sx={{ color: "#111827" }}>
              No applications under review
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280", mt: 0.5 }}>
              All caught up! There are no submissions waiting for review here.
            </Typography>
          </Box>
        </Box>
      </Card>
    );
  }

  return (
    <SubmissionTable
      submissions={submissions}
      title="Under Review Submissions"
      isApprovedPage={false}
    />
  );
}
