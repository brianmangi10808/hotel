import React, { useState, useEffect } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper, Badge } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import'./loader.css'

const BottomNav = () => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const tableNumber = localStorage.getItem('tableNumber');

    if (!tableNumber) {
      setError('Table number is not set. Please log in with a valid table number.');
      setLoading(false);
      return;
    }

    const fetchOrderStatus = async () => {
      try {
        const response = await axios.get(`https://swiftel.co.ke/api/orders/status/${tableNumber}`);
        setOrderStatus(response.data.status); // Update with the order status
        setError(null);
      } catch (err) {
        setError(err.response ? err.response.data.error : 'Failed to fetch order status');
      } finally {
        setLoading(false);
      }
    };

    // Fetch initially
    fetchOrderStatus();

    // Refresh every minute
    const interval = setInterval(fetchOrderStatus, 60000);
    return () => clearInterval(interval);
  }, []);
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="loader"></div>
    </div>
    );
  }

  if (error) {  
return <p>error ...</p>
  }

  
  const handleNavigation = (newValue) => {
    setValue(newValue);


    if (newValue === 0) navigate('/'); 
    if (newValue === 1) navigate('/explore'); 
    if (newValue === 2) navigate('/account'); 
  };

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => handleNavigation(newValue)}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction 
          label="Explore" 
          icon={
            <Badge 
              color="secondary" 
              variant="dot" 
              invisible={!['pending', 'in progress'].includes(orderStatus)}
            >
              <ExploreIcon />
            </Badge>
          } 
        />
        <BottomNavigationAction label="Account" icon={<AccountCircleIcon />} />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;
