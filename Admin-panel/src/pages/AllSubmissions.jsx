import { useEffect, useState } from "react";

import SubmissionTable from "../components/tables/SubmissionTable";

import { useAdminStore } from "../store/adminStore";

export default function AllSubmissions() {

  const {
    submissions,
    searchQuery,
    fetchSubmissions,
  } = useAdminStore();

  // Filters
  const [typeFilter, setTypeFilter] =
    useState("All Types");

  const [statusFilter, setStatusFilter] =
    useState("All Status");

  const [riskFilter, setRiskFilter] =
    useState("All Risk");

  // Fetch submissions
  useEffect(() => {

    fetchSubmissions();

  }, []);

  // Combined filtering
  const filteredSubmissions =
    submissions.filter((item) => {

      // Search
      const query =
        searchQuery
          .toLowerCase()
          .trim();

      const searchableText = `
        ${item.referenceNumber || ""}
        ${item._id || ""}
        ${item.firstName || ""}
        ${item.lastName || ""}
        ${item.email || ""}
        ${item.companyName || ""}
      `.toLowerCase();

      const matchSearch =
        searchableText.includes(query);

      // Type filter
      const matchType =
        typeFilter === "All Types" ||

        (item.accountType || "")
          .toLowerCase() ===
        typeFilter.toLowerCase();

      // Status filter
      const matchStatus =
        statusFilter === "All Status" ||

        (item.status || "")
          .replace("_", " ")
          .toLowerCase() ===
        statusFilter.toLowerCase();

      // Risk filter
      let matchRisk = true;

      if (riskFilter === "Low Risk") {

        matchRisk =
          (item.riskScore || 0) < 40;

      }

      if (riskFilter === "Medium Risk") {

        matchRisk =
          (item.riskScore || 0) >= 40 &&
          (item.riskScore || 0) < 75;

      }

      if (riskFilter === "High Risk") {

        matchRisk =
          (item.riskScore || 0) >= 75;

      }

      return (
        matchSearch &&
        matchType &&
        matchStatus &&
        matchRisk
      );

    });

  return (

    <main className="w-full min-h-screen px-4 py-6 md:px-8 md:py-12 bg-[#f9fafb]">

      <div className="max-w-7xl mx-auto">

        <SubmissionTable
          submissions={filteredSubmissions}
          title="All Submissions"
          filterState={{
            typeFilter,
            setTypeFilter,
            statusFilter,
            setStatusFilter,
            riskFilter,
            setRiskFilter,
          }}
        />

      </div>

    </main>

  );

}
