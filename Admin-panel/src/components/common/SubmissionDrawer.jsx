import React, { useState, useEffect } from "react";
import API from "../../services/api";
import {
  Drawer,
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  IconButton,
  Divider,
  Tab,
  Tabs,
  Grid,
  CircularProgress,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
import {
  CloseRounded,
  OpenInNewRounded,
  DescriptionRounded,
  LocationOnOutlined,
  MapOutlined,
} from "@mui/icons-material";
import { useAdminStore } from "../../store/adminStore";
import { updateSubmissionStatus } from "../../services/submissionService";

// ── Status chip styles (Optimized for light background) ──────────────────────────
const STATUS_STYLE = {
  approved: { color: "#065f46", bg: "#d1fae5" },
  rejected: { color: "#991b1b", bg: "#fee2e2" },
  submitted: { color: "#92400e", bg: "#fef3c7" },
  pending: { color: "#92400e", bg: "#fef3c7" },
  under_review: { color: "#1e40af", bg: "#dbeafe" },
};

// ── Small label+value pair ─────────────────────────────────────────────────────
const Field = ({ label, value }) => (
  <Box>
    <Typography
      sx={{
        fontSize: 10,
        fontWeight: 700,
        color: "#64748b", // Slate label text
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        mb: 0.5,
      }}
    >
      {label}
    </Typography>
    <Typography sx={{ fontSize: 13, color: "#0f172a", fontWeight: 600 }}>
      {value || "—"}
    </Typography>
  </Box>
);

// ── Doc tile component ─────────────────────────────────────────────────────────
const DocTile = ({ label, file }) => (
  <Box
    sx={{
      border: "1px solid #e2e8f0",
      borderRadius: 3,
      p: 2,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 1,
      bgcolor: "#f8fafc",
      minHeight: 110,
      justifyContent: "center",
      textAlign: "center",
    }}
  >
    {file?.directUrl ? (
      <>
        <img
          src={file.directUrl}
          alt={label}
          style={{
            width: "100%",
            maxHeight: 70,
            objectFit: "cover",
            borderRadius: 6,
          }}
        />
        <Typography sx={{ fontSize: 11, color: "#475569", fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: 10, color: "#10b981", fontWeight: 700 }}>
          Uploaded
        </Typography>
        {file.webViewLink && (
          <Button
            href={file.webViewLink}
            target="_blank"
            size="small"
            startIcon={<OpenInNewRounded sx={{ fontSize: 12 }} />}
            sx={{
              fontSize: 10,
              textTransform: "none",
              p: "2px 6px",
              color: "#2563eb",
            }}
          >
            View
          </Button>
        )}
      </>
    ) : (
      <>
        <DescriptionRounded sx={{ fontSize: 24, color: "#94a3b8" }} />
        <Typography sx={{ fontSize: 11, color: "#475569", fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: 10, color: "#10b981", fontWeight: 600 }}>
          Uploaded
        </Typography>
      </>
    )}
  </Box>
);

// ─────────────────────────────────────────────────────────────────────────────
export default function SubmissionDrawer({ open, onClose, submission }) {
  const updateStatus = useAdminStore((s) => s.updateStatus);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [localSubmission, setLocalSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissionDetail = async () => {
      try {
        if (!submission?._id) return;
        const res = await API.get(`/admin/submissions/${submission._id}`);
        setLocalSubmission(res.data.data.submission);
      } catch (error) {
        console.error("Drawer fetch error:", error);
      }
    };
    fetchSubmissionDetail();
  }, [submission]);

  if (!localSubmission) {
    return (
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: { 
            width: { xs: "100vw", sm: 540 }, 
            bgcolor: "#ffffff",
            borderLeft: "1px solid #e2e8f0",
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress size={28} sx={{ color: "#2563eb" }} />
        </Box>
      </Drawer>
    );
  }

  const currentStatus = localSubmission.status?.toLowerCase() || "pending";
  const sc = STATUS_STYLE[currentStatus] || STATUS_STYLE.submitted;

  const riskColor =
    localSubmission.riskScore >= 75
      ? "#ef4444"
      : localSubmission.riskScore >= 40
        ? "#f59e0b"
        : "#10b981";

  const handleAction = async (status) => {
    setLoading(true);
    const res = await updateStatus(localSubmission._id, status, note);
    setLoading(false);

    if (res.success) {
      setLocalSubmission((prev) => ({
        ...prev,
        status,
        reviewNote: note,
        reviewedAt: new Date(),
      }));
      setNote("");
    }
  };

  const riskScore = localSubmission.riskScore || 0;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100vw", sm: 540 },
          display: "flex",
          flexDirection: "column",
          bgcolor: "#ffffff", // FIXED: White background container
          borderLeft: "1px solid #e2e8f0",
        },
      }}
    >
      {/* ── Header ── */}
      <Box sx={{ px: 3, pt: 3, pb: 1, borderBottom: "1px solid #e2e8f0" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              width: 44,
              height: 44,
              fontSize: "0.9rem",
              fontWeight: 700,
              bgcolor: "#2563eb",
              color: "#ffffff"
            }}
          >
            {localSubmission.firstName?.[0]}
            {localSubmission.lastName?.[0]}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 18,
                color: "#0f172a", // FIXED: Bold dark text color for name
                letterSpacing: "-0.01em",
              }}
            >
              {localSubmission.firstName} {localSubmission.lastName}
            </Typography>
            <Typography sx={{ fontSize: 11, color: "#64748b", mt: 0.25 }}>
              Ref: {localSubmission._id?.toString().slice(-7).toUpperCase()} ·
              Submitted{" "}
              {localSubmission.submittedAt
                ? new Date(localSubmission.submittedAt).toLocaleDateString(
                    "en-GB",
                    { day: "2-digit", month: "short", year: "numeric" },
                  )
                : "—"}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Chip
                label={localSubmission.accountType || "Business"}
                size="small"
                sx={{
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: "capitalize",
                  bgcolor: "#f1f5f9",
                  color: "#475569",
                }}
              />
              <Chip
                label={currentStatus.replace("_", " ")}
                size="small"
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "capitalize",
                  bgcolor: sc.bg, 
                  color: sc.color,
                }}
              />
            </Box>
          </Box>

          <IconButton
            onClick={onClose}
            size="small"
            sx={{ border: "1px solid #cbd5e1", borderRadius: 2, p: 0.5 }}
          >
            <CloseRounded sx={{ fontSize: 16, color: "#64748b" }} />
          </IconButton>
        </Box>

        {/* Tab Selection Row */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mt: 2,
            minHeight: 38,
            "& .MuiTabs-indicator": { bgcolor: "#2563eb", height: 2 },
            "& .MuiTab-root": {
              fontSize: "0.78rem",
              fontWeight: 600,
              minHeight: 38,
              textTransform: "none",
              color: "#64748b !important", 
              px: 1.5,
              "&.Mui-selected": { color: "#2563eb !important" }, 
            },
          }}
        >
          <Tab label="Personal Info" />
          <Tab label="Address" />
          <Tab label="Roles" />
          <Tab label="Compliance" />
          <Tab label="Documents" />
          <Tab label="Notes" />
        </Tabs>
      </Box>

      {/* ── Scrollable Body Area ── */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 3, bgcolor: "#ffffff" }}>
        {/* TAB 0 — Personal Info */}
        {tab === 0 && (
          <Grid container spacing={2.5}>
            <Grid item xs={6}>
              <Field
                label="Full Name"
                value={`${localSubmission.firstName || ""} ${localSubmission.lastName || ""}`.trim()}
              />
            </Grid>
            <Grid item xs={6}>
              <Field label="Email" value={localSubmission.email} />
            </Grid>
            <Grid item xs={6}>
              <Field
                label="Phone"
                value={localSubmission.phone || "+91 7838426134"}
              />
            </Grid>
            <Grid item xs={6}>
              <Field
                label="Date of Birth"
                value={
                  localSubmission.dateOfBirth
                    ? new Date(localSubmission.dateOfBirth).toLocaleDateString(
                        "en-GB",
                      )
                    : "26/09/1981"
                }
              />
            </Grid>
            <Grid item xs={6}>
              <Field
                label="Nationality"
                value={localSubmission.nationality || "Indian"}
              />
            </Grid>
            <Grid item xs={6}>
              <Field
                label="Account Type"
                value={localSubmission.accountType || "Business"}
              />
            </Grid>

            {localSubmission.accountType?.toLowerCase() !== "individual" && (
              <>
                <Grid item xs={6}>
                  <Field
                    label="Company Name"
                    value={
                      localSubmission.companyName ||
                      localSubmission.legalName ||
                      "—"
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    label="Industry"
                    value={localSubmission.industry || "Education"}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    label="Employees"
                    value={localSubmission.employeeRange || "200+"}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12} sx={{ mt: 1 }}>
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  mb: 1.5,
                }}
              >
                ID Documents
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <DocTile label="ID Front" file={localSubmission.idFront} />
                </Grid>
                <Grid item xs={6}>
                  <DocTile label="ID Back" file={localSubmission.idBack} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}

        {/* TAB 1 — Address Specs */}
        {tab === 1 && (
          <Box>
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 700,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                mb: 1.5,
              }}
            >
              Primary Address
            </Typography>

            <Box
              sx={{
                border: "1px solid #e2e8f0",
                borderRadius: 3,
                p: 2,
                bgcolor: "#f8fafc",
                display: "flex",
                gap: 1.5,
                mb: 3,
                alignItems: "flex-start",
              }}
            >
              <LocationOnOutlined
                sx={{ color: "#ef4444", fontSize: 18, mt: 0.25 }}
              />
              <Box>
                <Typography
                  sx={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}
                >
                  {localSubmission.address?.street || "607 MG Road"},{" "}
                  {localSubmission.address?.city || "Hyderabad"}
                </Typography>
                <Typography sx={{ fontSize: 11, color: "#64748b", mt: 0.5 }}>
                  PIN: {localSubmission.address?.postalCode || "984657"} ·{" "}
                  {localSubmission.address?.country || "United States"}
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={2.5} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Field
                  label="Country"
                  value={localSubmission.address?.country || "United States"}
                />
              </Grid>
              <Grid item xs={6}>
                <Field
                  label="Timezone"
                  value={localSubmission.address?.timezone || "GMT (UTC+0)"}
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                border: "1px solid #e2e8f0",
                borderRadius: 3,
                p: 4,
                bgcolor: "#f8fafc",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <MapOutlined sx={{ color: "#94a3b8", fontSize: 24 }} />
              <Typography
                sx={{ fontSize: 11, color: "#475569", fontWeight: 600 }}
              >
                Map preview placeholder
              </Typography>
              <Typography sx={{ fontSize: 10, color: "#94a3b8" }}>
                Address verification pending
              </Typography>
            </Box>
          </Box>
        )}

        {/* TAB 2 — Roles Engine */}
        {tab === 2 && (
          <Box>
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 700,
                color: "#64748b",
                textTransform: "uppercase",
                mb: 2,
                letterSpacing: "0.05em",
              }}
            >
              Assigned Roles
            </Typography>

            <Box display="flex" gap={1} flexWrap="wrap" mb={4}>
              {localSubmission.roles?.length > 0 ? (
                localSubmission.roles.map((role) => (
                  <Chip
                    key={role}
                    label={role}
                    size="small"
                    sx={{
                      bgcolor: "#f1f5f9",
                      color: "#0f172a",
                      fontWeight: 600,
                      border: "1px solid #e2e8f0",
                    }}
                  />
                ))
              ) : (
                <Typography sx={{ fontSize: 13, color: "#94a3b8" }}>No roles assigned</Typography>
              )}
            </Box>

            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 700,
                color: "#64748b",
                textTransform: "uppercase",
                mb: 2,
                letterSpacing: "0.05em",
              }}
            >
              Access Matrix
            </Typography>

            <Box
              sx={{
                border: "1px solid #e2e8f0",
                borderRadius: 3,
                overflow: "hidden",
                bgcolor: "#ffffff"
              }}
            >
              {Object.entries(localSubmission.permissions || {}).map(
                ([module, level], idx, arr) => (
                  <Box
                    key={module}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      px: 2,
                      py: 1.5,
                      borderBottom: idx === arr.length - 1 ? "none" : "1px solid #e2e8f0",
                    }}
                  >
                    <Typography sx={{ color: "#0f172a", fontSize: 13, fontWeight: 500, textTransform: "capitalize" }}>
                      {module.replace(/_/g, " ")}
                    </Typography>

                    <Chip
                      label={level}
                      size="small"
                      sx={{
                        fontSize: 10,
                        fontWeight: 700,
                        bgcolor: level === "ADMIN" ? "#f3e8ff" : level === "WRITE" ? "#d1fae5" : "#e0f2fe",
                        color: level === "ADMIN" ? "#6b21a8" : level === "WRITE" ? "#065f46" : "#0369a1"
                      }}
                    />
                  </Box>
                ),
              )}
            </Box>

            <Box mt={4} display="grid" gridTemplateColumns="1fr 1fr" gap={3}>
              <Box>
                <Typography
                  sx={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    mb: 0.5,
                    letterSpacing: "0.05em",
                  }}
                >
                  2FA Method
                </Typography>
                <Typography sx={{ color: "#0f172a", fontSize: 13, fontWeight: 600 }}>
                  {localSubmission.twoFactorMethod || "Not Provided"}
                </Typography>
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    mb: 0.5,
                    letterSpacing: "0.05em",
                  }}
                >
                  Department
                </Typography>
                <Typography sx={{ color: "#0f172a", fontSize: 13, fontWeight: 600 }}>
                  {localSubmission.departments?.length > 0
                    ? localSubmission.departments.join(", ")
                    : "Not Assigned"}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* TAB 3 — Compliance Data */}
        {tab === 3 && (
          <Box>
            <Box
              sx={{
                p: 2.5,
                bgcolor: "#f8fafc",
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                mb: 4,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1.5,
                }}
              >
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>
                  Risk Score
                </Typography>
                <Typography sx={{ fontSize: 22, fontWeight: 800, color: riskColor }}>
                  {riskScore}/100
                </Typography>
              </Box>

              <Box
                sx={{
                  height: 8,
                  bgcolor: "#e2e8f0",
                  borderRadius: 999,
                  overflow: "hidden",
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    width: `${Math.max(riskScore, 2)}%`,
                    height: "100%",
                    bgcolor: riskColor,
                    transition: "width 0.4s ease",
                  }}
                />
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography sx={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Low</Typography>
                <Typography sx={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Medium</Typography>
                <Typography sx={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>High</Typography>
                <Typography sx={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Critical</Typography>
              </Box>
            </Box>

            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 700,
                color: "#64748b",
                textTransform: "uppercase",
                mb: 2,
                letterSpacing: "0.05em",
              }}
            >
              Questionnaire
            </Typography>

            <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 3, overflow: "hidden", bgcolor: "#ffffff" }}>
              {Object.entries(localSubmission.questionnaire || {}).map(([key, value], idx, arr) => (
                <Box
                  key={key}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 2,
                    py: 1.5,
                    borderBottom: idx === arr.length - 1 ? "none" : "1px solid #e2e8f0",
                  }}
                >
                  <Typography sx={{ color: "#0f172a", fontSize: 13, fontWeight: 500, textTransform: "capitalize" }}>
                    {key.replace(/_/g, " ")}
                  </Typography>

                  <Chip
                    label={value ? "Yes" : "No"}
                    size="small"
                    sx={{
                      bgcolor: value ? "#d1fae5" : "#fee2e2",
                      color: value ? "#065f46" : "#991b1b",
                      fontWeight: 700,
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* TAB 4 — Documents */}
        {tab === 4 && (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <DocTile
                label="Profile Photo"
                file={localSubmission.profileImage}
              />
            </Grid>
            <Grid item xs={6}>
              <DocTile label="ID Front" file={localSubmission.idFront} />
            </Grid>
            <Grid item xs={12}>
              <DocTile label="ID Back" file={localSubmission.idBack} />
            </Grid>
          </Grid>
        )}

        {/* TAB 5 — Notes */}
        {tab === 5 && (
          <Box>
            {localSubmission.reviewNote && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#f8fafc",
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                  mb: 3,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#0f172a",
                    mb: 0.5,
                  }}
                >
                  Super Admin
                </Typography>
                <Typography
                  sx={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}
                >
                  {localSubmission.reviewNote}
                </Typography>
              </Box>
            )}
            <TextField
              fullWidth
              multiline
              minRows={3}
              placeholder="Add an internal note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  color: "#0f172a",
                  "& fieldset": { borderColor: "#cbd5e1" },
                  "&:hover fieldset": { borderColor: "#94a3b8" },
                },
                "& .MuiInputBase-input::placeholder": { color: "#94a3b8" },
              }}
            />
            <Button
              variant="contained"
              disabled={!note.trim()}
              onClick={async () => {
                await updateSubmissionStatus(
                  localSubmission._id,
                  localSubmission.status,
                  note,
                );
                setLocalSubmission((prev) => ({ ...prev, reviewNote: note }));
                setNote("");
              }}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                bgcolor: "#2563eb",
                boxShadow: "none",
              }}
            >
              Add Note
            </Button>
          </Box>
        )}
      </Box>

      {/* ── Footer ── */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid #e2e8f0",
          display: "flex",
          gap: 1,
          alignItems: "center",
          bgcolor: "#f8fafc",
        }}
      >
        <Button
          variant="contained"
          disabled={loading || currentStatus === "approved"}
          onClick={() => handleAction("approved")}
          sx={{
            bgcolor: "#10b981",
            "&:hover": { bgcolor: "#059669" },
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            fontSize: 12,
            height: 34,
            px: 2,
            boxShadow: "none",
            color: "#ffffff"
          }}
        >
          Approve
        </Button>
        <Button
          variant="contained"
          disabled={loading || currentStatus === "rejected"}
          onClick={() => handleAction("rejected")}
          sx={{
            bgcolor: "#ef4444",
            "&:hover": { bgcolor: "#dc2626" },
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            fontSize: 12,
            height: 34,
            px: 2,
            boxShadow: "none",
            color: "#ffffff"
          }}
        >
          Reject
        </Button>
        <Button
          variant="contained"
          disabled={loading || currentStatus === "under_review"}
          onClick={() => handleAction("under_review")}
          sx={{
            bgcolor: "#f59e0b",
            "&:hover": { bgcolor: "#d97706" },
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            fontSize: 12,
            height: 34,
            px: 2,
            boxShadow: "none",
            color: "#ffffff",
          }}
        >
          Flag Review
        </Button>

        <Select
          size="small"
          value={currentStatus}
          onChange={(e) => handleAction(e.target.value)}
          disabled={loading}
          sx={{
            ml: "auto",
            borderRadius: 2,
            fontSize: 12,
            fontWeight: 600,
            width: 125,
            height: 34,
            color: "#0f172a",
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#cbd5e1" },
            "& .MuiSelect-icon": { color: "#64748b" },
          }}
        >
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="under_review">Under Review</MenuItem>
          <MenuItem value="approved">Approved</MenuItem>
          <MenuItem value="rejected">Rejected</MenuItem>
        </Select>
      </Box>
    </Drawer>
  );
}
