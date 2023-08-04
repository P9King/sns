import React, { useEffect, useState } from "react";
import "../../public/css/board/getOneBoard.css";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';


function GetOneBoard() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [boardStatus, setBoardStatus] = useState('');
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();

    //token
    const myToken = localStorage.getItem('myToken');
    const loginedEmail = localStorage.getItem('loginedEmail');

    //get param 
    const url = window.location.href;
    const queryStringBoardId = url.split('?')[1];


    const getBoardInfo = async () => {

        await axios.get(`http://localhost:4000/api/boards/getOneBoardAndFiles?${queryStringBoardId}`, {
            headers: {
                "Authorization": "Bearer " + myToken
            }
        }).then((result) => {
            console.log(result.data.files);
            setTitle(result.data.board.title);
            setContent(result.data.board.content);
            setBoardStatus(result.data.board.status);
            setFiles(result.data.files);

            if (loginedEmail === result.data.board.users.email) {
                const btnDiv = document.querySelector('.btnDiv');
                btnDiv.style.display = 'flex';
            }

        })
    }


    const deleteHandler = async () => {
        if (window.confirm('are you sure you want to delete?')) {
            console.log("ASD", myToken)
            await axios.post(`http://localhost:4000/api/boards/deleteBoard?${queryStringBoardId}`,{}, {
                headers: {
                    "Authorization": "Bearer " + myToken
                }
            }).then(result => {
                if (result.data === 'success'){
                    alert('deleted');
                    navigate('/');
                }
            })
        }
    }

    useEffect(() => {
        getBoardInfo();

    }, []);


    return (
        <div className="inputcontainer">
            <p className="title" readOnly>{title}</p>
            <div>
                {files.map((files, index) => (
                    <img key={index} src={`${process.env.PUBLIC_URL}/images/${files.storedName}`} alt={`Image ${index}`} />
                ))}
            </div>
            <div className="discription">
                <p>------ DISCRIPTION-------</p>
            </div>
            <p className="content" readOnly>{content}</p>
            <div className="btnDiv">
                <Link to={`/boards/updateBoard?${queryStringBoardId}`}><button className="postBtn" type="button"> MODIFY</button></Link>
                <button className="deleteBtn" type="button" onClick={deleteHandler}> DELETE</button>
            </div>
        </div>
    );
}

export default GetOneBoard