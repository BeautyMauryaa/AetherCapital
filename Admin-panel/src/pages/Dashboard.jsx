import { useEffect, useState } from "react";
import { Grid, Box } from "@mui/material";
import {
  Assignment,
  PendingActions,
  CheckCircle,
  Warning,
} from "@mui/icons-material";

import StatCard from "../components/dashboard/StatCard";
import SubmissionChart from "../components/dashboard/SubmissionChart";
import AccountTypeChart from "../components/dashboard/AccountTypeChart";
import RiskDistribution from "../components/dashboard/RiskDistribution";
import RecentSubmissions from "../components/dashboard/RecentSubmissions";

import { getDashboardStats } from "../services/dashboardService";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        console.log("Dashboard Stats:", data);
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  // 1. Get the current selected timeframe from your dropdown state (e.g., 7, 30, 90)
const daysRange = parseInt(chartDays, 10) || 30; 

// 2. Generate real chart data dynamically based on actual submissions
const chartData = useMemo(() => {
  const today = new Date();
  today.setHours(23, 59, 59, 999); // Snap to the end of today for accurate daily buckets

  // Initialize an array of objects for each day in the range
  const dataMap = Array.from({ length: daysRange }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (daysRange - 1 - i));
    
    // Format label matching Indian English locale or your preference (e.g., "22 Apr")
    const label = d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });

    return {
      date: label,
      rawDateStr: d.toDateString(), // Used for exact date matching
      submissions: 0,
    };
  });

  // Populate actual counts from the submissions array
  if (Array.isArray(submissions)) {
    submissions.forEach((sub) => {
      // Fallback chain for timestamp fields
      const dateSource = sub.createdAt || sub.submittedAt;
      if (!dateSource) return;

      const subDateStr = new Date(dateSource).toDateString();
      
      // Find the corresponding day bucket
      const bucket = dataMap.find((day) => day.rawDateStr === subDateStr);
      if (bucket) {
        bucket.submissions++;
      }
    });
  }

  return dataMap;
}, [submissions, chartDays]);

  return (
    // 1. Added clean global page padding (24px) to separate everything from the sidebar/navbar edges
    <Box sx={{ width: "100%", p: { xs: 2, sm: 3 }, bgcolor: "#f9fafb", minHeight: "100vh" }}>

      {/* Stat Cards Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Submissions"
            value={stats?.total || 0}
            subtitle="All applications"
            color="primary"
            icon={<Assignment />}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Pending Review"
            value={stats?.pending || 0}
            subtitle="Needs attention"
            color="warning"
            icon={<PendingActions />}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Approved"
            value={stats?.approved || 0}
            subtitle="Successfully approved"
            color="success"
            icon={<CheckCircle />}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="High Risk Flagged"
            value={stats?.highRisk || 0}
            subtitle="Needs review"
            color="error"
            icon={<Warning />}
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={6}>
          <SubmissionChart chartData={stats?.chartData || []} />
        </Grid>

        <Grid item xs={12} lg={6}>
          <AccountTypeChart byType={stats?.byType || {}} />
        </Grid>
      </Grid>

      {/* Bottom Visualization & Data Grids Row */}
      {/* 2. Added spacing={3} here so stacked charts don't crash into each other on smaller viewports */}
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <RiskDistribution />
        </Grid>

        <Grid item xs={12}>
          <RecentSubmissions />
        </Grid>
      </Grid>

    </Box>
  );
}
