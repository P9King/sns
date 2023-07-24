import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../views/auth/Login'
import PostBoard from '../views/boards/PostBoard';
import App from '../App';


function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App/>}/>
        <Route path="auth/login" element={<Login/>}/>
        <Route path="boards/postBoard" element={<PostBoard/>}/>


      </Routes>
    </BrowserRouter>
  )
}

export default Routing