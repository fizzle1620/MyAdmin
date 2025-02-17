import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WindowList.css';
import Modal from 'react-modal';

// Set the app element for the modal (Accessibility)
if (document.getElementById('root')) {
  Modal.setAppElement('#root');
}

export const WindowList = () => {
  const [windows, setWindows] = useState([]);  // Stores the list of windows
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [username, setUsername] = useState(''); // State for username
  const [password, setPassword] = useState(''); // State for password
  const [windowName, setWindowName] = useState(''); // State for window name

  // Fetch windows from the backend on component mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/accounts')  // Fetch accounts from your backend
      .then((response) => setWindows(response.data))
      .catch((error) => console.error('Error fetching windows:', error));
  }, []);

  const handleAddWindow = () => {
    setIsModalOpen(true); // Open the modal when the "Add Window" button is clicked
  };

  const handleSubmit = (e) => {
    e.preventDefault();  // Prevent the form from reloading the page
    const newAccount = {
      username,
      password,
      windowName,
    };

    // Send a POST request to the backend to create a new account
    axios.post('http://localhost:5000/api/accounts', newAccount)
      .then((response) => {
        console.log('Account created successfully:', response.data);
        setUsername('');
        setPassword('');
        setWindowName('');
        setIsModalOpen(false); // Close the modal
      })
      .catch((error) => {
        console.error('Error adding account:', error);
      });
  };

  const cancelAddWindow = () => {
    setIsModalOpen(false); // Close the modal without saving
  };

  return (
    <div className="windowlist-container">
      <h1 className="windowh1">Window List</h1>
      <button className="addWindow" onClick={handleAddWindow}>Add Window</button>

      {/* Modal for adding a new account */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={cancelAddWindow}
        contentLabel="Add Account Modal"
        className="modal"
        overlayClassName="overlay"
        ariaHideApp={false}  // Disable accessibility check
      >
        <h2>Add New Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          <div className="form-group">
            <label>Window Name:</label>
            <input
              type="text"
              value={windowName}
              onChange={(e) => setWindowName(e.target.value)}
              placeholder="Enter window name"
            />
          </div>
          <div className="modal-actions">
            <button className="yes" type="submit">Submit</button>
            <button className="no" type="button" onClick={cancelAddWindow}>Cancel</button>
          </div>
        </form>
      </Modal>

      {/* Window list display */}
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Window</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {windows.map((window) => (
            <tr key={window.id}>
              <td>{window.id}</td>
              <td>{window.window_name}</td>
              <td>
                {/* Add additional actions for managing windows */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
