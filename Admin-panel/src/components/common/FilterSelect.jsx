import {
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

export default function FilterSelect({
  value,
  options,
}) {
  return (
    <FormControl size="small">
      <Select value={value}>
        {options.map((item) => (
          <MenuItem
            key={item}
            value={item}
          >
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}