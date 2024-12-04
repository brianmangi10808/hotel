import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Grid, Card, CardMedia, Typography, Box } from '@mui/material';
import foodImage from '../assets/food.jpg';
import drinkImage from '../assets/drink.jpg';
import dessertImage from '../assets/desert.jpg';
import beverageImage from '../assets/beverage.jpg';
import logo from '../assets/logo.png';
import BottomNav from './BottomNav';

const menuItems = [
  { title: 'Food Menu', image: foodImage, bgColor: '#F2E2FF', link: '/food' },
  { title: 'Drinks Menu', image: drinkImage, bgColor: '#FDE386', link: '/drinks' },
  { title: 'Desserts Menu', image: dessertImage, bgColor: '#F8CEB4', link: '/desserts' },
  { title: 'Beverage Menu', image: beverageImage, bgColor: '#AAE6FE', link: '/beverages' },
];

const MenuGrid = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Ensure table number is present in the URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tableNumber = queryParams.get('table');

    if (tableNumber) {
      localStorage.setItem('tableNumber', tableNumber); // Store in local storage
    } else {
      // Redirect to an error page or show an alert
      alert('Table number is required. Please scan the QR code to continue.');
      navigate('/'); // Redirect to the home page or any other route
    }
  }, [location, navigate]);

  return (
    <Box sx={{ padding: 2 }}>
      {/* Welcome Container */}
      <Box 
        sx={{
          backgroundColor: '#5ccf50', 
          padding: 2, 
          borderRadius: 2, 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          marginBottom: 10,
          marginTop: 5,
        }}
      >
        <Typography variant="h5" align="center">
          Welcome to swift Restaurant
        </Typography>
        <img src={logo} alt="Logo" style={{ height: 85, marginRight: 8 }} />
      </Box>

      {/* Menu Grid */}
      <Grid container spacing={2}>
        {menuItems.map((item, index) => (
          <Grid item xs={6} key={index}>
            <Link
              to={`${item.link}?table=${localStorage.getItem('tableNumber')}`}
              style={{ textDecoration: 'none' }}
            >
              <Card style={{ backgroundColor: item.bgColor, position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="150"
                  image={item.image}
                  alt={item.title}
                  style={{ filter: 'brightness(0.9)' }} // Darkens the image for text readability
                />
                {/* Overlay with Text */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    background: 'rgba(0, 0, 0, 0.4)', // Semi-transparent background for text contrast
                    textAlign: 'center',
                    padding: 1,
                  }}
                >
                  <Typography variant="h6">
                    <br />
                    {item.title}
                  </Typography>
                </Box>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
      <Outlet />
      <BottomNav />
    </Box>
  );
};

export default MenuGrid;
