import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Explore = () => {
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
                const response = await axios.get(`http://localhost:3001/api/orders/status/${tableNumber}`);
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const getChartData = () => {
        const colors = {
            pending: '#FF4365', // Red
            'in progress': '#36A2EB', // Blue
            completed: '#4CAF50', // Green
            default: '#CCCCCC', // Gray for unknown status
        };

        const backgroundColor = colors[orderStatus] || colors.default;

        return {
            labels: [orderStatus ? orderStatus.toUpperCase() : 'UNKNOWN'],
            datasets: [
                {
                    data: [1],
                    backgroundColor: [backgroundColor],
                    hoverBackgroundColor: [backgroundColor],
                    borderWidth: 0,
                },
            ],
        };
    };

    const chartData = getChartData();

    return (
        <div style={{ textAlign: 'center' }}>
            <h3>Order Status</h3>
            <div style={{ position: 'relative', width: '300px', height: '300px', margin: '0 auto' }}>
                <Doughnut
                    data={chartData}
                    options={{
                        cutout: '70%', // Creates a doughnut chart
                        plugins: {
                            tooltip: { enabled: false },
                            legend: { display: false },
                        },
                    }}
                />
                {/* Center Text */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: 'white',
                        textAlign: 'center',
                    }}
                >
                    {orderStatus ? orderStatus.toUpperCase() : 'UNKNOWN'}
                </div>
            </div>
            <p style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold' }}>
                Current Status: {orderStatus ? orderStatus.toUpperCase() : 'UNKNOWN'}
            </p>
        </div>
    );
};

export default Explore;
