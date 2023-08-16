import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../slices/auth/authSlice';


function Header() {
  const [loginedEmail, setLoginedEmail] = useState(false);
  const dispatch = useDispatch();
  const email = useSelector((state) => state.auth.email); // Get the email from the Redux store
  const loginedUserEmail = JSON.parse(localStorage.getItem('loginedEmail')); 
  
  
  //login info check
  useEffect(() => {
 
    if (loginedUserEmail) {
      console.log("????");
      setLoginedEmail(true);
    
    }
  },[loginedEmail])

  //log out
  function logoutHandler(){
    dispatch(logout()); // Dispatch the logout action
    localStorage.removeItem('loginedEmail');
    localStorage.removeItem('myToken');
  }


  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">DudeTo</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/boards/postBoard">Post</Nav.Link>
            <Nav.Link href="/chat/chatRoom">Chat</Nav.Link>
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
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;