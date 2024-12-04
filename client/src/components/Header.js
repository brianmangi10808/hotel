import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import logo from '../assets/logoh.png';

const Header = () => (
  <AppBar position="static" color="primary">
    <Toolbar>
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
        <Typography variant="h6" align="center">
          Welcome to
        </Typography>
        <img src={logo} alt="Brand Logo" style={{ height: 40, marginLeft: 8 }} />
      </Box>
    </Toolbar>
  </AppBar>
);

export default Header;
