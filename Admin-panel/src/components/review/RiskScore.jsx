import { Box, Typography } from "@mui/material";

export default function RiskScore({
  score,
}) {
  let color = "#10B981";

  if (score > 70) {
    color = "#DC2626";
  } else if (score > 40) {
    color = "#F59E0B";
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
    >
      <Box
        sx={{
          width: 60,
          height: 8,
          borderRadius: 10,
          background: "#E5E7EB",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: `${score}%`,
            height: "100%",
            background: color,
          }}
        />
      </Box>

      <Typography
        fontWeight="600"
        color={color}
      >
        {score}
      </Typography>
    </Box>
  );
}