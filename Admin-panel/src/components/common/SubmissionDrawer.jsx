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
} from "@mui/icons-material";
import { useAdminStore } from "../../store/adminStore";
import { updateSubmissionStatus } from "../../services/submissionService";

// ── Status chip colours ────────────────────────────────────────────────────────
const STATUS_STYLE = {
  approved: { color: "#2e7d32", bg: "#e8f5e9" },
  rejected: { color: "#c62828", bg: "#ffebee" },
  submitted: { color: "#b45309", bg: "#fef3c7" },
  under_review: { color: "#0277bd", bg: "#e1f5fe" },
};

// ── Small label+value pair ─────────────────────────────────────────────────────
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
    <Typography sx={{ fontSize: 14, color: "#f8fafc", fontWeight: 500 }}>
      {value || "—"}
    </Typography>
  </Box>
);

// ── Doc tile (image preview or file icon) ─────────────────────────────────────
const DocTile = ({ label, file }) => (
  <Box
    sx={{
      border: "1px solid #e2e8f0",
      borderRadius: 2,
      p: 2,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 1,
      bgcolor: "#f8fafc",
      minHeight: 100,
      justifyContent: "center",
    }}
  >
    {file?.directUrl ? (
      <>
        <img
          src={file.directUrl}
          alt={label}
          style={{
            width: "100%",
            maxHeight: 80,
            objectFit: "cover",
            borderRadius: 6,
          }}
        />
        <Typography sx={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>
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
            sx={{ fontSize: 10, textTransform: "none", p: "2px 6px" }}
          >
            View
          </Button>
        )}
      </>
    ) : (
      <>
        <DescriptionRounded sx={{ fontSize: 28, color: "#cbd5e1" }} />
        <Typography sx={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: 10, color: "#94a3b8" }}>
          Not uploaded
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
  const [feedback, setFeedback] = useState(null); // { success, msg }
  const [localSubmission, setLocalSubmission] = useState(null);

  // Hook must run before any potential early return conditions
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
  // Safe Guard: Check if data is loaded after Hooks initialized
  if (!localSubmission) {
    return (
      <Box
        sx={{
          width: 540,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const sc = STATUS_STYLE[localSubmission.status] || STATUS_STYLE.submitted;
  const riskColor =
    localSubmission.riskScore >= 60
      ? "#ef4444"
      : localSubmission.riskScore >= 30
        ? "#f59e0b"
        : "#10b981";

  const handleAction = async (status) => {
    setLoading(true);
    setFeedback(null);

    const res = await updateStatus(localSubmission._id, status, note);
    setLoading(false);

    if (res.success) {
      setLocalSubmission((prev) => ({
        ...prev,
        status,
        reviewNote: note,
        reviewedAt: new Date(),
      }));

      setFeedback({
        success: true,
        msg: `Status updated to "${status.replace("_", " ")}"`,
      });
      setNote("");
    } else {
      setFeedback({
        success: false,
        msg: res.error || "Update failed",
      });
    }
  };

  const answers = localSubmission.questionnaire || {};
  const riskScore =
    localSubmission.riskScore ||
    Object.values(answers).filter((v) => v === true).length * 12.5;
  console.log(localSubmission);
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
        },
      }}
    >
      {/* ── Header ── */}
      <Box sx={{ px: 3, pt: 3, pb: 2, borderBottom: "1px solid #e2e8f0" }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <Avatar
            sx={{
              width: 52,
              height: 52,
              fontSize: 18,
              fontWeight: 700,
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            }}
          >
            {localSubmission.firstName?.[0]}
            {localSubmission.lastName?.[0]}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 18, lineHeight: 1.2 }}>
              {localSubmission.firstName} {localSubmission.lastName}
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#64748b", mt: 0.3 }}>
              Ref: {localSubmission._id?.toString().slice(-8).toUpperCase()} ·{" "}
              Submitted{" "}
              {localSubmission.submittedAt
                ? new Date(localSubmission.submittedAt).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    },
                  )
                : "—"}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
              <Chip
                label={localSubmission.accountType}
                size="small"
                sx={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "capitalize",
                  bgcolor: "#e0e7ff",
                  color: "#3730a3",
                }}
              />
              <Chip
                label={localSubmission.status?.replace("_", " ")}
                size="small"
                sx={{
                  fontSize: 11,
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
            sx={{ border: "1px solid #e2e8f0", borderRadius: 1.5 }}
          >
            <CloseRounded fontSize="small" />
          </IconButton>
        </Box>

        {/* Tabs with scroll safety fix */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mt: 2,
            minHeight: 36,
            "& .MuiTab-root": {
              fontSize: 12,
              fontWeight: 600,
              minHeight: 36,
              textTransform: "none",
              py: 0.5,
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

      {/* ── Scrollable content ── */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 2.5 }}>
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
              <Field label="Nationality" value={localSubmission.nationality} />
            </Grid>
            <Grid item xs={6}>
              <Field label="Gender" value={localSubmission.gender || "—"} />
            </Grid>
            <Grid item xs={6}>
              <Field label="Account Type" value={localSubmission.accountType} />
            </Grid>
            <Grid item xs={6}>
              <Field
                label="Date of Birth"
                value={
                  localSubmission.dateOfBirth
                    ? new Date(localSubmission.dateOfBirth).toLocaleDateString()
                    : "—"
                }
              />
            </Grid>

            {localSubmission.accountType !== "individual" && (
              <>
                <Grid item xs={6}>
                  <Field
                    label="Company Name"
                    value={
                      localSubmission.companyName || localSubmission.legalName
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field label="Trade Name" value={localSubmission.tradeName} />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    label="Reg. Number"
                    value={localSubmission.regNumber}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field label="Industry" value={localSubmission.industry} />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    label="Employees"
                    value={localSubmission.employeeRange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    label="Parent Co."
                    value={localSubmission.parentCompany}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  mb: 1.5,
                }}
              >
                ID Documents
              </Typography>
              <Grid container spacing={1.5}>
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

        {/* TAB 1 — Address */}
        {tab === 1 && (
  <Grid container spacing={2.5}>
    <Grid item xs={12}>
      <Field
        label="Street"
        value={localSubmission.address?.street || "—"}
      />
    </Grid>

    <Grid item xs={6}>
      <Field
        label="City"
        value={localSubmission.address?.city || "—"}
      />
    </Grid>

    <Grid item xs={6}>
      <Field
        label="State"
        value={localSubmission.address?.state || "—"}
      />
    </Grid>

    <Grid item xs={6}>
      <Field
        label="ZIP"
        value={localSubmission.address?.postalCode || "—"}
      />
    </Grid>

    <Grid item xs={6}>
      <Field
        label="Country"
        value={localSubmission.address?.country || "—"}
      />
    </Grid>

    <Grid item xs={12}>
      <Field
        label="Timezone"
        value={localSubmission.address?.timezone || "—"}
      />
    </Grid>

    {localSubmission.sameAsPrimary === false && (
      <>
        <Grid item xs={12}>
          <Divider sx={{ my: 1 }}>
            <Typography
              sx={{
                fontSize: 11,
                color: "#94a3b8",
              }}
            >
              MAILING ADDRESS
            </Typography>
          </Divider>
        </Grid>

        <Grid item xs={12}>
          <Field
            label="Mailing Street"
            value={localSubmission.mailingAddress?.street || "—"}
          />
        </Grid>

        <Grid item xs={6}>
          <Field
            label="Mailing City"
            value={localSubmission.mailingAddress?.city || "—"}
          />
        </Grid>

        <Grid item xs={6}>
          <Field
            label="Mailing ZIP"
            value={localSubmission.mailingAddress?.postalCode || "—"}
          />
        </Grid>
      </>
    )}
  </Grid>
)}

        {/* TAB 2 — Roles */}
        {tab === 2 && (
          <Box>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                mb: 1.5,
              }}
            >
              Assigned Roles
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
              {localSubmission.roles?.length > 0 ? (
                localSubmission.roles.map((r) => (
                  <Chip
                    key={r}
                    label={r}
                    sx={{
                      fontWeight: 600,
                      bgcolor: "#ede9fe",
                      color: "#5b21b6",
                    }}
                  />
                ))
              ) : (
                <Typography sx={{ fontSize: 13, color: "#94a3b8" }}>
                  No roles assigned
                </Typography>
              )}
            </Box>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                mb: 1.5,
              }}
            >
              2FA Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Field
                  label="2FA Enabled"
                  value={localSubmission.twoFactorEnabled ? "✓ Yes" : "✗ No"}
                />
              </Grid>
              <Grid item xs={6}>
                <Field label="Method" value={localSubmission.twoFactorMethod} />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* TAB 3 — Compliance */}
        {tab === 3 && (
          <Box>
            <Box
              sx={{
                p: 2.5,
                bgcolor: "#f8fafc",
                borderRadius: 2,
                border: "1px solid #e2e8f0",
                mb: 3,
              }}
            >
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                  Risk Score
                </Typography>
                <Typography
                  sx={{ fontSize: 20, fontWeight: 800, color: riskColor }}
                >
                  {riskScore}/100
                </Typography>
              </Box>
              <Box
                sx={{
                  height: 8,
                  bgcolor: "#e2e8f0",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${Math.max(riskScore, 2)}%`,
                    height: "100%",
                    bgcolor: riskColor,
                    borderRadius: 4,
                  }}
                />
              </Box>
            </Box>
            {Object.keys(answers).length > 0 && (
              <>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    mb: 1.5,
                  }}
                >
                  Compliance Questionnaire
                </Typography>
                {Object.entries(answers).map(([q, a]) => (
                  <Box
                    key={q}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      py: 1,
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 13,
                        color: "#475569",
                        textTransform: "capitalize",
                        flex: 1,
                        mr: 2,
                        lineHeight: 1.4,
                      }}
                    >
                      {q.replace(/_/g, " ")}
                    </Typography>
                    <Chip
                      label={a ? "YES" : "NO"}
                      size="small"
                      sx={{
                        fontSize: 10,
                        fontWeight: 700,
                        bgcolor: a ? "#fee2e2" : "#dcfce7",
                        color: a ? "#dc2626" : "#16a34a",
                      }}
                    />
                  </Box>
                ))}
              </>
            )}
          </Box>
        )}

        {/* TAB 4 — Documents */}
        {tab === 4 && (
          <Box>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                mb: 2,
              }}
            >
              Identity Documents
            </Typography>
            <Grid container spacing={1.5} sx={{ mb: 3 }}>
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
          </Box>
        )}

        {/* TAB 5 — Notes */}
        {tab === 5 && (
  <Box>

    {/* Previous Notes */}

    {localSubmission.reviewNote && (

      <Box
        sx={{
          p: 2.5,
          bgcolor: "#f8fafc",
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          mb: 3,
        }}
      >

        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: "#64748b",
            textTransform: "uppercase",
            mb: 1,
            letterSpacing: 1,
          }}
        >
          Internal Notes
        </Typography>

        <Box
          sx={{
            p: 2,
            bgcolor: "white",
            borderRadius: 2,
            border: "1px solid #e5e7eb",
          }}
        >

          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              color: "#111827",
              mb: 0.5,
            }}
          >
            Super Admin
          </Typography>

          <Typography
            sx={{
              fontSize: 13,
              color: "#6b7280",
              mb: 1,
            }}
          >
            Recently added
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              color: "#111827",
              lineHeight: 1.7,
            }}
          >
            {localSubmission.reviewNote}
          </Typography>

        </Box>

      </Box>

    )}

    {/* Add New Note */}

    <TextField
      fullWidth
      multiline
      minRows={4}
      placeholder="Add an internal note..."
      value={note}
      onChange={(e) => setNote(e.target.value)}
      sx={{
        mb: 2,
        "& .MuiOutlinedInput-root": {
          borderRadius: 3,
          alignItems: "flex-start",
          bgcolor: "white",
        },
      }}
    />

    {/* Add Note Button */}

    <Button
  variant="contained"
  disabled={!note.trim()}
  onClick={async () => {

    try {

      console.log("Sending Note:", note);

      await updateSubmissionStatus(
        localSubmission._id,
        localSubmission.status,
        note
      );

      setLocalSubmission((prev) => ({
        ...prev,
        reviewNote: note,
      }));

      setNote("");

      alert("Note added successfully");

    } catch (error) {

      console.error("ADD NOTE ERROR:", error);

      alert("Failed to add note");

    }

  }}
  sx={{
    borderRadius: 3,
    px: 3,
    py: 1,
    textTransform: "none",
    fontWeight: 600,
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
          gap: 1.5,
          alignItems: "center",
          flexWrap: "wrap",
          bgcolor: "#fff",
        }}
      >
        <Button
          variant="contained"
          disabled={loading || localSubmission.status === "approved"}
          onClick={() => handleAction("approved")}
          sx={{
            bgcolor: "#10b981",
            "&:hover": { bgcolor: "#059669" },
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 2,
            fontSize: 13,
          }}
        >
          {loading ? (
            <CircularProgress size={16} sx={{ color: "#fff" }} />
          ) : (
            "✓ Approve"
          )}
        </Button>
        <Button
          variant="contained"
          disabled={loading || localSubmission.status === "rejected"}
          onClick={() => handleAction("rejected")}
          sx={{
            bgcolor: "#ef4444",
            "&:hover": { bgcolor: "#dc2626" },
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 2,
            fontSize: 13,
          }}
        >
          ✕ Reject
        </Button>
        <Button
          variant="contained"
          disabled={loading || localSubmission.status === "under_review"}
          onClick={() => handleAction("under_review")}
          sx={{
            bgcolor: "#f59e0b",
            "&:hover": { bgcolor: "#d97706" },
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 2,
            fontSize: 13,
          }}
        >
          🔍 Flag Review
        </Button>
        <Select
          size="small"
          value={localSubmission.status || "submitted"}
          onChange={(e) => handleAction(e.target.value)}
          disabled={loading}
          sx={{
            ml: "auto",
            borderRadius: 2,
            fontSize: 13,
            fontWeight: 600,
            minWidth: 130,
            height: 36,
          }}
        >
          <MenuItem value="submitted">Submitted</MenuItem>
          <MenuItem value="under_review">Under Review</MenuItem>
          <MenuItem value="approved">Approved</MenuItem>
          <MenuItem value="rejected">Rejected</MenuItem>
        </Select>
      </Box>
    </Drawer>
  );
}
