import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MenuGrid from './components/MenuGrid';
import Home from './pages/Home'; // Your Home component
import Explore from './pages/Explore'; // Your Explore component
import Account from './pages/Account'; // Your Account component

import BottomNav from './components/BottomNav';
import FoodMenu from './components/FoodMenu';
import DrinksMenu from './components/DrinksMenu';
import DessertMenu from './components/DessertMenu';
import BeverageMenu from './components/BeverageMenu';
import CartItems from './components/CartItems';
import { Box } from '@mui/material';

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const itemInCart = prevCart.find((cartItem) => cartItem.id === item.id);
      if (itemInCart) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const clearCart = () => {
    setCart([]);
};

  const updateCartQuantity = (itemId, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    <Router>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#0B2E19',
          width: '100%',
          maxWidth: { md: '70%' },
          margin: { md: '0 auto' },
        }}
      >
        <Header />
        <Routes>
          <Route path="/" element={<MenuGrid />}>
          <Route path="/bottomnav" element={<BottomNav />} />
          </Route>
          <Route path="/food" element={<FoodMenu cart={cart} addToCart={addToCart} />} />
          <Route path="/drinks" element={<DrinksMenu />} />
          <Route path="/desserts" element={<DessertMenu />} />
          <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/account" element={<Account />} />
          <Route path="/beverages" element={<BeverageMenu />} />
          <Route
            path="/cartitems"
            element={<CartItems cart={cart} updateCartQuantity={updateCartQuantity}  clearCart={clearCart}/>}
          />
        </Routes>
        <Box sx={{ flexGrow: 1 }} />
        {/* <BottomNav /> */}
      </Box>
    </Router>
  );
}

export default App;
