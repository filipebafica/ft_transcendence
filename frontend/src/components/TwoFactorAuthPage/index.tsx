import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const TwoFactorAuthPage = () => {
  const [code, setCode] = useState('');

  const handleSubmit = async () => {
    // Logic to validate the 2FA code
    console.log('Validating 2FA code:', code);
    // You would typically send a request to your backend server here
  };

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
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
      </Box>
    </Container>
  );
};

export default TwoFactorAuthPage;
