import {
  Box,
  Card,
  TextField,
  Typography,
  Button,
} from "@mui/material";

import { useState } from "react";

import { loginAdmin } from "../services/authService";

export default function Login() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async () => {
    try {
      const data = await loginAdmin(
        email,
        password
      );

      localStorage.setItem(
        "token",
        data.token
      );

      alert("Login success");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#F4F5FA"
    >
      <Card
        sx={{
          p: 5,
          width: 400,
          borderRadius: 5,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          mb={3}
        >
          Admin Login
        </Typography>

        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          margin="normal"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Card>
    </Box>
  );
}