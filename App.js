import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import "./components/dashboard.css";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

function App() {

  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editingId, setEditingId] = useState(null);

  const API = "http://localhost:8081/api/products";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setProducts(data);
  };

  const addProduct = async () => {
    if (!name || !price || !quantity) {
      alert("Fill all fields");
      return;
    }

    const product = { name, price, quantity };

    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });

    fetchProducts();
    clearForm();
  };

  const updateProduct = async () => {
    const product = { name, price, quantity };

    await fetch(`${API}/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });

    fetchProducts();
    clearForm();
    setEditingId(null);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const editProduct = (p) => {
    setEditingId(p.id);
    setName(p.name);
    setPrice(p.price);
    setQuantity(p.quantity);
  };

  const clearForm = () => {
    setName("");
    setPrice("");
    setQuantity("");
  };

  // Dashboard calculations
  const totalProducts = products.length;
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
  const totalRevenue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  // Chart Data
  const barData = {
    labels: products.map(p => p.name),
    datasets: [
      {
        label: "Price",
        data: products.map(p => p.price),
        backgroundColor: "blue"
      }
    ]
  };

  const pieData = {
    labels: products.map(p => p.name),
    datasets: [
      {
        label: "Quantity",
        data: products.map(p => p.quantity),
        backgroundColor: ["red", "green", "blue", "orange", "purple"]
      }
    ]
  };

  return (
    <div>

      <Navbar setIsLoggedIn={() => {}} />

      <div className="container">

        {/* Dashboard Cards */}
        <div className="cards">
          <div className="card blue">Total Products: {totalProducts}</div>
          <div className="card green">Total Quantity: {totalQuantity}</div>
          <div className="card orange">Revenue: ₹{totalRevenue}</div>
        </div>

        {/* Charts */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>

          <div style={{ width: "50%", background: "white", padding: "20px", borderRadius: "10px" }}>
            <h3>Price Chart</h3>
            <Bar data={barData} />
          </div>

          <div style={{ width: "50%", background: "white", padding: "20px", borderRadius: "10px" }}>
            <h3>Quantity Chart</h3>
            <Pie data={pieData} />
          </div>

        </div>

        {/* Form */}
        <div className="form">
          <h3>{editingId ? "Edit Product" : "Add Product"}</h3>

          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <br />

          {editingId ? (
            <button onClick={updateProduct}>Update</button>
          ) : (
            <button onClick={addProduct}>Add</button>
          )}
        </div>

        {/* Table */}
        <div className="table-container">
          <h3>Product List</h3>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.price}</td>
                  <td>{p.quantity}</td>
                  <td>
                    <button onClick={() => editProduct(p)}>Edit</button>
                    <button onClick={() => deleteProduct(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>

    </div>
  );
}

export default App;