import axios from 'axios';
import React, { useState } from 'react';
import { Col, Button, Row, Container, Card, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


export default function Signup() {

  //variable
  const createBtn = document.querySelector('.createBtn');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showCreateButton, setShowCreateButton] = useState(false);
  const navigate = useNavigate();

  //name
  function nameHandler(e) {
    setName(e.currentTarget.value);
  }
  //email
  function emailHandler(e) {
    setEmail(e.currentTarget.value);
  }
  //password
  function passwordHandler(e) {
    setPassword(e.currentTarget.value);
  }

  //confirm password
  const confirmPassword = (e) => {
    const password = document.getElementsByName('password')[0].value;
    const comfirmPassword = e.target.value;

    if (password === comfirmPassword && password.length > 0) {
      setShowCreateButton(true);
    } else {
      setShowCreateButton(false);
    }
  }

  async function submitHandler(e) {
    e.preventDefault();

    const payload = {
      email: email,
      name: name,
      password: password
    }

    console.log(payload);

    await axios.post('http://localhost:4000/api/auth/signup', payload)
    .then(result => {
      if(result.data === 'success') {
        navigate('/');
      }else{
        alert('the email is already taken, please use another email');
      }
    });
  }

  return (
    <div>
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col className='cardBox' md={8} lg={6} xs={12} style={{ width: '750px' }}>
            <Card className="px-4" style={{ width: '750px', height: '100%' }}>
              <Card.Body>
                <div className="cardDiv mb-3 mt-md-4" style={{ width: '420px' }}>
                  <h2 className="fw-bold mb-2 text-center text-uppercase " style={{ color: 'black' }}>
                    write yor info for sign up!
                  </h2>
                  <div className="cardForm mb-3">
                    <Form onSubmit={submitHandler}>
                      <Form.Group className="mb-3" controlId="Name">
                        <Form.Label className="text-center">Name</Form.Label>
                        <Form.Control type="text" onChange={nameHandler} placeholder="Enter Name" />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className="text-center">
                          Email address
                        </Form.Label>
                        <Form.Control type="text" onChange={emailHandler} placeholder="Enter email" />
                      </Form.Group>

                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name='password' onChange={passwordHandler} placeholder="Password" />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={confirmPassword} />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicCheckbox"
                      ></Form.Group>
                      <div className="d-grid">
                        <Button className='createBtn' variant="primary" type="submit" style={{ display: showCreateButton ? 'block' : 'none' }}>
                          Create Account
                        </Button>
                      </div>
                    </Form>
                    <div className="mt-3">
                      <p className="mb-0  text-center">
                        Already have an account??{' '}
                        <a href="/auth/login" className="text-primary fw-bold">
                          Sign In
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}