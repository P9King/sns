import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';


function Header() {
  const [loginedEmail, setLoginedEmail] = useState(false);
  let loginedUserEmail;
  
  
  //login info check
  useEffect(() => {
    loginedUserEmail = localStorage.getItem('loginedEmail'); 
    if (loginedUserEmail) {
      setLoginedEmail(loginedUserEmail);
    }
  },[loginedEmail])

  //log out
  function logoutHandler(){
    localStorage.removeItem('loginedEmail');
  }


  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">DudeTo</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/boards/postBoard">Post</Nav.Link>
            <Nav.Link href="#pricing">Chat</Nav.Link>
          </Nav>
          <Nav>
            {loginedEmail ? (
              <>
                <Nav.Link onClick={logoutHandler} href="/">Logout</Nav.Link>
                <Nav.Link href="/auth/mypage">My Page</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link href="/auth/login">Login</Nav.Link>
                <Nav.Link href="/auth/signup">Sign up</Nav.Link>
              </>
            )}

            {/* <Nav.Link href="/auth/login">Login</Nav.Link>
            <Nav.Link eventKey={2} href="#memes">
              Sing up
            </Nav.Link> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;