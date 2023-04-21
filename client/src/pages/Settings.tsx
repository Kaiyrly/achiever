import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import useToken from '../hooks/useToken';
import { getUserIdFromToken } from '../helpers';
import '../App.css';

export const Settings: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const { token } = useToken();
  const userId = getUserIdFromToken(token ?? '') ?? '';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate the new password and confirm new password match
    if (newPassword !== confirmNewPassword) {
      alert('New password and confirm password do not match');
      return;
    }

    try {
      const response = await axios.put('http://localhost:5001/api/auth/changePassword', {
        currentPassword,
        newPassword,
        userId,
      }, {
        headers: {
          'x-access-token': token,
        },
      });

      if (response.status === 200) {
        alert('Password updated successfully.');

        // Empty the form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password. Please try again.');
    }
  };

  return (
    <>
      <h2>Change Password</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="currentPassword">
          <Form.Label>Current Password</Form.Label>
          <Form.Control
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="newPassword">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="confirmNewPassword">
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Change Password
        </Button>
      </Form>
    </>
  );
};
