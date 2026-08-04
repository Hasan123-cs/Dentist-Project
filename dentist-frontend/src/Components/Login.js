import { useState } from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Link,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
  HealthAndSafety,
} from "@mui/icons-material";

export default function Login() {
  // states
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState("");
  const disable = !email || !password ? true : false;
  const [rememberMe, setRememberMe] = useState(false);
  // === states ===
  //handlers
  async function handleLogin() {
    try {
      const response = await fetch("https://localhost:7066/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          rememberMe: rememberMe,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrors(data.message || "Invalid email or password");
        return;
      }
      console.log("Login success:", data);
      localStorage.setItem("token", data.token);
      //   localStorage.setItem("user", JSON.stringify(data.user));
      // navigate("/dashboard");
    } catch (error) {
      console.log(error);

      setErrors("Something went wrong. Try again.");
    }
  }

  //===handlers===
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        backgroundImage: `
        linear-gradient(
          rgba(0,0,0,.45),
          rgba(0,0,0,.45)
        ),
        url("/images/iyada.jpeg")
        `,

        backgroundSize: "cover",
        backgroundPosition: "center",

        p: 2,
      }}
    >
      <Paper
        elevation={12}
        sx={{
          width: "100%",
          maxWidth: 430,

          p: 5,

          borderRadius: 5,

          background: "rgba(255,255,255,0.98)",

          backdropFilter: "blur(10px)",

          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        }}
      >
        {/* Logo */}

        <Box textAlign="center" mb={4}>
          <Box
            sx={{
              width: 80,
              height: 80,

              margin: "auto",

              borderRadius: "50%",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              bgcolor: "#fff8e1",

              border: "2px solid #d4af37",
            }}
          >
            <HealthAndSafety
              sx={{
                fontSize: 50,
                color: "#c9a227",
              }}
            />
          </Box>

          <Typography
            variant="h4"
            fontWeight="700"
            mt={2}
            sx={{
              color: "#b8860b",
            }}
          >
            Dental Clinic
          </Typography>

          <Typography color="text.secondary" mt={1}>
            Sign in to your account
          </Typography>
        </Box>

        {/* Email */}

        <TextField
          fullWidth
          label="Email Address"
          sx={{
            mb: 2,

            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
            },
          }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}

        <TextField
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          sx={{
            mb: 1,

            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
            },
          }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Options */}

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <FormControlLabel
            control={
              <Checkbox
                sx={{
                  color: "#c9a227",
                  "&.Mui-checked": {
                    color: "#c9a227",
                  },
                }}
                onClick={() => {
                  setRememberMe(!rememberMe);
                }}
                value={rememberMe}
              />
            }
            label="Remember me"
          />

          <Link
            underline="hover"
            sx={{
              cursor: "pointer",
              color: "#b8860b",
              fontWeight: 500,
            }}
          >
            Forgot password?
          </Link>
        </Box>

        {/* Login Button */}

        <Button
          fullWidth
          variant="contained"
          sx={{
            py: 1.5,

            borderRadius: 3,

            textTransform: "none",

            fontSize: 17,

            fontWeight: "bold",

            background: "linear-gradient(90deg,#b8860b,#d4af37)",

            boxShadow: "0 8px 20px rgba(212,175,55,.4)",

            "&:hover": {
              background: "linear-gradient(90deg,#996515,#c9a227)",
            },
          }}
          onClick={handleLogin}
          disabled={disable}
        >
          Login
        </Button>

        <Typography
          textAlign="center"
          mt={4}
          color="text.secondary"
          fontSize={14}
        >
          Dental Clinic Management System
        </Typography>
      </Paper>
    </Box>
  );
}
