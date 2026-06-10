import { Routes, Route } from "react-router-dom";

import DashboardLayout from "../components/Layout/DashboardLayout";

import Dashboard from "../pages/Dashboard";
import AllSubmissions from "../pages/AllSubmissions";
import SubmissionDetail from "../pages/SubmissionDetail";
import UnderReview from "../pages/UnderReview";
import Approved from "../pages/Approved";
import Rejected from "../pages/Rejected";
import Documents from "../pages/Documents";
import Settings from "../pages/Settings";

export default function AppRoutes() {

  return (

    <Routes>

      <Route element={<DashboardLayout />}>

        <Route path="/" element={<Dashboard />} />

        <Route
          path="/submissions"
          element={<AllSubmissions />}
        />

        <Route
          path="/submissions/:id"
          element={<SubmissionDetail />}
        />

        <Route
          path="/approved"
          element={<Approved />}
        />

        <Route
          path="/UnderReview"
          element={<UnderReview />}
        />

        <Route
          path="/rejected"
          element={<Rejected />}
        />

        <Route
          path="/documents"
          element={<Documents />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

      </Route>

    </Routes>

  );
}