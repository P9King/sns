import React, { useEffect, useRef, useState } from 'react'
import './joinRoom.css';
import axios from 'axios';
import { io } from 'socket.io-client';

function JoinRoom() {
  const url = window.location.href;
  const myToken = localStorage.getItem('myToken');
  //const loginedEmail = localStorage.getItem('loginedEmail');
  const loginedEmail = JSON.parse(localStorage.getItem('loginedEmail'));
  const queryRoomName = url.split('=')[1];
  const buttonRef = useRef();
  const [messages, setMessages] = useState([]);
  const [data, setData] = useState({});
  const messageUl = useRef(null);

  //socket
  const socket = io('http://localhost:4000', {
    extraHeaders: {
      Authorization: `Bearer ${myToken}`,
    },
  });


  //socket connection
    socket.emit('joinRoom', queryRoomName);
    socket.on('userJoined', (messages) => {
      console.log("message from server " + messages);
    });
    //return socket.off;



  //recive message
  useEffect(() => {
    socket.on('message', (data) => {
      console.log("recieved message ", data);

      if(data.userName === loginedEmail.name){
        let sentMessage = document.createElement('li');
        sentMessage.classList.add('sentMessage');
        sentMessage.textContent = `${data.message}`;
        messageUl.current.appendChild(sentMessage);
      }else{
        let receiveLi = document.createElement('li');
        receiveLi.classList.add('receivedMessage');
        receiveLi.textContent = `${data.userName} : ${data.message}`;
        messageUl.current.appendChild(receiveLi);
      }
      
    });

    // Cleanup: 소켓 이벤트 리스너 제거
    return () => {
      socket.off('message');
    };

  }, []); 




  //enter key event
  function keyDownHandler(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      buttonRef.current.click();
    }
  }

  async function sendHandler(e) {
    e.preventDefault();
     let message = document.querySelector('.message');
    // let messageLi = document.createElement('li');

    // messageLi.textContent = message.value + ' : ' + 'me';
    // messageLi.classList.add('sentMessage');
    // messageUl.current.appendChild(messageLi);

    socket.emit('message', { message: message.value, roomName: queryRoomName, userName: loginedEmail.name });

    message.value = ''.trim();
  }

  return (
    <div className='container'>
      <div className='massageBox'>
        <div className='messageHistory'>
          <ul className="messageUl" ref={messageUl}></ul>
        </div>

        <div className='textBox'>
          <div className='textareaCase'>
            <textarea className='message' onKeyDown={keyDownHandler}></textarea>
          </div>
          <button className='sendBtn' type='button' ref={buttonRef} onClick={sendHandler} >send</button>
        </div>
      </div>
    </div>
  )
}

export default JoinRoom