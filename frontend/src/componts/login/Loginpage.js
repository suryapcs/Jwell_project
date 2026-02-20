
import React, { useState, useEffect  } from 'react';
import { 
  TextField, Button, Box, Container, Typography, Grid, InputAdornment, IconButton, Snackbar, Alert 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import loginImg from '../../asset/images/Login11.svg'; // Replace with your image
import api from '../../utils/api';

const Login= () => {
  const [loginData, setLoginData] = useState({ Email: '', Password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await api.post(
      "/api/admin/login",
      loginData,
      { withCredentials: true }
    );

    setAlertSeverity("success");
    setAlertMessage(response.data.message || "Login Successful!");
    setOpenSnackbar(true);

    // 🔑 Save login state
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("adminData", JSON.stringify(response.data.admin)); 
    // optional: store admin info if your API returns it

    // ✅ Redirect to dashboard
    navigate("/AdminDashboard");

  } catch (error) {
    console.error("Login error:", error);
    setAlertSeverity("error");
    setAlertMessage(
      error.response?.data?.message || "Invalid credentials. Try again!"
    );
    setOpenSnackbar(true);
  }
};

 useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      navigate("/AdminDashboard", { replace: true });
    }
  }, [navigate]);


  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Grid container sx={{ boxShadow: 3, borderRadius: 3, overflow: 'hidden' }}>
        {/* Left Image Section */}
        <Grid item xs={12} md={6} sx={{ backgroundColor: '#1E3A8A', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 4 }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
            Welcome Back!
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', mb: 4 }}>
            Sign in to manage your jewelry loans and track customers
          </Typography>
          <img src={loginImg} alt="Login Illustration" style={{ maxWidth: '100%', height: 'auto' }} />
        </Grid>

        {/* Right Form Section */}
        <Grid item xs={12} md={6} sx={{ backgroundColor: 'white', p: 6, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h5" sx={{ mb: 3, color: '#1E3A8A', fontWeight: 'bold' }}>
            Admin Login
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              name="Email"
              type="email"
              value={loginData.Email}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 3 }}
            />
            <TextField
              label="Password"
              name="Password"
              type={showPassword ? 'text' : 'password'}
              value={loginData.Password}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mb: 2, backgroundColor: '#1E3A8A', '&:hover': { backgroundColor: '#1B2F6A' } }}
            >
              Login
            </Button>
          </form>

          <Typography variant="body2" sx={{ textAlign: 'center', mb: 2 }}>
            Or sign in with
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="outlined" sx={{ borderColor: '#1E3A8A', color: '#1E3A8A' }}><FaFacebookF /></Button>
            <Button variant="outlined" sx={{ borderColor: '#1E3A8A', color: '#1E3A8A' }}><FaTwitter /></Button>
            <Button variant="outlined" sx={{ borderColor: '#1E3A8A', color: '#1E3A8A' }}><FaGoogle /></Button>
            <Button variant="outlined" sx={{ borderColor: '#1E3A8A', color: '#1E3A8A' }}><FaLinkedinIn /></Button>
          </Box>

          <Typography variant="body2" sx={{ mt: 4, textAlign: 'center', color: 'gray' }}>
            Don't have an account? <span style={{ color: '#1E3A8A', cursor: 'pointer' }} onClick={() => navigate('/')}>Register here</span>
          </Typography>
        </Grid>
      </Grid>

      {/* Snackbar */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;
