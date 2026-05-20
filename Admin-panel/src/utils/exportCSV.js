import { saveAs } from "file-saver";

export default function exportCSV(filteredSubmissions) {

  const headers = [
    "Name",
    "Email",
    "Account Type",
    "Risk Score",
    "Status",
    "Submitted Date",
  ];

  const rows = filteredSubmissions.map((item) => [

    `${item.firstName || ""} ${item.lastName || ""}`,

    item.email || "No Email",

    item.accountType || "-",

    item.riskScore || 0,

    item.status || "-",

    item.submittedAt
      ? new Date(item.submittedAt).toLocaleDateString()
      : "-",

  ]);

  const csvContent = [
    headers,
    ...rows,
  ]
    .map((e) => e.join(","))
    .join("\n");

  const blob = new Blob(
    [csvContent],
    { type: "text/csv;charset=utf-8;" }
  );

  saveAs(blob, "submissions.csv");
}
