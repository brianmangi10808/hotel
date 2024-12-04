import React from 'react';
import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './signup/Login';

import Admin from './adminpage/Admin';
import Register from './signup/Register';
import { UserProvider } from './signup/UserContext';

import Users from './adminpage/Users';

import Dashboard from './adminpage/Dashboard';
import Product from './adminpage/Product';

import Inventory from './adminpage/Inventory';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



function App() {
  return (
    <div className="app-container">
      <UserProvider>
        <ToastContainer />
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
         
          
          <Route path='/admin' element={<Admin />}>
            <Route index element={<Dashboard />} />
            <Route path='dashboard' element={<Dashboard />} />
         
            <Route path='users' element={<Users />} />
            <Route path='inventory' element={<Inventory />}>
             
           
            </Route>
            <Route path='product' element={<Product />} />
          </Route>

        </Routes>
      </UserProvider>
    </div>
  );
}

export default App;
