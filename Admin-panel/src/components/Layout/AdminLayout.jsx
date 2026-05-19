import React from "react";
import { Box } from "@mui/material";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminLayout({
  children,
  title,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: "#f1f5f9",
      }}
    >
      <Box
        sx={{
          width: 260,
          flexShrink: 0,
        }}
      >
        <Sidebar />
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <Topbar title={title} />

        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            p: 3,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}