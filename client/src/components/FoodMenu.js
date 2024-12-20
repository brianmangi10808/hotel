import { Box, Typography, Card, CardMedia, Button, Grid, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import headers from '../assets/headers.jpg';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './loader.css'

const FoodMenu = ({ cart, addToCart }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const categoryId = 1; // Example categoryId. Replace with a dynamic value if needed.

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`https://swiftel.co.ke/api/categories/1/products`);
        setProducts(response.data); // Set the products data
        setLoading(false);
      } catch (err) {
        setError('Failed to load products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loader"></div>
      </div>
    );
  }
  if (error) return <p>{error}</p>;

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCartClick = () => {
    navigate('/cartitems');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <Box sx={{ padding: 2, maxWidth: '800px', margin: '0 auto', backgroundColor: '#FFFFFF', borderRadius: 2 }}>
      {/* Header Section */}
      <Card sx={{ marginBottom: 3, borderRadius: 2, overflow: 'hidden' }}>
        <CardMedia
          component="img"
          image={headers}
          alt="diner"
          sx={{ height: 250, width: '100%', objectFit: 'cover' }}
        />
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
          onClick={handleHomeClick}
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

      {/* Menu Items Section */}
      {products.map((product) => (
        <Card key={product.id} sx={{ marginBottom: 4, borderRadius: 2, padding: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <CardMedia
                component="img"
                image={product.image ? `data:image/jpeg;base64,${product.image}` : headers} // Base64 or fallback
                alt={product.name}
                sx={{ borderRadius: 2, height: 300, objectFit: 'cover' }} // Set consistent size
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {product.description}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                    {product.quantity}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2, color: '#E69873' }}>
                    ${product.price}
                  </Typography>
                  <IconButton
                    color="primary"
                    onClick={() => addToCart(product)}
                    sx={{ backgroundColor: '#E69873', color: '#FFFFFF' }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Card>
      ))}

      {/* Cart Summary Section */}
      {cart.length > 0 && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#E69873',
            padding: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        >
          <Typography variant="h6" color="white">
            {getTotalItems()} item{getTotalItems() > 1 ? 's' : ''} in cart
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            sx={{ backgroundColor: '#FFFFFF', color: '#E69873' }}
            startIcon={<ShoppingCartIcon />}
            onClick={handleCartClick}
          >
            Show my order
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default FoodMenu;
