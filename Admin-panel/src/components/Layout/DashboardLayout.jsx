import { Box } from "@mui/material";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        background: "#F4F5FA",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <Box
  sx={{
    flex: 1,
    minWidth: 0,
  }}
>
        <Topbar />

        <Box
          sx={{
            p: 3,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}