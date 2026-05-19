import { Card, Typography, Box, Stack } from "@mui/material";
import { useAdminStore } from "../../store/adminStore";

const RISK_LEVELS = [
  { label: "Low", color: "#10B981", range: [0, 30] },
  { label: "Medium", color: "#F59E0B", range: [31, 60] },
  { label: "High", color: "#EF4444", range: [61, 85] },
  { label: "Critical", color: "#7F1D1D", range: [86, 100] },
];

export default function RiskDistribution() {
  const { submissions } = useAdminStore();

  const getCount = (min, max) =>
  submissions.filter((s) => {

    const score = Number(s.riskScore || 0);

    return score >= min && score <= max;

  }).length;

  return (
    <Card elevation={0} sx={{ p: 3, borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
      <Typography variant="subtitle1" fontWeight="700">Risk Distribution</Typography>
      <Typography variant="caption" color="text.secondary" display="block" mb={3}>
        Across all entries
      </Typography>
<Box
  sx={{
    display: "flex",
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    mb: 3,
  }}
>
  {RISK_LEVELS.map((level) => (

    <Box
      key={level.label}
      sx={{
        flex: getCount(...level.range) || 1,
        bgcolor: level.color,
        transition: "flex 0.5s ease",
      }}
    />

  ))}
</Box>
      <Stack direction="row" spacing={3} flexWrap="wrap">
        {RISK_LEVELS.map((level) => (
          <Box key={level.label} display="flex" alignItems="center" gap={1}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: level.color }} />
            <Typography variant="caption" fontWeight="600" color="text.secondary">
              {level.label} ({getCount(...level.range)})
            </Typography>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}