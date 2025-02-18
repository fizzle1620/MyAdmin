import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WindowList.css';
import Modal from 'react-modal';

// Ensure the modal knows where to attach the app
if (document.getElementById('root')) {
  Modal.setAppElement('#root');
}

export const WindowList = () => {
  // State variables
  const [windows, setWindows] = useState([]); // Stores the list of windows fetched from the API
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls visibility of the add window modal
  const [isConfirmAdd, setIsConfirmAdd] = useState(false); // Tracks confirmation for adding a window (not currently used)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Controls visibility of the delete window modal
  const [windowToDelete, setWindowToDelete] = useState(null); // Stores the window ID to delete

  // useEffect hook to fetch windows from the backend on component mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/windows') // API call to fetch windows
      .then((response) => setWindows(response.data)) // On success, update the state with the fetched windows
      .catch((error) => console.error('Error fetching windows:', error)); // On error, log the error
  }, []); // Empty dependency array means this will only run once after the component mounts

  // Function to open the "Add Window" modal
  const handleAddWindow = () => {
    setIsModalOpen(true); // Set the modal to open when adding a new window
  };

  // Function to confirm and add a new window
  const confirmAddWindow = () => {
    const newWindow = {
      name: `Window ${windows.length + 1}`, // Generate a new name based on the current number of windows
      status: 'Active', // Default status is 'Active'
    };

    // Send a POST request to the backend to add the new window
    axios.post('http://localhost:5000/api/windows', newWindow)
      .then((response) => {
        // On success, add the new window to the list of windows in the state
        setWindows([...windows, response.data]);
        setIsModalOpen(false); // Close the modal after adding the window
      })
      .catch((error) => {
        console.error('Error adding window:', error); // Log error if the API call fails
        setIsModalOpen(false); // Close the modal even if there’s an error
      });
  };

  // Function to cancel the "Add Window" action and close the modal
  const cancelAddWindow = () => {
    setIsModalOpen(false); // Close the modal without adding a new window
  };

  // Function to toggle the status of a window (Active/Inactive)
  const toggleStatus = (id, currentStatus) => {
    const updatedStatus = currentStatus === 'Active' ? 'Inactive' : 'Active'; // Toggle between 'Active' and 'Inactive'

    // Send a PUT request to the backend to update the window's status
    axios.put(`http://localhost:5000/api/windows/${id}`, { status: updatedStatus })
      .then(() => {
        // On success, update the status of the window in the state
        setWindows(windows.map((window) =>
          window.id === id ? { ...window, status: updatedStatus } : window
        ));
      })
      .catch((error) => console.error('Error updating window status:', error)); // Log error if the API call fails
  };

  // Function to open the "Delete Window" modal
  const handleDelete = (id) => {
    setWindowToDelete(id); // Set the window ID that is to be deleted
    setIsDeleteModalOpen(true); // Open the delete confirmation modal
  };

  // Function to confirm and delete a window
  const confirmDeleteWindow = () => {
    if (windowToDelete) {
      // Send a DELETE request to the backend to delete the selected window
      axios.delete(`http://localhost:5000/api/windows/${windowToDelete}`)
        .then(() => {
          // On success, remove the deleted window from the state
          setWindows(windows.filter((window) => window.id !== windowToDelete));
          setIsDeleteModalOpen(false); // Close the modal after deleting
          setWindowToDelete(null); // Reset the window ID to delete
        })
        .catch((error) => console.error('Error deleting window:', error)); // Log error if the API call fails
    }
  };

  // Function to cancel the delete action and close the delete modal
  const cancelDeleteWindow = () => {
    setIsDeleteModalOpen(false); // Close the modal if user cancels
    setWindowToDelete(null); // Reset the window ID to delete
  };

  return (
    <div className="windowlist-container">
      <h1 className="windowh1">Window List</h1>
      <button className="addWindow" onClick={handleAddWindow}>Add Window</button>
      
      {/* Modal for adding a window */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={cancelAddWindow}
        contentLabel="Add Window Confirmation"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Do you want to add a new window?</h2>
        <div>
          <button className="yes" onClick={confirmAddWindow}>Yes</button>
          <button className="no" onClick={cancelAddWindow}>No</button>
        </div>
      </Modal>

      {/* Modal for deleting a window */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={cancelDeleteWindow}
        contentLabel="Delete Window Confirmation"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Are you sure you want to delete this window?</h2>
        <div>
          <button className="yes" onClick={confirmDeleteWindow}>Yes</button>
          <button className="no" onClick={cancelDeleteWindow}>No</button>
        </div>
      </Modal>

      {/* Table displaying the list of windows */}
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Window</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Loop through the windows array and display each window's data */}
          {windows.map((window) => (
            <tr key={window.id}>
              <td>{window.id}</td>
              <td>{window.name}</td>
              <td>{window.status}</td>
              <td>
                {/* Button to toggle window status (Activate/Deactivate) */}
                <button onClick={() => toggleStatus(window.id, window.status)}>
                  {window.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
                {/* Button to delete the window */}
                <button onClick={() => handleDelete(window.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
