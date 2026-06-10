import {
  Box,
  Typography,
  Button,
} from "@mui/material";

export default function PageHeader({
  title,
  buttonText,
}) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <Typography
        variant="h5"
        fontWeight="bold"
      >
        {title}
      </Typography>

      {buttonText && (
        <Button variant="contained">
          {buttonText}
        </Button>
      )}
    </Box>
  );
}