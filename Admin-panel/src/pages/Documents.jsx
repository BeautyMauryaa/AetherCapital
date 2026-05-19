import { useEffect, useState } from "react";

import Grid from "@mui/material/Grid";

import Snackbar from "@mui/material/Snackbar";

import Alert from "@mui/material/Alert";

import DocumentCard from "../components/documents/DocumentCard";

import { getDocuments } from "../services/documentService";

export default function Documents() {

  const [documents, setDocuments] = useState([]);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch documents
  const fetchDocuments = async () => {

    try {

      const data = await getDocuments();

      console.log("DOCUMENTS:", data);

      setDocuments(data);

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

  return (
    <>

      <Grid container spacing={3}>

        {documents.map((doc, index) => (

          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={index}
          >

            <DocumentCard
              title={doc.type}
              user={doc.applicant}
              status={doc.status}
              file={doc.file}
              submissionId={doc.submissionId}
              setToast={setToast}
              refreshDocuments={fetchDocuments}
            />

          </Grid>

        ))}

      </Grid>

      {/* Snackbar */}

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() =>
          setToast({
            ...toast,
            open: false,
          })
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >

        <Alert
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>

      </Snackbar>

    </>
  );
}