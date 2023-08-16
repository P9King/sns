import React, { useEffect, useRef } from 'react'
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setEmail, setToken } from '../../../slices/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  localStorage.removeItem('loginedEmail');
  localStorage.removeItem('myToken');

  function submitHandler(e) {
    e.preventDefault();

    const loginedEmail = document.querySelector('.email').value
    const payload = {
      email: document.querySelector('.email').value,
      password: document.querySelector('.password').value
    }
    axios.post('http://localhost:4000/api/auth/login', payload)
      .then((result) => {
        console.log(result.data[0].email);
        if (result.data === 'failure') {
          alert('check your email and password again');
        } else {
          dispatch(setToken(result.data[1]));
          dispatch(setEmail(result.data[0].email))
          localStorage.setItem('myToken', result.data[1]);
          localStorage.setItem('loginedEmail', JSON.stringify(result.data[0]));
          navigate('/');
          window.location.reload();
        }
      })

  }

  return (
    <div className='container'>
      <Row className="vh-100 d-flex justify-content-center align-items-center">
        <Col md={8} lg={6} xs={12} style={{ width: '750px' }}>
          <div className="barDiv border border-3 border-primary" ></div>
          <Card className="shadow" style={{ width: '750px' }}>
            <Card.Body>
              <div className="mb-3 mt-md-4">
                <h2 className="fw-bold mb-2 text-uppercase ">DudeTo</h2>
                <p className="guideLine mb-5">Please enter your login and password!</p>
                <div className="mb-3">
                  <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label className="text-center">
                        Email address
                      </Form.Label>
                      <Form.Control className="email" type="text" placeholder="Enter email" autoComplete='off' />
                    </Form.Group>

                    <Form.Group
                      className="mb-3"
                      controlId="formBasicPassword"
                    >
                      <Form.Label>Password</Form.Label>
                      <Form.Control className="password" type="password" placeholder="Password" autoComplete='off' />
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="formBasicCheckbox"
                    >
                      <p className="small">
                        <Link className="text-primary" href="/auth/findAccount">
                          Forgot password?
                        </Link>
                      </p>
                    </Form.Group>
                    <div className="d-grid">
                      <Button variant="primary" type="submit">
                        Login
                      </Button>
                    </div>
                  </Form>
                  <div className="mt-3">
                    <p className="mb-0  text-center">
                      Don't have an account?{" "}
                      <Link to="/auth/signup" className="text-primary fw-bold">
                        Sign Up
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Login