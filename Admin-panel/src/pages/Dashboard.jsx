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

  return (
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
