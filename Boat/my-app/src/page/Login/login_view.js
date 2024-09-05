import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Link, InputAdornment, IconButton, Paper, Grid } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('sofia@devias.io');
  const [password, setPassword] = useState('');

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Container component="main" maxWidth="lg" sx={{ display: 'flex', alignItems: 'center' }}>
        <Grid container>
          {/* Left side - Login form */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                Sign in
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                Don't have an account? <Link href="#" color="primary">Sign up</Link>
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <Link href="#" variant="body2" sx={{ mb: 2 }}>
                Forgot password?
              </Link>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: '#6366F1', '&:hover': { bgcolor: '#4338CA' } }}
              >
                Sign In
              </Button>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: '#FFF7ED',
                  borderRadius: 1,
                  border: '1px solid #FDBA74',
                  width: '100%',
                }}
              >
                <Typography variant="body2" sx={{ color: '#C2410C' }}>
                  Use sofia@devias.io with password Secret1
                </Typography>
              </Paper>
            </Box>
          </Grid>
          
          {/* Right side - Welcome message */}
          <Grid item xs={12} md={6} sx={{ bgcolor: '#111827', color: 'white', p: 8, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Welcome to <span style={{ color: '#10B981' }}>Devias Kit</span>
            </Typography>
            <Typography variant="body1">
              A professional template that comes with ready-to-use MUI components.
            </Typography>
            {/* Placeholder for the decorative images */}
            <Box sx={{ mt: 4, position: 'relative', height: 200 }}>
              <Paper elevation={3} sx={{ position: 'absolute', top: 0, right: 0, width: 200, height: 100, bgcolor: 'white', borderRadius: 2 }} />
              <Paper elevation={3} sx={{ position: 'absolute', bottom: 0, left: 0, width: 200, height: 100, bgcolor: 'white', borderRadius: 2 }} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoginPage;