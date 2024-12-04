import { useEffect, useState } from 'react';

const useOrderStatus = (tableNumber) => {
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080'); // Connect to WebSocket server

        ws.onopen = () => {
            // Register the table number with the WebSocket server
            ws.send(JSON.stringify({ type: 'register', tableNumber }));
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.tableNumber === tableNumber) {
                setStatus(data.status); // Update the order status
            }
        };

        ws.onclose = () => console.log('WebSocket closed');
        ws.onerror = (error) => console.error('WebSocket error:', error);

        return () => {
            ws.close(); // Clean up the WebSocket connection on unmount
        };
    }, [tableNumber]);

    return status;
};

export default useOrderStatus;
