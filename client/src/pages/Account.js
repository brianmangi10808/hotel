import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Account = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/products-client');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Product List</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.description || 'N/A'}</td>
              <td>{product.status}</td>
              <td>{product.price}</td>
              <td>{product.quantity}</td>
              <td>{product.unit}</td>
              <td>
                {product.image ? (
                  <img
                    src={`data:${product.image_type};base64,${product.image}`}
                    alt={product.name}
                    style={{ width: '100px' }}
                  />
                ) : (
                  'No Image'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Account;
