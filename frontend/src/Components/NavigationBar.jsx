import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class NavigationBar extends React.Component {
  render() {
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand as={Link} to="/">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/1/17/Tata_Tamo_Racemo.jpg"
            width="25"
            height="25"
            alt="logo"
            className="me-2"
          />
          MIOLA Shop
        </Navbar.Brand>
        <Nav className="me-auto">
          <Link to="/add"  className="nav-link">Ajouter une voiture</Link>
          <Link to="/list" className="nav-link">Liste des Voitures</Link>
          <Link to="/chat" className="nav-link">Assistant IA</Link>
        </Nav>
      </Navbar>
    );
  }
}

export default NavigationBar;
