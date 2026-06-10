import React, { useState } from "react";
import {
  Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Avatar, Box,
  LinearProgress, IconButton, Menu, MenuItem,
  ListItemIcon, ListItemText, Select
} from "@mui/material";
import {
  MoreHorizRounded, VisibilityRounded, CheckCircleRounded,
  CancelRounded, ManageSearchRounded, FileDownloadOutlined,
  KeyboardArrowDownRounded
} from "@mui/icons-material";
import TypeChip from "../common/TypeChip";
import SubmissionDrawer from "../common/SubmissionDrawer";
import { useAdminStore } from "../../store/adminStore";
import exportCSV from "../../utils/exportCSV";

export default function SubmissionTable({ submissions, title, isApprovedPage, filterState }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRow, setMenuRow] = useState(null);

  const updateStatus = useAdminStore((s) => s.updateStatus);

  const {
    typeFilter = "All Types", setTypeFilter,
    statusFilter = "All Status", setStatusFilter,
    riskFilter = "All Risk", setRiskFilter
  } = filterState || {};

  const handleDrawerClose = () => setDrawerOpen(false);

  const getRiskColor = (score) => {
    if (score >= 75) return "#5c0606"; 
    if (score >= 60) return "#d32f2f"; 
    if (score >= 40) return "#f59e0b"; 
    return "#10b981"; 
  };

  const openDrawer = (row) => {
    setSelectedRow(row);
    setDrawerOpen(true);
    closeMenu();
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

  const renderStatus = (status) => {
    const normalized = status?.toLowerCase() || "pending";
    const statusStyle = {
      approved:     { color: "#10b981", bg: "#e6f4ea" },
      rejected:     { color: "#ef4444", bg: "#fce8e6" },
      pending:      { color: "#f59e0b", bg: "#fef3c7" },
      "under review": { color: "#2563eb", bg: "#e0f2fe" },
      under_review: { color: "#2563eb", bg: "#e0f2fe" },
    }[normalized] || { color: "#4b5563", bg: "#f3f4f6" };

    return (
      <Box sx={{
        display: "inline-flex", px: 2, py: 0.75,
        borderRadius: "20px", bgcolor: statusStyle.bg,
        color: statusStyle.color, fontWeight: "600",
        fontSize: "0.75rem", textTransform: "capitalize",
        whiteSpace: "nowrap",
      }}>
        {normalized.replace("_", " ")}
      </Box>
    );
  };

  const filterSelectSx = {
    borderRadius: "8px",
    bgcolor: "#fff",
    fontSize: "0.78rem",
    fontWeight: "500",
    color: "#333",
    width: { xs: "100%", sm: "auto" },
    "& .MuiSelect-select": { py: 0.75, pl: 1.5, pr: "32px !important" },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e5e7eb" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d1d5db" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#9ca3af", borderWidth: "1px" }
  };

  return (
    <>
      <Card sx={{ borderRadius: "16px", boxShadow: "0px 1px 3px rgba(0,0,0,0.05)", border: "1px solid #f3f4f6", bgcolor: "#fff", overflow: "hidden" }}>
        
        {/* Header Block */}
        <Box p={3} display="flex" flexDirection={{ xs: "column", lg: "row" }} gap={2} justifyContent="space-between" alignItems={{ xs: "stretch", lg: "center" }}>
          <Typography variant="subtitle1" fontWeight="700" sx={{ color: "#111827", fontSize: "0.95rem" }}>
            {title || "All Submissions"}
          </Typography>
          
          {filterState && (
            <Box display="flex" flexWrap="wrap" alignItems="center" gap={1} width={{ xs: "100%", lg: "auto" }}>
              <Select 
                value={typeFilter} 
                onChange={(e) => setTypeFilter?.(e.target.value)}
                IconComponent={KeyboardArrowDownRounded}
                sx={filterSelectSx}
              >
                <MenuItem value="All Types">All Types</MenuItem>
                <MenuItem value="Individual">Individual</MenuItem>
                <MenuItem value="Business">Business</MenuItem>
                <MenuItem value="Enterprise">Enterprise</MenuItem>
              </Select>

              <Select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter?.(e.target.value)}
                IconComponent={KeyboardArrowDownRounded}
                sx={filterSelectSx}
              >
                <MenuItem value="All Status">All Status</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Under Review">Under Review</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>

              <Select 
                value={riskFilter} 
                onChange={(e) => setRiskFilter?.(e.target.value)}
                IconComponent={KeyboardArrowDownRounded}
                sx={filterSelectSx}
              >
                <MenuItem value="All Risk">All Risk</MenuItem>
                <MenuItem value="Low Risk">Low Risk (&lt;40)</MenuItem>
                <MenuItem value="Medium Risk">Medium Risk (40-74)</MenuItem>
                <MenuItem value="High Risk">High Risk (&ge;75)</MenuItem>
              </Select>

              <Box sx={{
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 0.5, 
                border: "1px solid #e5e7eb", borderRadius: "8px", px: 1.5, py: 0.75, 
                cursor: "pointer", fontSize: "0.78rem", fontWeight: "600", color: "#374151",
                transition: "0.2s", width: { xs: "100%", sm: "auto" },
                "&:hover": { bgcolor: "#f9fafb" }
              }}>
                <FileDownloadOutlined sx={{ fontSize: 16, color: "#ef4444" }} />
                <Typography onClick={() => exportCSV(submissions)} sx={{ color: "#ef4444", fontSize: "0.78rem", fontWeight: "600" }}>
                  Export CSV
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* ── UNIFIED TABLE VIEW WITH SCROLLBAR OVERRIDES ── */}
        <TableContainer 
          sx={{ 
            width: "100%", 
            overflowX: "auto",
            "&::-webkit-scrollbar": { height: "6px" },
            "&::-webkit-scrollbar-track": { bgcolor: "#f9fafb" },
            "&::-webkit-scrollbar-thumb": { bgcolor: "#e5e7eb", borderRadius: "10px" },
            "&::-webkit-scrollbar-thumb:hover": { bgcolor: "#d1d5db" }
          }}
        >
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow sx={{ borderBottom: "1px solid #f3f4f6", bgcolor: "#f9fafb" }}>
                <TableCell sx={{ fontWeight: "600", color: "#9ca3af", fontSize: "0.72rem", letterSpacing: "0.05em", py: 1.5 }}>APPLICANT</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#9ca3af", fontSize: "0.72rem", letterSpacing: "0.05em", py: 1.5 }}>TYPE</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#9ca3af", fontSize: "0.72rem", letterSpacing: "0.05em", py: 1.5 }}>REF NO</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#9ca3af", fontSize: "0.72rem", letterSpacing: "0.05em", py: 1.5 }}>SUBMITTED</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#9ca3af", fontSize: "0.72rem", letterSpacing: "0.05em", py: 1.5 }}>RISK SCORE</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#9ca3af", fontSize: "0.72rem", letterSpacing: "0.05em", py: 1.5 }}>STATUS</TableCell>
                <TableCell align="center" sx={{ fontWeight: "600", color: "#9ca3af", fontSize: "0.72rem", letterSpacing: "0.05em", py: 1.5 }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={1.5}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f9fafb', border: '1px dashed #e5e7eb', borderRadius: '12px', width: 56, height: 56, color: '#9ca3af' }}>
                        <ManageSearchRounded sx={{ fontSize: 28 }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight="600" sx={{ color: "#374151" }}>No submissions found</Typography>
                        <Typography variant="caption" sx={{ color: "#6b7280" }}>There are no applications matching this category yet.</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                submissions.map((item) => (
                  <TableRow
                    key={item._id || item.id || item.email}
                    onClick={() => openDrawer(item)}
                    sx={{ 
                      cursor: "pointer", 
                      "&:hover": { bgcolor: "#f9fafb" },
                      "& td": { borderBottom: "1px solid #f3f4f6", py: 2 } 
                    }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar sx={{ bgcolor: item.avatarColor || "#2563eb", width: 32, height: 32, fontSize: "0.78rem", fontWeight: "700" }}>
                          {(item.firstName?.[0] || item.name?.[0] || "?")}
                          {(item.lastName?.[0] || "")}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="600" sx={{ color: "#111827", lineHeight: 1.2 }}>
                            {item.firstName ? `${item.firstName} ${item.lastName || ""}` : item.name || "Unknown"}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#6b7280", display: "block", mt: 0.25 }}>
                            {item.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <TypeChip type={item.accountType || item.type} />
                    </TableCell>

                    <TableCell>
                      <Typography variant="caption" sx={{ bgcolor: "#f9fafb", px: 1, py: 0.5, borderRadius: "6px", fontWeight: "600", border: "1px solid #e5e7eb", fontFamily: "monospace", color: "#374151" }}>
                        {item._id ? `REF-${item._id.toString().slice(-5).toUpperCase()}` : item.ref || "—"}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ fontSize: "0.8rem", color: "#111827", fontWeight: "500", whiteSpace: "nowrap" }}>
                      {item.submittedAt
                        ? new Date(item.submittedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                        : item.submitted || "—"}
                    </TableCell>

                    <TableCell width="160px">
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <LinearProgress
                          variant="determinate"
                          value={item.riskScore || 0}
                          sx={{ flexGrow: 1, height: 5, borderRadius: 2, bgcolor: "#f3f4f6", "& .MuiLinearProgress-bar": { backgroundColor: getRiskColor(item.riskScore) } }}
                        />
                        <Typography variant="caption" fontWeight="700" sx={{ color: getRiskColor(item.riskScore), minWidth: 16 }}>
                          {item.riskScore || 0}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      {renderStatus(item.status)}
                    </TableCell>

                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                      <IconButton size="small" onClick={(e) => openMenu(e, item)} sx={{ border: "1px solid #e5e7eb", borderRadius: "8px", p: 0.5, color: "#6b7280" }}>
                        <MoreHorizRounded fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Action Popover Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        PaperProps={{ sx: { borderRadius: "12px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)", minWidth: 170, border: "1px solid #f3f4f6" } }}
      >
        <MenuItem onClick={() => openDrawer(menuRow)}>
          <ListItemIcon><VisibilityRounded fontSize="small" /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }}>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction("approved")} disabled={menuRow?.status === "approved"}>
          <ListItemIcon><CheckCircleRounded fontSize="small" sx={{ color: "#10b981" }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }}>Approve</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction("under_review")} disabled={menuRow?.status === "under_review" || menuRow?.status === "under review"}>
          <ListItemIcon><ManageSearchRounded fontSize="small" sx={{ color: "#2563eb" }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }}>Flag Review</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction("rejected")} disabled={menuRow?.status === "rejected"} sx={{ color: "#ef4444" }}>
          <ListItemIcon><CancelRounded fontSize="small" sx={{ color: "#ef4444" }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }}>Reject</ListItemText>
        </MenuItem>
      </Menu>

      <SubmissionDrawer open={drawerOpen} onClose={handleDrawerClose} submission={selectedRow} />
    </>
  );
}
