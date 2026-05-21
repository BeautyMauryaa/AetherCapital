import React, { useEffect, useState } from "react";
import {
  Grid,
  Snackbar,
  Alert,
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import DocumentCard from "../components/documents/DocumentCard";
import { getDocuments } from "../services/documentService";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data || []);
    } catch (error) {
      console.error("Documents Fetch Error:", error);
      setToast({
        open: true,
        message: "Failed to fetch documents",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // ── Reactive Filtering Pipeline Logic ──────────────────────────────────────
  const filteredDocuments = documents.filter((doc) => {
    // Exact check mapping logic for match rules
    const matchesType =
      typeFilter === "all" ||
      doc.type?.toLowerCase().replace(/\s+/g, "") ===
        typeFilter.toLowerCase().replace(/\s+/g, "");

    // Normalizing variants like 'submitted'/'pending' and 'verified'/'approved'
    const docStatus = doc.status?.toLowerCase();
    const normalizedDocStatus =
      docStatus === "submitted"
        ? "pending"
        : docStatus === "approved"
          ? "verified"
          : docStatus;
    const matchesStatus =
      statusFilter === "all" || normalizedDocStatus === statusFilter;

    return matchesType && matchesStatus;
  });

  return (
    <Box sx={{ p: 1 }}>
      {/* ── Sub Header Control Panel Section ── */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
          Documents Center
        </Typography>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          {/* Document Type Dropdown Selection */}
          <FormControl size="small">
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              sx={{
                borderRadius: 2.5,
                fontSize: 12,
                fontWeight: 600,
                minWidth: 110,
                height: 36,
                bgcolor: "#ffffff",
                color: "#1e293b",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e2e8f0",
                },
              }}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="Government ID Front">
                Government ID Front
              </MenuItem>
              <MenuItem value="Government ID Back">Government ID Back</MenuItem>
              <MenuItem value="Certificate of Incorporation">
                Certificate of Incorporation
              </MenuItem>
              <MenuItem value="Tax Registration">Tax Registration</MenuItem>
              <MenuItem value="Proof of Address">Proof of Address</MenuItem>
            </Select>
          </FormControl>

          {/* Action Verification Status Dropdown Selection */}
          <FormControl size="small">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{
                borderRadius: 2.5,
                fontSize: 12,
                fontWeight: 600,
                minWidth: 110,
                height: 36,
                bgcolor: "#ffffff",
                color: "#1e293b",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e2e8f0",
                },
              }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="verified">Verified</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* ── Filtered Layout Grid ── */}
      <Grid container spacing={3}>
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map((doc, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={doc.file?.fileId || doc._id || index}
            >
              {documents.map((doc, idx) => (
  <DocumentCard
    key={idx}
    submissionId={doc.submissionId}
    title={doc.type}            // Maps to title inside DocumentCard
    documentType={doc.type}     // Passed exactly to handleUpdate -> backend translation
    user={doc.applicant}
    status={doc.status}         // Now reads the real, isolated verification status!
    file={doc.file}
    setToast={setToast}
    refreshDocuments={fetchDocuments}
  />
))}
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box
              sx={{
                py: 8,
                textAlign: "center",
                border: "1px dashed #e2e8f0",
                borderRadius: 4,
                bgcolor: "#f8fafc",
              }}
            >
              <Typography
                sx={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}
              >
                No records matching active dashboard criteria.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Action Toast Feedback alerts */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: 2, fontSize: 13, fontWeight: 600 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
