import React, { useEffect, useState } from 'react'
import './chatRoom.css';
import axios from 'axios';
import { Link } from 'react-router-dom';


function ChatRoom() {

    //variable
    const myToken = localStorage.getItem('myToken');
    const loginedEmail = JSON.parse(localStorage.getItem('loginedEmail'));
    const [modal, setModal] = useState(false);
    const addedUsers = new Set();
    const [isVisible, setIsVisible] = useState(true);
    let chatRoomName = document.querySelector('.chatRoomName');
    const [chatRooms, setChatRooms] = useState([]);
    const [isNewChatRoom, setIsNewChatRoom] = useState(false);

    console.log(loginedEmail);

    //modal 
    const Modal = ({ isOpen, onClose, children }) => {
        const modalStyle = {
            display: isOpen ? 'flex' : 'none',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
        };

        const contentStyle = {
            position: 'absolute',
            justifyContent: 'center',
            width: 500,
            height: 400,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        };

        return (
            <div style={modalStyle}>
                <div style={contentStyle}>
                    <div><button onClick={() => { onClose(); setIsVisible(true); }} style={{ marginLeft: "90%" }}>Close</button></div>
                    {children}
                </div>
            </div>
        );
    };

    //chat room
    function openModalHandler() {
        setModal(true);
    }

    function closeModalHandler() {
        setModal(false);
    }

    //create chat room name
    function createChatRoomName(e) {
        e.preventDefault();
        chatRoomName = document.querySelector('.chatRoomName').value;
        axios.post(`http://localhost:4000/api/chat/createChatRoomName?roomName=${chatRoomName}`, {}, {
            headers: { "Authorization": "Bearer " + myToken }
        }).then(result => {
            console.log(result.data);
            if (result.data === 'success') {
                setIsVisible(!isVisible); // add your frine
            } else {
                alert('the room name is already taken');
            }
        })
        setIsVisible(!isVisible);
    }

    //add users for chat
    function addChatRoom(e) {
        e.preventDefault();

        const userList = document.querySelector('.userList');
        let ulElement = userList.querySelector('.ulElement');

        const eamil = document.querySelector('.findChatFriends').value;
        axios.post(`http://localhost:4000/api/chat/addUser?email=${eamil}`, {}, {
            headers: { "Authorization": "Bearer " + myToken }
        }).then(result => {
            if (result.data === 'failure') {
                alert('check email address again');
            } else {
                const userKey = result.data.email;

                if (!addedUsers.has(userKey)) {
                    addedUsers.add(userKey); // Add the user to the tracking Set
                    const item = document.createElement('li');
                    item.textContent = userKey;
                    ulElement.appendChild(item);

                }
            }
            const findChatFriends = document.querySelector('.findChatFriends');
            findChatFriends.value = "";
        });
    }


    function createNewChat(e) {
        e.preventDefault();

        const emailArray = Array.from(addedUsers); // Convert the Set to an array
        emailArray.push(loginedEmail.email);
        console.log("addedUsers", emailArray);
        console.log("chatRoomName ??", chatRoomName.value);
        axios.post(`http://localhost:4000/api/chat/createChatRoom?roomName=${chatRoomName.value}&email=${emailArray}`, {},
            {
                headers: {
                    "Authorization": "Bearer " + myToken
                }
            });

        closeModalHandler();
        setIsNewChatRoom(!isNewChatRoom);
    }

    useEffect(() => {
        axios.post(`http://localhost:4000/api/chat/getChatList`, {}, {
            headers: { "Authorization": "Bearer " + myToken }
        }).then(result => {

            if (result.data === undefined || result.data === null) {

            } else {
                setChatRooms(result.data);
                console.log(result.data);
                console.log(result.data.users);
            }
        }).catch((error)=>{
            if(error.response && error.response.status === 401){
                window.location.href = '/auth/login';
                alert("require login first");
            }
        });
    }, [isNewChatRoom]);


    return (
        <div className='container'>
            <h1>Chat List</h1>
            <div className='searchAndNewChatBox'>
                <button type='button' onClick={openModalHandler}>New Chat</button>
                <from>
                    <input className='searchBox' type="text" />
                    <button>search</button>
                </from>
            </div>

            <Modal isOpen={modal} onClose={closeModalHandler}>
                <form id='roomNameForm' hidden={!isVisible}>
                    <div className='roomNameDiv'>
                        <input className='chatRoomName' type='text' placeholder='write your chat room name' required />
                        <button className='addBtn' onClick={createChatRoomName}>room</button>
                    </div>

                </form>
                <div className='userList' hidden={isVisible}>
                    <ul className='ulElement'></ul>
                    <form>
                        <div id='addUserForm'>
                            <input className='findChatFriends' type="text" placeholder='write email for invite' />
                            <button className='addBtn' onClick={addChatRoom}>Add</button>
                        </div>
                    </form>
                    <button className='newChatBtn' type='button' onClick={createNewChat}>Create Chat</button>
                </div>

            </Modal>

            <div className='dividingLine'></div>

            {/* chat list */}
            <div className='cardList'>
                {chatRooms.map((chatRoom, index) => (
                    <card key={index} className='cardBox'>
                        <Link to={`/chat/chatRoom/joinRoom?roomName=${chatRoom.roomName}`}>
                            <p className='cardTitle'>{chatRoom.roomName}</p>
                            <p>인원 2명</p>
                        </Link>
                    </card>
                ))}
            </div>
        </div>
    )
}

export default ChatRoom