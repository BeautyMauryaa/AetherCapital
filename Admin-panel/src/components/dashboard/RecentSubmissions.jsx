import {
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Button,
  Box,
} from "@mui/material";

import { useEffect, useState } from "react"; // ✅ FIXED: Added missing useState hook
import { useAdminStore } from "../../store/adminStore";
import SubmissionDrawer from "../drawers/SubmissionDrawer";

export default function RecentSubmissions() {
  const { submissions = [], fetchSubmissions } = useAdminStore();
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const recent = submissions.slice(0, 6);

  const getRiskColor = (score) => {
    if (score >= 80) return "error.main";
    if (score >= 40) return "warning.main";
    return "success.main";
  };

  const handleView = (submission) => {
    setSelectedSubmission(submission);
    setDrawerOpen(true);
  };
  
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="subtitle1" fontWeight="700">
          Recent Submissions
        </Typography>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ bgcolor: "#F8F9FC" }}>
            <TableRow>
              <TableCell sx={{ fontSize: "0.75rem", fontWeight: 700, color: "text.secondary" }}>
                APPLICANT
              </TableCell>
              <TableCell sx={{ fontSize: "0.75rem", fontWeight: 700, color: "text.secondary" }}>
                TYPE
              </TableCell>
              <TableCell sx={{ fontSize: "0.75rem", fontWeight: 700, color: "text.secondary" }}>
                RISK
              </TableCell>
              <TableCell sx={{ fontSize: "0.75rem", fontWeight: 700, color: "text.secondary" }}>
                STATUS
              </TableCell>
              <TableCell align="right" sx={{ fontSize: "0.75rem", fontWeight: 700, color: "text.secondary" }}>
                ACTION
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {recent.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                  <Typography variant="body2" color="text.secondary">
                    No submissions found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              recent.map((sub) => (
                <TableRow key={sub._id} hover>
                  {/* Applicant */}
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: "primary.main", fontSize: "0.875rem" }}>
                        {(sub.firstName?.[0] || "U").toUpperCase()}
                        {(sub.lastName?.[0] || "").toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="600">
                          {sub.firstName || "Unknown"} {sub.lastName || ""}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {sub.email || "No Email"}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Account Type */}
                  <TableCell>
                    <Chip
                      label={
                        sub.accountType
                          ? sub.accountType.charAt(0).toUpperCase() + sub.accountType.slice(1)
                          : "Unknown"
                      }
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>

                  {/* Risk */}
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 14,
                          height: 4,
                          borderRadius: 2,
                          bgcolor: getRiskColor(Number(sub.riskScore || 0)),
                        }}
                      />
                      <Typography variant="body2" fontWeight="700">
                        {sub.riskScore || 0}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Chip
                      label={sub.status?.replace("_", " ") || "Unknown"}
                      size="small"
                      color={
                        sub.status === "approved"
                          ? "success"
                          : sub.status === "rejected"
                            ? "error"
                            : sub.status === "under_review" || sub.status === "submitted"
                              ? "warning" // ✅ FIXED: Captures both pending review states gracefully
                              : "info"
                      }
                      sx={{
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}
                    />
                  </TableCell>

                  {/* Action */}
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                      }}
                      onClick={() => handleView(sub)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ✅ ADDED: Submission Drawer Mounting Interceptor Component */}
      <SubmissionDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        submission={selectedSubmission}
      />
    </Card>
  );
}
