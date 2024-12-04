import React from 'react';
import { Box, Typography, IconButton, Divider, CardMedia, Card, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import headers from '../assets/headers.jpg';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CartItems = ({ cart, updateCartQuantity, clearCart }) => {
  const navigate = useNavigate();

  // Calculate the total cost of the cart
  const calculateTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Function to handle order confirmation
  const handleConfirmOrder = async () => {
    const tableNumber = localStorage.getItem('tableNumber'); // Retrieve table number from local storage
    
    if (!tableNumber) {
      alert('Table number is not set. Please set the table number first.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table_number: tableNumber, // Include the table number
          items: cart,
          total: calculateTotal(),
        }),
      });

      if (response.ok) {
        
        alert('Order has been confirmed and sent to the kitchen!');
        clearCart();
      } else {
        const errorData = await response.json();
        alert(`Failed to confirm order: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error confirming order:', error);
      alert('An error occurred while confirming the order.');
    }
  };

  const handleCartClick = () => {
    navigate('/food');
  };

  return (
    <Box sx={{ padding: 3, width: '90%', margin: '0 auto', backgroundColor: '#FFFFFF', borderRadius: 2 }}>
      {/* Header */}
      <Card sx={{ marginBottom: 3, borderRadius: 2, overflow: 'hidden' }}>
        <CardMedia
          component="img"
          image={headers}
          alt="diner"
          sx={{ height: 250, width: '100%', objectFit: 'cover' }}
        />
        {/* Back Arrow Icon on top of the image */}
        <IconButton
          sx={{
            position: 'absolute',
            top: 100,
            color: 'grey',
            backgroundColor: '#FFFFFF',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            },
          }}
          onClick={handleCartClick}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ textAlign: 'center', padding: 2 }}>
          <Typography variant="h4">OddMenu Demo</Typography>
          <Typography variant="body1" color="textSecondary">
            📍 Kasarani Mwiki, Kenya 📞 011589202
          </Typography>
        </Box>
      </Card>

      {/* Cart Items */}
      <Typography variant="h5" sx={{ marginBottom: 2 }}>My Order:</Typography>
      {cart.length > 0 ? (
        <Box>
          {cart.map((item) => (
            <Box key={item.id} sx={{ marginBottom: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{item.title}</Typography>
                <Typography variant="h6" color="secondary">${(item.price * item.quantity)}</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                {item.price}$
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                  color="primary"
                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography variant="h6" sx={{ margin: '0 1rem' }}>{item.quantity}</Typography>
                <IconButton
                  color="primary"
                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                >
                  <AddIcon />
                </IconButton>
              </Box>
              <Divider sx={{ my: 2 }} />
            </Box>
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">Total:</Typography>
            <Typography variant="h5" color="secondary">${calculateTotal()}</Typography>
          </Box>

          {/* Confirm Order Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            onClick={handleConfirmOrder}
          >
            Confirm Order
          </Button>
        </Box>
      ) : (
        <Typography>Your cart is empty</Typography>
      )}
    </Box>
  );
};

export default CartItems;
