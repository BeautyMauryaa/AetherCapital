import { Chip } from "@mui/material";

const StatusChip = ({ status }) => {
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return { color: "#2e7d32", bgColor: "#e8f5e9" };
      case "rejected":
        return { color: "#d32f2f", bgColor: "#ffebee" };
      case "pending":
        return { color: "#ed6c02", bgColor: "#fff3e0" };
      case "under review":
        return { color: "#0288d1", bgColor: "#e1f5fe" };
      default:
        return { color: "#757575", bgColor: "#f5f5f5" };
    }
  };

  const styles = getStatusStyles(status);

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        backgroundColor: styles.bgColor,
        color: styles.color,
        fontWeight: "bold",
        fontSize: "0.75rem",
        borderRadius: "8px",
      }}
    />
  );
};

export default StatusChip;