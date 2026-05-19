import {
  Card,
  Typography,
  Box,
  Button,
} from "@mui/material";

import {
  Download,
  Check,
  Close,
} from "@mui/icons-material";

import StatusChip from "../common/StatusChip";

import { updateDocumentStatus } from "../../services/documentService";

export default function DocumentCard({
  title,
  user,
  status,
  file,
  submissionId,
  setToast,
  refreshDocuments,
}) {

  const handleApprove = async () => {

    try {

      await updateDocumentStatus(
        submissionId,
        "approved"
      );

      setToast({
        open: true,
        message: "Document verified",
        severity: "success",
      });

      refreshDocuments();

    } catch (error) {

      console.error(error);

      setToast({
        open: true,
        message: "Failed to approve document",
        severity: "error",
      });

    }

  };

  const handleReject = async () => {

    try {

      await updateDocumentStatus(
        submissionId,
        "rejected"
      );

      setToast({
        open: true,
        message: "Document rejected",
        severity: "error",
      });

      refreshDocuments();

    } catch (error) {

      console.error(error);

      setToast({
        open: true,
        message: "Failed to reject document",
        severity: "error",
      });

    }

  };

  return (

    <Card
      sx={{
        p: 3,
        borderRadius: 2,
        height: "100%",
      }}
    >

      <Typography
        variant="h6"
        fontWeight="600"
        mb={1}
      >
        {title}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        mb={2}
      >
        {user}
      </Typography>

      <StatusChip status={status} />

      <Box
        mt={3}
        display="flex"
        justifyContent="space-between"
      >

        <Button
          component="a"
          href={file?.webViewLink}
          target="_blank"
          startIcon={<Download />}
        >
          Download
        </Button>

        <Box display="flex" gap={1}>

          <Button
            variant="contained"
            color="success"
            onClick={handleApprove}
          >
            <Check />
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleReject}
          >
            <Close />
          </Button>

        </Box>

      </Box>

    </Card>
  );
}