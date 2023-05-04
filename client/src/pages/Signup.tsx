import React, { FormEvent, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert"; 

import { useNavigate } from "react-router-dom";
import { signUp } from '../services/api'; 

export const Signup: React.FC = () => {
  const [username, setUsername] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const navigate = useNavigate();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !email || !password) {
      return;
    }

    try {
      await signUp(email, username, password);
      navigate("/login");
    } catch (error: any) {
        if (error.response.status == 401) {
          setErrorMessage("User with this email already exists"); 
        } else {
          setErrorMessage("An error occurred while signing up. Please try again.");
        }
    }
  };

  return (
    <div className="signup-form">
      <Form onSubmit={submitHandler}>
        {errorMessage && ( // Conditionally render the error message
          <Alert variant="danger" onClose={() => setErrorMessage(undefined)} dismissible>
            {errorMessage}
          </Alert>
        )}
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Sign Up
        </Button>
      </Form>
    </div>
  );
};
