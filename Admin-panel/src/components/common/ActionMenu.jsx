import {
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";

import { useState } from "react";

export default function ActionMenu() {
  const [anchorEl, setAnchorEl] =
    useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          View
        </MenuItem>

        <MenuItem onClick={handleClose}>
          Approve
        </MenuItem>

        <MenuItem onClick={handleClose}>
          Reject
        </MenuItem>
      </Menu>
    </>
  );
}