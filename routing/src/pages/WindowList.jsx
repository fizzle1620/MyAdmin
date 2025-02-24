import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WindowList.css'; // Ensure this path is correct

export const WindowList = () => {
  const [windows, setWindows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [windowName, setWindowName] = useState('');

  // Fetch window data when component mounts
  useEffect(() => {
    axios.get('http://localhost:5000/api/accounts')
      .then(response => {
        setWindows(response.data);
      })
      .catch(error => {
        console.error('Error fetching windows:', error);
      });
  }, []);

  // Handle form submission to create new window
  const handleSubmit = (e) => {
    e.preventDefault();

    const newAccount = {
      username,
      password,
      window_name: windowName,
    };

    // POST request to add a new window/account
    axios.post('http://localhost:5000/api/accounts', newAccount)
      .then(response => {
        setWindows([...windows, response.data]);
        setShowModal(false); // Close modal after submission
        setUsername('');
        setPassword('');
        setWindowName('');
      })
      .catch(error => {
        console.error('Error adding account:', error);
      });
  };

  // Function to delete a window/account
  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/accounts/${id}`)
      .then(() => {
        const updatedWindows = windows.filter((window) => window.id !== id);
        setWindows(updatedWindows);
      })
      .catch((error) => console.error('Error deleting window:', error));
  };

  // Function to toggle active/inactive status using a select dropdown (POST method)
  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'inactive' ? 'active' : 'inactive';

    axios.post(`http://localhost:5000/api/accounts/status/${id}`, { status: newStatus })
      .then(() => {
        const updatedWindows = windows.map(window => 
          window.id === id ? { ...window, status: newStatus } : window
        );
        setWindows(updatedWindows);
      })
      .catch((error) => console.error('Error toggling status:', error));
  };

  return (
    <div>
      <h1>Window List</h1>

      <button className="addBtn" onClick={() => setShowModal(true)}>
        Add Window
      </button>

      {/* Modal for creating new account */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowModal(false)}>X</button>
            <h2>Create New Window</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
              <input
                type="text"
                name="windowName"
                value={windowName}
                onChange={(e) => setWindowName(e.target.value)}
                placeholder="Enter window name"
                required
              />
              <button type="submit">Create Account</button>
            </form>
          </div>
        </div>
      )}

      {/* Window List */}
      <ul>
        {windows.map((window) => (
          <li key={window.id}>
            <div>
              <span>{window.window_name}</span>
              <button onClick={() => handleDelete(window.id)} className="delete-btn">Delete</button>
              {/* Using a select dropdown for active/inactive status */}
              <select 
                value={window.status} 
                onChange={(e) => handleToggleStatus(window.id, e.target.value)} 
                className="status-select"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
