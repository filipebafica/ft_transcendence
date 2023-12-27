import React, { useState, useContext, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

import { useNavigate, useLocation } from 'react-router-dom';

import { authenticate2FA } from "api/user";

import { AuthContext } from '../../auth'

const TwoFactorAuthPage = () => {
  const [code, setCode] = useState('');
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const location = useLocation();

  const handleSubmit = async () => {
    const res = await authenticate2FA(code.toString());

    const token = res.access_token
    if (token) {
      setToken(token)
      navigate('/home')
    } 
  };

  useEffect(() => {
    const currentPath = location.pathname;
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      setToken(token, true); 
    }
  }, [location, setToken]); 

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Enter 2FA Code
        </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="code"
            label="2FA Code"
            name="code"
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
          >
            Validate
          </Button>
      </Box>
    </Container>
  );
};

export default TwoFactorAuthPage;
