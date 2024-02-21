import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, Container, CssBaseline, Grid, TextField, Typography } from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "../Navbar/Navbar";
import Copyright from "../../common/Copyright";

const Login = ({ userInfo, setUserInfo }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo.token) {
      navigate("/");
    }
  }, [userInfo.token, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    fetch(`/api/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Incorrect E-mail or Password.");
          } else {
            throw new Error(
              "There was a problem with the Fetch operation: " + res.status
            );
          }
        }
        const data = await res.json();
        return { ...data, token: data.token };
      })
      .then((data) => {
        fetch(`/api/users/65ca708b0a05d172281521a2`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        })
          .then((res) => res.json())
          .then((userData) => {
            const isAdmin = userData.roles.some(role => role.name === "ADMIN");
            setUserInfo({ ...data, isAdmin });
            localStorage.setItem("userInfo", JSON.stringify({ ...data, isAdmin }));
            navigate("/", { state: { message: "Login successful" } });
          })
          .catch((err) => {
            toast.error(err.toString(), { toastId: "login-alert" });
          });
      })
      .catch((err) => {
        toast.error(err.toString(), { toastId: "login-alert" });
      });
  };

  return (
    <>
      <Navbar userInfo={userInfo} setUserInfo={setUserInfo} />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            id="login-form"
            onSubmit={submitHandler}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              type="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              color="primary"
            >
              SIGN IN
            </Button>
            <Grid container>
              <Grid item>
                <Link to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
      <ToastContainer autoClose={2000} theme="colored" />
    </>
  );
};

export default Login;