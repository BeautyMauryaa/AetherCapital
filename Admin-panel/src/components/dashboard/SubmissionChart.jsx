import React, { useState, useMemo } from "react";
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

export default function SubmissionChart({ submissions = [] }) {
  // 1. Manage state for the dropdown selector
  const [daysRange, setDaysRange] = useState(30); // Defaulting to 30 as seen in your dashboard mockup

  // 2. Generate and bucket real data dynamically when submissions or daysRange changes
  const computedChartData = useMemo(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Align to end of today to prevent slicing time buckets weirdly

    // Pre-populate our empty time buckets for the selected range
    const dataMap = Array.from({ length: daysRange }).map((_, i) => {
      const targetDate = new Date();
      targetDate.setDate(today.getDate() - (daysRange - 1 - i));
      
      // Match the localized XAxis label formatting (e.g., "22 Apr", "04 May")
      const label = targetDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });

      return {
        day: label, // Used by Recharts XAxis dataKey
        rawDateStr: targetDate.toDateString(), // Reliable key for date-matching
        submissions: 0,
      };
    });

    // Populate actual counts from the submissions array
    if (Array.isArray(submissions)) {
      submissions.forEach((item) => {
        const dateSource = item.createdAt || item.submittedAt;
        if (!dateSource) return;

        const itemDateStr = new Date(dateSource).toDateString();
        
        // Find the matching bucket day and increment it
        const dayBucket = dataMap.find((bucket) => bucket.rawDateStr === itemDateStr);
        if (dayBucket) {
          dayBucket.submissions++;
        }
      });
    }

    return dataMap;
  }, [submissions, daysRange]);

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

        {/* 3. Handle changing timeframes elegantly */}
        <Select
          value={daysRange}
          onChange={(e) => setDaysRange(Number(e.target.value))}
          size="small"
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
            data={computedChartData}
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
              dataKey="day"
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
              allowDecimals={false} // Prevents fractional numbers on low-count charts
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
              dataKey="submissions"
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
