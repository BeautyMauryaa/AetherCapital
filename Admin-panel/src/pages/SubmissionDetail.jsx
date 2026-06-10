import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Typography,
  Avatar,
  Chip,
  Button,
  Grid,
  Divider,
  CircularProgress,
  Paper,
  Stack,
} from "@mui/material";
import {
  ArrowBackRounded,
  OpenInNewRounded,
  CheckCircleRounded,
  CancelRounded,
  ManageSearchRounded,
  DescriptionRounded,
} from "@mui/icons-material";
import { useAdminStore } from "../store/adminStore";
import StatusUpdateModal from "../components/tables/StatusUpdateModal";

const STATUS_COLORS = {
  approved: { color: "#2e7d32", bg: "#e8f5e9" },
  rejected: { color: "#c62828", bg: "#ffebee" },
  submitted: { color: "#b45309", bg: "#fef3c7" },
  under_review: { color: "#0277bd", bg: "#e1f5fe" },
};

const Field = ({ label, value }) => (
  <Box>
    <Typography
      sx={{
        fontSize: 11,
        fontWeight: 700,
        color: "#94a3b8",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        mb: 0.5,
      }}
    >
      {label}
    </Typography>
    <Typography sx={{ fontSize: 14, color: "#0f172a", fontWeight: 500 }}>
      {value || "—"}
    </Typography>
  </Box>
);

export default function SubmissionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchSubmission, updateStatus, loading } = useAdminStore();
  const [submission, setSubmission] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchSubmission(id).then((s) => setSubmission(s));
  }, [id]);

  if (loading && !submission) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!submission) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Submission not found.</Typography>
        <Button onClick={() => navigate("/submissions")} sx={{ mt: 2 }}>
          ← Back
        </Button>
      </Box>
    );
  }

  const sc = STATUS_COLORS[submission.status] || STATUS_COLORS.submitted;
  const riskColor =
    submission.riskScore >= 60
      ? "#ef4444"
      : submission.riskScore >= 30
        ? "#f59e0b"
        : "#10b981";

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Button
          startIcon={<ArrowBackRounded />}
          onClick={() => navigate("/submissions")}
          sx={{ textTransform: "none", color: "#64748b" }}
        >
          Back
        </Button>
        <Typography sx={{ fontWeight: 700, fontSize: 20, flex: 1 }}>
          Submission Detail
        </Typography>
        {/* Quick action buttons */}
        <Button
          startIcon={<ManageSearchRounded />}
          variant="outlined"
          size="small"
          onClick={() => {
            setModalOpen(true);
          }}
          sx={{ textTransform: "none", borderRadius: 2, mr: 1 }}
        >
          Update Status
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Left column */}
        <Grid item xs={12} md={8}>
          {/* Identity Card */}
          <Card
            elevation={0}
            sx={{ p: 3, mb: 3, borderRadius: 3, border: "1px solid #e2e8f0" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  fontSize: 20,
                  fontWeight: 700,
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                }}
              >
                {submission.firstName?.[0]}
                {submission.lastName?.[0]}
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
                  {submission.firstName} {submission.lastName}
                </Typography>
                <Typography sx={{ fontSize: 13, color: "#64748b" }}>
                  {submission.email}
                </Typography>
              </Box>
              <Box sx={{ ml: "auto" }}>
                <Chip
                  label={submission.status?.replace("_", " ")}
                  sx={{
                    bgcolor: sc.bg,
                    color: sc.color,
                    fontWeight: 700,
                    textTransform: "capitalize",
                  }}
                />
              </Box>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2.5}>
              <Grid item xs={6} sm={4}>
                <Field label="Account Type" value={submission.accountType} />
              </Grid>

              <Grid item xs={6} sm={4}>
                <Field label="Nationality" value={submission.nationality} />
              </Grid>

              <Grid item xs={6} sm={4}>
                <Field label="Gender" value={submission.gender} />
              </Grid>

              <Grid item xs={6} sm={4}>
                <Field label="City" value={submission.address?.city} />
              </Grid>

              <Grid item xs={6} sm={4}>
                <Field label="Country" value={submission.address?.country} />
              </Grid>

              <Grid item xs={6} sm={4}>
                <Field label="State" value={submission.address?.state} />
              </Grid>

              <Grid item xs={6} sm={4}>
                <Field
                  label="Postal Code"
                  value={submission.address?.postalCode}
                />
              </Grid>

              <Grid item xs={6} sm={4}>
                <Field label="Timezone" value={submission.address?.timezone} />
              </Grid>

              <Grid item xs={6} sm={4}>
                <Field
                  label="Submitted"
                  value={
                    submission.submittedAt
                      ? new Date(submission.submittedAt).toLocaleDateString()
                      : "—"
                  }
                />
              </Grid>
            </Grid>
          </Card>

          {/* Compliance */}
          <Card
            elevation={0}
            sx={{ p: 3, mb: 3, borderRadius: 3, border: "1px solid #e2e8f0" }}
          >
            <Typography sx={{ fontWeight: 700, mb: 2 }}>
              Compliance & Risk
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Box
                sx={{
                  flex: 1,
                  height: 8,
                  bgcolor: "#e2e8f0",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${submission.riskScore}%`,
                    height: "100%",
                    bgcolor: riskColor,
                    borderRadius: 4,
                    transition: "width 0.5s",
                  }}
                />
              </Box>
              <Typography
                sx={{ fontWeight: 700, color: riskColor, minWidth: 60 }}
              >
                {submission.riskScore}/100
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Field
                  label="2FA Enabled"
                  value={submission.twoFactorEnabled ? "Yes" : "No"}
                />
              </Grid>
              <Grid item xs={6}>
                <Field
                  label="2FA Method"
                  value={submission.twoFactorMethod || "Not Provided"}
                />
              </Grid>
              {submission.roles?.length > 0 && (
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      mb: 1,
                    }}
                  >
                    Roles
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {submission.roles.map((r) => (
                      <Chip
                        key={r}
                        label={r}
                        size="small"
                        sx={{ fontSize: 12, fontWeight: 600 }}
                      />
                    ))}
                  </Stack>
                </Grid>
              )}
            </Grid>
          </Card>
          {submission.permissions &&
            Object.keys(submission.permissions).length > 0 && (
              <Grid item xs={12} mt={2}>
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    mb: 1,
                  }}
                >
                  Access Matrix
                </Typography>

                <Box
                  sx={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  {Object.entries(submission.permissions).map(
                    ([module, level]) => (
                      <Box
                        key={module}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          px: 2,
                          py: 1.2,
                          borderBottom: "1px solid #e2e8f0",
                        }}
                      >
                        <Typography sx={{ fontSize: 14 }}>{module}</Typography>

                        <Chip
                          label={level}
                          size="small"
                          color={
                            level === "ADMIN"
                              ? "secondary"
                              : level === "WRITE"
                                ? "success"
                                : "primary"
                          }
                        />
                      </Box>
                    ),
                  )}
                </Box>
              </Grid>
            )}

          {/* Review note */}
          {submission.reviewNote && (
            <Card
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                bgcolor: "#f8fafc",
              }}
            >
              <Typography sx={{ fontWeight: 700, mb: 1 }}>
                Review Note
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#475569" }}>
                {submission.reviewNote}
              </Typography>
              {submission.reviewedAt && (
                <Typography sx={{ fontSize: 12, color: "#94a3b8", mt: 1 }}>
                  Reviewed: {new Date(submission.reviewedAt).toLocaleString()}
                </Typography>
              )}
            </Card>
          )}
        </Grid>

        {/* Right column — Documents */}
        <Grid item xs={12} md={4}>
          {/* ID Documents */}
          <Card
            elevation={0}
            sx={{ p: 3, mb: 3, borderRadius: 3, border: "1px solid #e2e8f0" }}
          >
            <Typography sx={{ fontWeight: 700, mb: 2 }}>
              Identity Documents
            </Typography>
            {[
              { label: "Profile Photo", file: submission.profileImage },
              { label: "ID — Front", file: submission.idFront },
              { label: "ID — Back", file: submission.idBack },
            ].map(({ label, file }) => (
              <Box key={label} sx={{ mb: 2 }}>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#64748b",
                    mb: 0.5,
                  }}
                >
                  {label}
                </Typography>
                {file?.directUrl ? (
                  <Box sx={{ position: "relative" }}>
                    <img
                      src={file.directUrl}
                      alt={label}
                      style={{
                        width: "100%",
                        maxHeight: 140,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "1px solid #e2e8f0",
                      }}
                    />
                    <Button
                      href={file.webViewLink}
                      target="_blank"
                      size="small"
                      startIcon={<OpenInNewRounded sx={{ fontSize: 14 }} />}
                      sx={{
                        mt: 0.5,
                        textTransform: "none",
                        fontSize: 11,
                        p: 0.5,
                      }}
                    >
                      View in Drive
                    </Button>
                  </Box>
                ) : (
                  <Typography
                    sx={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}
                  >
                    Not uploaded
                  </Typography>
                )}
              </Box>
            ))}
          </Card>

          {/* Compliance documents */}
          {submission.documents?.length > 0 && (
            <Card
              elevation={0}
              sx={{ p: 3, borderRadius: 3, border: "1px solid #e2e8f0" }}
            >
              <Typography sx={{ fontWeight: 700, mb: 2 }}>
                Compliance Documents
              </Typography>
              {submission.documents.map((doc, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 1.5,
                    p: 1.5,
                    bgcolor: "#f8fafc",
                    borderRadius: 2,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <DescriptionRounded sx={{ color: "#6366f1", fontSize: 20 }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {doc.fileName}
                    </Typography>
                  </Box>
                  {doc.webViewLink && (
                    <Button
                      href={doc.webViewLink}
                      target="_blank"
                      size="small"
                      sx={{ minWidth: 0, p: 0.5 }}
                    >
                      <OpenInNewRounded sx={{ fontSize: 16 }} />
                    </Button>
                  )}
                </Box>
              ))}
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Status Update Modal */}
      <StatusUpdateModal
        open={modalOpen}
        onClose={async (refresh) => {
          setModalOpen(false);

          if (refresh) {
            const updated = await fetchSubmission(id);

            setSubmission(updated);
          }
        }}
        submission={submission}
      />
    </Box>
  );
}
