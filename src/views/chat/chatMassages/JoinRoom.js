import React, { useEffect, useRef, useState } from 'react';
import './joinRoom.css';
import axios from 'axios';
import { io } from 'socket.io-client';

function JoinRoom() {
  const url = window.location.href;
  const myToken = localStorage.getItem('myToken');
  const loginedEmail = JSON.parse(localStorage.getItem('loginedEmail'));
  const queryRoomName = url.split('=')[1];
  const buttonRef = useRef();
  const [socketInitialized, setSocketInitialized] = useState(false);
  const [socket, setSocket] = useState(null);
  const messageUl = useRef(null);

  //socket connect 
  useEffect(() => {
    if (!socketInitialized) {
      const newSocket = io('http://localhost:4000/chat', {
        reconnectionAttempts: 1
      });
      setSocket(newSocket);
      setSocketInitialized(true);
    }
  }, []);

  // get chat history
  useEffect(() => {
    axios.post(`http://localhost:4000/api/chat/chatRoom/joinRoom?roomName=${queryRoomName}`, {})
      .then(result => {
        console.log("this is no from socket", result.data);
        if (result.data === 'failure') {

        } else {
          result.data.forEach(i => {
            if (i.userName === loginedEmail.name) {
              let sentHistory = document.createElement('li');
              sentHistory.classList.add('sentMessage');
              sentHistory.textContent = `${i.message}`;
              messageUl.current.appendChild(sentHistory);
            } else {
              let recievedHistory = document.createElement('li');
              recievedHistory.classList.add('receivedMessage');
              recievedHistory.textContent = `${i.userName} : ${i.message}`;
              messageUl.current.appendChild(recievedHistory);
            }
          })
        }
      })
  }, []);

  useEffect(() => {
    if (socket) {

      //recive message
      socket.on('message', (data) => {
        console.log("recieved message ", data);

        if (data.userName === loginedEmail.name) {
          let sentMessage = document.createElement('li');
          sentMessage.classList.add('sentMessage');
          sentMessage.textContent = `${data.message}`;
          messageUl.current.appendChild(sentMessage);
        } else {
          let receiveLi = document.createElement('li');
          receiveLi.classList.add('receivedMessage');
          receiveLi.textContent = `${data.userName} : ${data.message}`;
          messageUl.current.appendChild(receiveLi);
        }
      });

      // Cleanup: 소켓 이벤트 리스너 제거
      return () => {
        socket.disconnect();
        socket.off('message');
      };
    }
  }, [socket]);

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
    socket.emit('message', { message: message.value, roomName: queryRoomName, userEmail: loginedEmail.email });

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
  );
}

export default JoinRoom;