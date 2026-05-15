import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Box, Container, Typography, Grid,
  InputAdornment, IconButton, Snackbar, Alert, Divider,
  ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import loginImg from '../../asset/images/Login11.svg';
import api from '../../utils/api';

const RegisterPage = () => {
  const [contactType, setContactType] = useState('email'); // 'email' | 'phone'
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Phone: '',
    Password: '',
    ConfirmPassword: '',
  });
  const [showPassword, setShowPassword]       = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [alertMessage, setAlertMessage]       = useState('');
  const [alertSeverity, setAlertSeverity]     = useState('success');
  const [openSnackbar, setOpenSnackbar]       = useState(false);
  const [loading, setLoading]                 = useState(false);

  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      navigate('/AdminDashboard', { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContactTypeChange = (_, newType) => {
    if (newType) setContactType(newType);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.Password !== formData.ConfirmPassword) {
      setAlertSeverity('error');
      setAlertMessage('Passwords do not match!');
      setOpenSnackbar(true);
      return;
    }

    const payload = {
      Name: formData.Name,
      Password: formData.Password,
    };
    if (contactType === 'email') {
      payload.Email = formData.Email;
    } else {
      payload.Phone = formData.Phone;
    }

    try {
      setLoading(true);
      const response = await api.post('/api/admin/create', payload);
      setAlertSeverity('success');
      setAlertMessage(response.data.message || 'Admin registered successfully!');
      setOpenSnackbar(true);

      // ✅ Automatically log in after registration
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("adminData", JSON.stringify(response.data.admin));

      setTimeout(() => navigate('/AdminDashboard'), 1500);
    } catch (error) {
      setAlertSeverity('error');
      setAlertMessage(
        error.response?.data?.message || 'Registration failed. Try again!'
      );
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <Container maxWidth="md" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
      <Grid container sx={{ boxShadow: 6, borderRadius: 3, overflow: 'hidden', width: '100%' }}>

        {/* ── Left panel ── */}
        <Grid
          item xs={12} md={6}
          sx={{
            background: 'linear-gradient(135deg, #1E3A8A 0%, #3B5FC0 100%)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 5,
          }}
        >
          <Typography variant="h4" sx={{ mb: 1.5, fontWeight: 'bold', textAlign: 'center' }}>
            Create Admin Account
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', mb: 4, opacity: 0.85 }}>
            Register a new administrator to manage jewelry loans and customers
          </Typography>
          <img src={loginImg} alt="Register Illustration" style={{ maxWidth: '100%', height: 'auto', maxHeight: 240 }} />
        </Grid>

        {/* ── Right form panel ── */}
        <Grid
          item xs={12} md={6}
          sx={{ backgroundColor: 'white', p: { xs: 4, md: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        >
          <Typography variant="h5" sx={{ mb: 3, color: '#1E3A8A', fontWeight: 'bold' }}>
            Admin Register
          </Typography>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <TextField
              label="Full Name"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2.5 }}
              placeholder="e.g. Ramesh Kumar"
            />

            {/* Contact type toggle */}
            <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">Sign in via:</Typography>
              <ToggleButtonGroup
                value={contactType}
                exclusive
                onChange={handleContactTypeChange}
                size="small"
              >
                <ToggleButton value="email" sx={{ textTransform: 'none', px: 2 }}>Email</ToggleButton>
                <ToggleButton value="phone" sx={{ textTransform: 'none', px: 2 }}>Phone</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Email or Phone */}
            {contactType === 'email' ? (
              <TextField
                label="Email Address"
                name="Email"
                type="email"
                value={formData.Email}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2.5 }}
                placeholder="admin@example.com"
              />
            ) : (
              <TextField
                label="Phone Number"
                name="Phone"
                type="tel"
                value={formData.Phone}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2.5 }}
                placeholder="+91 9876543210"
              />
            )}

            {/* Password */}
            <TextField
              label="Password"
              name="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.Password}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2.5 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Confirm Password */}
            <TextField
              label="Confirm Password"
              name="ConfirmPassword"
              type={showConfirm ? 'text' : 'password'}
              value={formData.ConfirmPassword}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mb: 2,
                py: 1.4,
                background: 'linear-gradient(90deg, #1E3A8A, #3B5FC0)',
                '&:hover': { background: 'linear-gradient(90deg, #1B2F6A, #2E4BAF)' },
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
            >
              {loading ? 'Registering...' : 'Register Admin'}
            </Button>
          </form>

          <Divider sx={{ my: 1.5 }} />

          <Typography variant="body2" sx={{ textAlign: 'center', color: 'gray' }}>
            Already have an account?{' '}
            <span
              style={{ color: '#1E3A8A', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => navigate('/')}
            >
              Login here
            </span>
          </Typography>
        </Grid>
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RegisterPage;
