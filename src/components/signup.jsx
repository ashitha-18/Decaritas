import React, { useState } from 'react';
import { Button, TextField, Typography, Link, Container, Box } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import userService from '../service/userservice';
import * as Yup from 'yup';
import UseWallet from './useWallet';

const SignupSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required')
});

const Signup = () => {
  const navigate = useNavigate();

  const [connectedWallet, setConnectedWallet] = useState(null);

  const handleConnectWallet = async () => {
    const account = await UseWallet();
    setConnectedWallet(account);
  };

  const handleSignup = async (values, { setSubmitting }) => {
    try {
      const newUser = await userService.signup(values.email, values.password, connectedWallet);
      console.log('New user created:', newUser);
      alert("User signed up successfully!");
      navigate('/login');
    } catch (error) {
      alert("Error signing up");
      console.error('Error signing up:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 bg-cover bg-center w-full h-screen " style={{ backgroundImage: "url('https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=1912&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>

    <Container component="main" maxWidth="xs">
      <div className="container mt-12">
        <Typography className = "flex justify-center " component="h1" variant="h5">
          Sign Up
        </Typography>
        <Formik
          initialValues={{ email: '', password: '', confirmPassword: '' }}
          validationSchema={SignupSchema}
          onSubmit={handleSignup}
        >
          {({ isSubmitting }) => (
            <Form className="form">
              <Field as={TextField} variant="outlined" margin="normal" fullWidth id="email" label="Email" name="email" autoComplete="email" autoFocus />
              <ErrorMessage name="email" component="div" />
              <Field as={TextField} variant="outlined" margin="normal" fullWidth name="password" label="Password" type="password" id="password" autoComplete="new-password" />
              <ErrorMessage name="password" component="div" />
              <Field as={TextField} variant="outlined" margin="normal" fullWidth name="confirmPassword" label="Confirm Password" type="password" id="confirmPassword" autoComplete="new-password" />
              <ErrorMessage name="confirmPassword" component="div" />
              {connectedWallet ? (
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  name="walletAddress"
                  label="Wallet Address"
                  type="text"
                  id="walletAddress"
                  value={connectedWallet}
                  disabled
                />
              ) : (
                <div>
                  <Button onClick={handleConnectWallet} fullWidth variant="contained" color="primary" className="connectWallet">
                    Connect Wallet
                  </Button>
                </div>
              )}
              <div className='mt-6'></div>
              {connectedWallet ? (
                <Button type="submit" fullWidth variant="contained" color="primary" className="submit" disabled={isSubmitting}>
                  Sign Up
                </Button>
              ) : (
                <Button type="submit" fullWidth variant="contained" color="primary" className="submit" disabled={true}>
                  Sign Up
                </Button>
              )}
            </Form>
          )}
        </Formik>
        <Box className = "flex justify-center"  mt={2}>
          <Link component={RouterLink} to="/login" variant="body2">
            Already have an account? Log in
          </Link>
        </Box>
      </div>
    </Container>
    </div>
  );
};

export default Signup;