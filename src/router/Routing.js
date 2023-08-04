import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../views/auth/login/Login'
import PostBoard from '../views/boards/PostBoard';
import App from '../App';
import GetOneBoard from '../views/boards/GetOneBoard';
import UpdateBoard from '../views/boards/UpdateBoard';
import Signup from '../views/auth/signup/Signup';


function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App/>}/>
        <Route path='auth/login' element={<Login/>}/>
        <Route path='auth/signup' element={<Signup/>}/>
        <Route path='boards/postBoard' element={<PostBoard/>}/>
        <Route path='boards/getOneBoard' element={<GetOneBoard/>}/>
        <Route path='boards/updateBoard' element={<UpdateBoard/>}/>

      </Routes>
    </BrowserRouter>
  )
}

export default Routing