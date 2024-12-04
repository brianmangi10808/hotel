import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../signup/UserContext';
import { NavLink, Outlet } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    CircularProgress,
    Container,
} from '@mui/material';
import { MdOutlineInventory, MdDashboardCustomize } from 'react-icons/md';
import { LuStore } from 'react-icons/lu';
import { FaUsers } from 'react-icons/fa';
import { FcSalesPerformance } from 'react-icons/fc';
import { IoNotificationsSharp, IoSettingsSharp } from 'react-icons/io5';
import { IoArrowBack } from "react-icons/io5";

const Admin = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [signupData, setSignupData] = useState([]);
    const { username } = useContext(UserContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSignupData = async () => {
            try {
                const response = await axios.get('/api/signup-data');
                const formattedData = response.data.map(item => ({
                    name: item.date,
                    signups: item.count,
                }));
                setSignupData(formattedData);
            } catch (error) {
                console.error('Error fetching signup data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSignupData();
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const navItems = [
        { text: 'DASHBOARD', icon: <MdDashboardCustomize />, path: '/admin/dashboard' },
       
        { text: 'USERS', icon: <FaUsers />, path: '/admin/users' },
        { text: 'STOCK', icon: <MdOutlineInventory />, path: '/admin/inventory' },
        
     
     
    
    ];

    return (
        <div style={{ display: 'flex', overflow: 'hidden' }}>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={toggleSidebar}>
                        ☰
                    </IconButton>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Admin Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer 
                variant="temporary" 
                open={sidebarOpen} 
                onClose={toggleSidebar} 
                anchor="left"
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 250,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <div style={{ padding: '16px', textAlign: 'center', backgroundColor: '#3f51b5', color: '#fff' }}>
                    <Typography variant="h6">{username}</Typography>
                </div>
                <List>
                    {navItems.map((item, index) => (
                        <ListItem button key={index} component={NavLink} to={item.path} onClick={toggleSidebar}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <Container 
                style={{ 
                    flex: 1, 
                    padding: '20px', 
                    marginTop: '64px', // Adjust margin for AppBar height
                    overflow: 'hidden', // Prevent horizontal scrolling
                }}
            >
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <Outlet />
                )}
            </Container>
        </div>
    );
};

export default Admin;
