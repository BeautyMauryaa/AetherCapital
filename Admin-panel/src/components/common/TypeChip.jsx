import { Chip, Box } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import ApartmentIcon from "@mui/icons-material/Apartment";

const TypeChip = ({ type }) => {
  // Logic to select the right icon and label
  const getTypeConfig = (type) => {
    switch (type?.toLowerCase()) {
      case "enterprise":
        return { icon: <ApartmentIcon sx={{ fontSize: 16 }} />, label: "Enterprise", color: "#e8eaf6", textColor: "#3f51b5" };
      case "business":
        return { icon: <BusinessIcon sx={{ fontSize: 16 }} />, label: "Business", color: "#e0f2f1", textColor: "#00897b" };
      case "individual":
        return { icon: <PersonIcon sx={{ fontSize: 16 }} />, label: "Individual", color: "#fff3e0", textColor: "#ef6c00" };
      default:
        return { icon: null, label: type, color: "#f5f5f5", textColor: "#616161" };
    }
  };

  const config = getTypeConfig(type);

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      size="small"
      sx={{
        backgroundColor: config.color,
        color: config.textColor,
        fontWeight: "600",
        borderRadius: "6px",
        "& .MuiChip-icon": { color: config.textColor },
        px: 0.5
      }}
    />
  );
};

export default TypeChip;