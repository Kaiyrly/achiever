import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';

interface NavBarProps {
  token: string | undefined;
  setToken: (userToken: { token: string | undefined }) => void;
}

export const NavBar: React.FC<NavBarProps> = ({ token, setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken({ token: undefined });
    navigate('/login');
  };

  return (
    <Navbar bg="light" variant="light">
      <Container>
        <Nav className="me-auto">
          <Nav.Link href="/">Main</Nav.Link>
          <Nav.Link href="/statistics">Statistics</Nav.Link>
          <Nav.Link href="/settings">Settings</Nav.Link>
        </Nav>
        {token ? (
          <Link to="#" onClick={handleLogout}>
            Log Out
          </Link>
        ) : (
          <Button variant="outline-primary" href="/login">
            Login
          </Button>
        )}
      </Container>
    </Navbar>
  );
};
