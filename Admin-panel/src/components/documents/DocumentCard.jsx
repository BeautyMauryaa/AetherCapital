import React from "react";
import { Card, Typography, Box, IconButton } from "@mui/material";
import { 
  ArrowDownwardRounded, 
  CheckRounded, 
  CloseRounded,
  BadgeOutlined,
  ArticleOutlined,
  ReceiptLongOutlined,
  LocationOnOutlined
} from "@mui/icons-material";
import { updateDocumentStatus } from "../../services/documentService";

const getDocumentIcon = (title) => {
  const t = title?.toLowerCase() || "";
  if (t.includes("id") || t.includes("government")) {
    return <BadgeOutlined sx={{ color: "#2563eb", fontSize: 28 }} />;
  }
  if (t.includes("incorporation") || t.includes("cert")) {
    return <ArticleOutlined sx={{ color: "#d97706", fontSize: 28 }} />;
  }
  if (t.includes("tax") || t.includes("reg")) {
    return <ReceiptLongOutlined sx={{ color: "#0284c7", fontSize: 28 }} />;
  }
  return <LocationOnOutlined sx={{ color: "#ef4444", fontSize: 28 }} />;
};

const STATUS_CHIP_STYLE = {
  verified: { color: "#10b981", bg: "#e6f4ea", text: "Verified" },
  approved: { color: "#10b981", bg: "#e6f4ea", text: "Verified" },
  rejected: { color: "#ef4444", bg: "#fce8e6", text: "Rejected" },
  pending: { color: "#d97706", bg: "#fef3c7", text: "Pending" },
  submitted: { color: "#d97706", bg: "#fef3c7", text: "Pending" }
};

export default function DocumentCard({
  title,
  user,
  status,
  file,
  submissionId,
  documentType, // <--- Destructured correctly here
  setToast,
  refreshDocuments,
}) {
  
  const currentStatus = status?.toLowerCase() || "pending";
  const style = STATUS_CHIP_STYLE[currentStatus] || STATUS_CHIP_STYLE.pending;

  const handleUpdate = async (targetStatus, successMessage, errorMessage) => {
    try {
      await updateDocumentStatus(
        submissionId,
        documentType, // <--- Fixed: Changed from fileType to documentType
        targetStatus
      );

      if (typeof setToast === "function") {
        setToast({
          open: true,
          message: successMessage,
          severity: "success"
        });
      }

      if (typeof refreshDocuments === "function") {
        refreshDocuments();
      }
    } catch (error) {
      console.error(error);
      if (typeof setToast === "function") {
        setToast({
          open: true,
          message: errorMessage,
          severity: "error"
        });
      }
    }
  }; // <--- handleUpdate safely ends here now (stray fragment removed)

  return (
    <Card
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 4,
        border: "1px solid #f1f5f9",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 200,
        bgcolor: "#ffffff"
      }}
    >
      <Box>
        <Box sx={{ mb: 1.5 }}>
          {getDocumentIcon(title)}
        </Box>

        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#1e293b", mb: 0.25, lineHeight: 1.3 }}>
          {title || "Document File"}
        </Typography>

        <Typography sx={{ fontSize: 11, fontWeight: 500, color: "#94a3b8", mb: 1.5 }}>
          {user || "Unknown Applicant"}
        </Typography>
        
        <Box
          sx={{
            display: "inline-block",
            px: 1.25,
            py: 0.4,
            borderRadius: 1.5,
            fontSize: 10,
            fontWeight: 700,
            color: style.color,
            bgcolor: style.bg,
            textTransform: "capitalize"
          }}
        >
          {style.text}
        </Box>
      </Box>
      
      <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <IconButton
          component="a"
          href={file?.webViewLink || "#"}
          target="_blank"
          size="small"
          sx={{
            border: "1px solid #e2e8f0",
            borderRadius: 2,
            p: 0.75,
            color: "#64748b",
            "& hover": { bgcolor: "#f8fafc" }
          }}
        >
          <ArrowDownwardRounded sx={{ fontSize: 16 }} />
        </IconButton>

        <Box display="flex" gap={1}>
          <IconButton
            size="small"
        onClick={() =>
  handleUpdate(
    "verified",
    "Document verified",
    "Failed to verify document"
  )
}
            sx={{
              bgcolor: "#10b981",
              color: "#ffffff",
              borderRadius: 2,
              p: 0.75,
              "& hover": { bgcolor: "#059669" }
            }}
          >
            <CheckRounded sx={{ fontSize: 16 }} />
          </IconButton>

          <IconButton
            size="small"
            onClick={() => handleUpdate("rejected", "Document rejected", "Failed to reject document")}
            sx={{
              bgcolor: "#ef4444",
              color: "#ffffff",
              borderRadius: 2,
              p: 0.75,
              "& hover": { bgcolor: "#dc2626" }
            }}
          >
            <CloseRounded sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
}
