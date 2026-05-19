import { Card, Typography, Box, alpha } from "@mui/material";

export default function StatCard({ title, value, subtitle, icon, color = "primary" }) {
  // Logic for dynamic coloring based on subtitle text
  const isNegative = subtitle?.toLowerCase().includes("attention") || 
                     subtitle?.toLowerCase().includes("review");
  
  const statusColor = isNegative ? "error" : "success";

  return (
    <Card
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        height: "100%",
        width: "220px",
        position: "relative",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: (theme) => `0px 12px 24px ${alpha(theme.palette.common.black, 0.05)}`,
        },
      }}
    >
      {/* Content Layer */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Typography 
          variant="overline" 
          sx={{ 
            color: "text.secondary", 
            fontWeight: 500, 
            letterSpacing: 1.1,
            display: "block",
            lineHeight: 1.5
          }}
        >
          {title}
        </Typography>

        <Typography variant="h3" sx={{ my: 1, fontWeight: 500, color: "text.primary" }}>
          {value}
        </Typography>

        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center",
            color: `${statusColor}.main`,
            fontWeight: 600,
            fontSize: "0.75rem"
          }}
        >
          {/* Optional: Add a small arrow icon here if desired */}
          {subtitle}
        </Box>
      </Box>

      {/* Decorative Icon Background */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 56,
          height: 56,
          borderRadius: "50%",
          bgcolor: (theme) => alpha(theme.palette[color]?.main || theme.palette.primary.main, 0.08),
          color: `${color}.main`,
          "& svg": {
            fontSize: 32,
            opacity: 0.8
          }
        }}
      >
        {icon}
      </Box>
    </Card>
  );
}