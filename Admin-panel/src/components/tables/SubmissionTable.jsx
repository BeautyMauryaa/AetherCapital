// import { useNavigate } from "react-router-dom";
// import {
//   Card,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
//   Avatar,
//   Box,
//   LinearProgress,
//   Button,
// } from "@mui/material";

// import TypeChip from "../common/TypeChip";

// export default function SubmissionTable({
//   submissions = [],
//   title,
//   isApprovedPage,
// }) {
//   const getRiskColor = (score) => {
//     if (score >= 75) return "#d32f2f";
//     if (score >= 60) return "#f44336";
//     if (score >= 45) return "#ffa726";

//     return "#66bb6a";
//   };

//   return (
//     <Card
//       sx={{
//         borderRadius: 4,
//         boxShadow: "none",
//         border: "1px solid #f0f0f0",
//       }}
//     >
//       <Box p={3}>
//         <Typography variant="h6" fontWeight="700">
//           {title || "All Submissions"}
//         </Typography>
//       </Box>

//       <TableContainer>
//         <Table>
//           <TableHead sx={{ backgroundColor: "#fafafa" }}>
//             <TableRow>
//               <TableCell
//                 sx={{
//                   fontWeight: "600",
//                   color: "#888",
//                   fontSize: "0.75rem",
//                 }}
//               >
//                 APPLICANT
//               </TableCell>

//               <TableCell
//                 sx={{
//                   fontWeight: "600",
//                   color: "#888",
//                   fontSize: "0.75rem",
//                 }}
//               >
//                 TYPE
//               </TableCell>

//               <TableCell
//                 sx={{
//                   fontWeight: "600",
//                   color: "#888",
//                   fontSize: "0.75rem",
//                 }}
//               >
//                 REF NO
//               </TableCell>

//               <TableCell
//                 sx={{
//                   fontWeight: "600",
//                   color: "#888",
//                   fontSize: "0.75rem",
//                 }}
//               >
//                 {isApprovedPage ? "APPROVED DATE" : "SUBMITTED"}
//               </TableCell>

//               <TableCell
//                 sx={{
//                   fontWeight: "600",
//                   color: "#888",
//                   fontSize: "0.75rem",
//                 }}
//               >
//                 RISK
//               </TableCell>

//               <TableCell
//                 align="center"
//                 sx={{
//                   fontWeight: "600",
//                   color: "#888",
//                   fontSize: "0.75rem",
//                 }}
//               >
//                 ACTIONS
//               </TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {submissions.map((item) => {
//               const fullName =
//                 `${item.firstName || ""} ${item.lastName || ""}`.trim();

//               const risk = Number(item.riskScore) || 0;

//               return (
//                 <TableRow key={item._id} hover>
//                   {/* Status */}
                 
//                   {/* Applicant */}
//                   <TableCell>
//                     <Box display="flex" alignItems="center" gap={1.5}>
//                       <Avatar
//                         sx={{
//                           bgcolor: "#9c27b0",
//                           width: 32,
//                           height: 32,
//                           fontSize: "0.8rem",
//                         }}
//                       >
//                         {fullName
//                           ?.split(" ")
//                           .map((n) => n[0])
//                           .join("")}
//                       </Avatar>

//                       <Box>
//                         <Typography
//                           variant="body2"
//                           fontWeight="600"
//                           sx={{ lineHeight: 1.2 }}
//                         >
//                           {fullName || "No Name"}
//                         </Typography>

//                         <Typography variant="caption" color="text.secondary">
//                           {item.email || "No Email"}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </TableCell>

//                   {/* Type */}
//                   <TableCell>
//                     <TypeChip type={item.accountType} />
//                   </TableCell>

//                   {/* Ref */}
//                   <TableCell>
//                     <Typography
//                       variant="caption"
//                       sx={{
//                         bgcolor: "#f5f5f5",
//                         px: 1,
//                         py: 0.5,
//                         borderRadius: 1,
//                         fontWeight: "500",
//                         border: "1px solid #e0e0e0",
//                       }}
//                     >
//                       {item._id?.slice(-6).toUpperCase()}
//                     </Typography>
//                   </TableCell>

//                   {/* Submitted */}
//                   <TableCell
//                     sx={{
//                       fontSize: "0.85rem",
//                       color: "#444",
//                     }}
//                   >
//                     {item.submittedAt
//                       ? new Date(item.submittedAt).toLocaleDateString()
//                       : "-"}
//                   </TableCell>

//                   {/* Risk */}
//                   <TableCell width="140px">
//                     <Box display="flex" alignItems="center" gap={1}>
//                       <LinearProgress
//                         variant="determinate"
//                         value={risk}
//                         sx={{
//                           flexGrow: 1,
//                           height: 4,
//                           borderRadius: 2,
//                           bgcolor: "#eee",

//                           "& .MuiLinearProgress-bar": {
//                             backgroundColor: getRiskColor(risk),
//                           },
//                         }}
//                       />

//                       <Typography
//                         variant="caption"
//                         fontWeight="bold"
//                         sx={{
//                           color: getRiskColor(risk),
//                         }}
//                       >
//                         {risk}%
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                    <TableCell>
//                     <Box
//                       sx={{
//                         px: 1.5,
//                         py: 0.5,
//                         borderRadius: "999px",
//                         fontSize: "0.75rem",
//                         fontWeight: 700,
//                         display: "inline-flex",

//                         bgcolor:
//                           item.status === "approved"
//                             ? "#dcfce7"
//                             : item.status === "rejected"
//                               ? "#fee2e2"
//                               : item.status === "under_review"
//                                 ? "#dbeafe"
//                                 : "#fef3c7",

//                         color:
//                           item.status === "approved"
//                             ? "#15803d"
//                             : item.status === "rejected"
//                               ? "#dc2626"
//                               : item.status === "under_review"
//                                 ? "#2563eb"
//                                 : "#d97706",
//                       }}
//                     >
//                       {item.status?.replace("_", " ")}
//                     </Box>
//                   </TableCell>

//                   {/* Actions */}
//                   <TableCell align="center">
//                     <Button
//                       variant="outlined"
//                       size="small"
//                       onClick={() => navigate(`/submissions/${item._id}`)}
//                       sx={{
//                         textTransform: "none",
//                         borderRadius: "8px",
//                         borderColor: "#e0e0e0",
//                         color: "#333",
//                         fontSize: "0.75rem",
//                         fontWeight: "600",
//                         px: 3,
//                       }}
//                     >
//                       View
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Card>
//   );
// }

import React, { useState } from "react";
import {
  Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Avatar, Box,
  LinearProgress, Button, IconButton, Menu, MenuItem,
  ListItemIcon, ListItemText,
} from "@mui/material";
import {
  MoreVertRounded, VisibilityRounded, CheckCircleRounded,
  CancelRounded, ManageSearchRounded,
} from "@mui/icons-material";
import TypeChip from "../common/TypeChip";
import SubmissionDrawer from "../common/SubmissionDrawer";
import { useAdminStore } from "../../store/adminStore";

export default function SubmissionTable({ submissions, title, isApprovedPage }) {

  // ── Drawer state ──────────────────────────────────────────────────────────
  const [drawerOpen,       setDrawerOpen]       = useState(false);
  const [selectedRow,      setSelectedRow]       = useState(null);

  // ── Action menu state ─────────────────────────────────────────────────────
  const [anchorEl,         setAnchorEl]          = useState(null);
  const [menuRow,          setMenuRow]            = useState(null);

  const updateStatus = useAdminStore((s) => s.updateStatus);

  const getRiskColor = (score) => {
    if (score >= 75) return "#d32f2f";
    if (score >= 60) return "#f44336";
    if (score >= 45) return "#ffa726";
    return "#66bb6a";
  };

  const openDrawer = (row) => {
    setSelectedRow(row);
    setDrawerOpen(true);
    // Close action menu if open
    setAnchorEl(null);
    setMenuRow(null);
  };

  const openMenu = (e, row) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setMenuRow(row);
  };

  const closeMenu = () => {
    setAnchorEl(null);
    setMenuRow(null);
  };

  const handleMenuAction = async (status) => {
    if (menuRow) await updateStatus(menuRow._id, status);
    closeMenu();
  };

  // When drawer closes, sync updated data back to selectedRow
  const handleDrawerClose = () => {
    setDrawerOpen(false);
    // Keep selectedRow so drawer animates out nicely
  };

  return (
    <>
      <Card sx={{ borderRadius: 4, boxShadow: "none", border: "1px solid #f0f0f0" }}>
        <Box p={3}>
          <Typography variant="h6" fontWeight="700">
            {title || "All Submissions"}
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#fafafa" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "600", color: "#888", fontSize: "0.75rem" }}>APPLICANT</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#888", fontSize: "0.75rem" }}>TYPE</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#888", fontSize: "0.75rem" }}>REF NO</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#888", fontSize: "0.75rem" }}>
                  {isApprovedPage ? "APPROVED DATE" : "SUBMITTED"}
                </TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#888", fontSize: "0.75rem" }}>RISK SCORE</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#888", fontSize: "0.75rem" }}>STATUS</TableCell>
                <TableCell align="center" sx={{ fontWeight: "600", color: "#888", fontSize: "0.75rem" }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {submissions.map((item) => {
                const statusStyle = {
                  approved:     { color: "#2e7d32", bg: "#e8f5e9" },
                  rejected:     { color: "#c62828", bg: "#ffebee" },
                  submitted:    { color: "#b45309", bg: "#fef3c7" },
                  under_review: { color: "#0277bd", bg: "#e1f5fe" },
                }[item.status] || { color: "#757575", bg: "#f5f5f5" };

                return (
                  <TableRow
                    key={item._id || item.id || item.email}
                    hover
                    onClick={() => openDrawer(item)}
                    sx={{ cursor: "pointer" }}
                  >
                    {/* Applicant */}
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar sx={{
                          bgcolor: item.avatarColor || "#9c27b0",
                          width: 32, height: 32, fontSize: "0.8rem",
                        }}>
                          {(item.firstName?.[0] || item.name?.[0] || "?")}
                          {(item.lastName?.[0] || "")}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="600" sx={{ lineHeight: 1.2 }}>
                            {item.firstName
                              ? `${item.firstName} ${item.lastName || ""}`
                              : item.name || "Unknown"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Type */}
                    <TableCell>
                      <TypeChip type={item.accountType || item.type} />
                    </TableCell>

                    {/* Ref No */}
                    <TableCell>
                      <Typography variant="caption" sx={{
                        bgcolor: "#f5f5f5", px: 1, py: 0.5,
                        borderRadius: 1, fontWeight: "500",
                        border: "1px solid #e0e0e0", fontFamily: "monospace",
                      }}>
                        {item._id
                          ? `REF-${item._id.toString().slice(-5).toUpperCase()}`
                          : item.ref || "—"}
                      </Typography>
                    </TableCell>

                    {/* Submitted date */}
                    <TableCell sx={{ fontSize: "0.85rem", color: "#444" }}>
                      {item.submittedAt
                        ? new Date(item.submittedAt).toLocaleDateString("en-GB", {
                            day: "2-digit", month: "short", year: "numeric" })
                        : item.submitted || "—"}
                    </TableCell>

                    {/* Risk Score */}
                    <TableCell width="140px">
                      <Box display="flex" alignItems="center" gap={1}>
                        <LinearProgress
                          variant="determinate"
                          value={item.riskScore || 0}
                          sx={{
                            flexGrow: 1, height: 4, borderRadius: 2, bgcolor: "#eee",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: getRiskColor(item.riskScore),
                            },
                          }}
                        />
                        <Typography variant="caption" fontWeight="bold"
                          sx={{ color: getRiskColor(item.riskScore), minWidth: 20 }}>
                          {item.riskScore || 0}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Box sx={{
                        display: "inline-flex", px: 1.5, py: 0.5,
                        borderRadius: 1, bgcolor: statusStyle.bg,
                        color: statusStyle.color, fontWeight: 700,
                        fontSize: "0.72rem", textTransform: "capitalize",
                        whiteSpace: "nowrap",
                      }}>
                        {(item.status || "submitted").replace("_", " ")}
                      </Box>
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                      <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={(e) => { e.stopPropagation(); openDrawer(item); }}
                          sx={{
                            textTransform: "none", borderRadius: "8px",
                            borderColor: "#e0e0e0", color: "#333",
                            fontSize: "0.75rem", fontWeight: "600", px: 2,
                          }}
                        >
                          View
                        </Button>

                        <IconButton
                          size="small"
                          onClick={(e) => openMenu(e, item)}
                          sx={{ color: "#888" }}
                        >
                          <MoreVertRounded fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* ── Action Menu ─────────────────────────────────────────────────────── */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        PaperProps={{ sx: { borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.12)", minWidth: 160 } }}
      >
        <MenuItem onClick={() => { openDrawer(menuRow); }}>
          <ListItemIcon><VisibilityRounded fontSize="small" /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 14 }}>View Details</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleMenuAction("approved")}
          disabled={menuRow?.status === "approved"}>
          <ListItemIcon><CheckCircleRounded fontSize="small" sx={{ color: "#10b981" }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 14 }}>✅ Approve</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleMenuAction("under_review")}
          disabled={menuRow?.status === "under_review"}>
          <ListItemIcon><ManageSearchRounded fontSize="small" sx={{ color: "#f59e0b" }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 14 }}>🔍 Flag Review</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleMenuAction("rejected")}
          disabled={menuRow?.status === "rejected"}
          sx={{ color: "#ef4444" }}>
          <ListItemIcon><CancelRounded fontSize="small" sx={{ color: "#ef4444" }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 14, color: "#ef4444" }}>✗ Reject</ListItemText>
        </MenuItem>
      </Menu>

      {/* ── Side Drawer ──────────────────────────────────────────────────────── */}
      <SubmissionDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        submission={selectedRow}
      />
    </>
  );
}