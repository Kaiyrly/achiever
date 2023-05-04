import React, { FormEvent, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '../services/api';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>();
  const [successMessage, setSuccessMessage] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const navigate = useNavigate();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    try {
      await requestPasswordReset(email);
      setSuccessMessage('Password reset successfully. Please check your email. If you cannot find it in inbox, please also check spam.');
      setErrorMessage(undefined);
    } catch (error: any) {
      setErrorMessage('An error occurred while resetting the password. Please try again.');
      setSuccessMessage(undefined);
    }
  };

  return (
    <div className="forgot-password-form">
      <Form onSubmit={submitHandler}>
        {successMessage && (
          <Alert variant="success">
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert variant="danger">
            {errorMessage}
          </Alert>
        )}
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Reset password
        </Button>
      </Form>
    </div>
  );
};
