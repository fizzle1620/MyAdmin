import { Link } from 'react-router-dom';
import './navbar.css'; 

export const Navbar = () => {
  return (
    <div className="navbar-container">
      <h1 className="cashier-admin">Cashier Admin</h1>
      <div className="navbar">
        <Link to="/">Home</Link>
        <Link to="/windowList">WindowList</Link>
        <Link to="/monitoring">Monitoring</Link>
        <Link to="/admin">Admin</Link>
      </div>
    </div>
  );
};
