import {
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

export default function ReviewerSelect() {
  return (
    <FormControl size="small">
      <Select defaultValue="Unassigned">
        <MenuItem value="Unassigned">
          Unassigned
        </MenuItem>

        <MenuItem value="Alex">
          Alex
        </MenuItem>

        <MenuItem value="Sarah">
          Sarah
        </MenuItem>
      </Select>
    </FormControl>
  );
}