import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  Typography,
  Box,
  MenuItem,
  Select,
  alpha,
} from "@mui/material";

export default function SubmissionChart({ chartData = [] }) {
  const [daysRange, setDaysRange] = useState(7); // Matches your backend's default 7 days

  // Format backend dates (e.g., '2026-05-20') to short lookups (e.g., '20 May') for clean layout
  const formattedChartData = chartData.map((item) => {
    if (!item.day) return item;
    
    const parsedDate = new Date(item.day);
    // Fallback if the date string fails parsing gracefully
    const formattedLabel = isNaN(parsedDate) 
      ? item.day 
      : parsedDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

    return {
      ...item,
      displayDay: formattedLabel, // The label Recharts will render on XAxis
    };
  });

  return (
    <Card
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        height: 400,
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={2}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight="700">
            Submissions Over Time
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Last {daysRange} days
          </Typography>
        </Box>

        <Select
          value={daysRange}
          onChange={(e) => setDaysRange(Number(e.target.value))}
          size="small"
          disabled // Temporary until you add backend filter logic for 30/90 ranges
          sx={{
            borderRadius: 2,
            fontSize: "0.75rem",
            fontWeight: 600,
            bgcolor: "action.hover",
            "& .MuiSelect-select": { py: 0.75 }
          }}
        >
          <MenuItem value={7}>7 days</MenuItem>
          <MenuItem value={30}>30 days</MenuItem>
          <MenuItem value={90}>90 days</MenuItem>
        </Select>
      </Box>

      <Box sx={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={formattedChartData}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5B5FEF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#5B5FEF" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke={alpha("#000", 0.05)}
            />

            <XAxis
              dataKey="displayDay" // Maps directly to our nice looking formatted label
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: "#9ca3af",
              }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              tick={{
                fontSize: 12,
                fill: "#9ca3af",
              }}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
              }}
            />

            <Area
              type="monotone"
              dataKey="submissions" // Maps to your backend's number values
              stroke="#5B5FEF"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorSub)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
}
