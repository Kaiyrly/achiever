import React, { FormEvent, useState } from 'react'
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import Alert from "react-bootstrap/Alert"; 
import '../App.css'
import { useLocation, useNavigate } from 'react-router-dom';
import { signIn } from '../services/api'; 

export const Login: React.FC<{token: string | undefined, setToken: (userToken: {token: string | undefined}) => void}> = ({token, setToken}) => {
  const [email, setEmail] = useState<string>()
  const [password, setPassword] = useState<string>()
  const [errorMessage, setErrorMessage] = useState<string>();

  const navigate = useNavigate();
  const location = useLocation();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) return;
  
    try {
      
      const data = await signIn(email, password);

      setToken({ token: data.accessToken });
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (error: any) {
      if (error.response.status == 401) {
        setErrorMessage("Invalid password."); 
      } else if (error.response.status == 404) {
        setErrorMessage("User not found");
      } else {
        setErrorMessage("An error occurred while signing in. Please try again.");
      }
    }
  };

  const goToSignup = () => {
    navigate('/signup');
  }
  

  return (
    <div className='login-form'>
      <Form onSubmit={submitHandler}>
        {errorMessage && ( 
          <Alert variant="danger" onClose={() => setErrorMessage(undefined)} dismissible>
            {errorMessage}
          </Alert>
        )}
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" onChange={e => setEmail(e.target.value)}/>
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <ButtonGroup>
          <Button variant="primary" type="submit">
            Login
          </Button>
          <Button variant="secondary" onClick={goToSignup}>
            Register
          </Button>
        </ButtonGroup>
        <Button variant="link" onClick={() => navigate('/forgot-password')}>
          Forgot Password?
        </Button>
    </Form>
    </div>
  )
}
