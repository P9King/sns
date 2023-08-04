import React, { useEffect, useState } from "react";
import "../../public/css/board/postBoard.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


function GetOneBoard() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [boardStatus, setBoardStatus] = useState('');
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();

    //token
    const myToken = localStorage.getItem('myToken');

    //get param 
    const url = window.location.href;
    const queryStringBoardId = url.split('?')[1];

    //board info
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

        })
    }

    useEffect(() => {
        getBoardInfo();

    }, []);


    //board status
    const boardStatusHandler = (e) => {
        const selectedOption = e.currentTarget.value;
        setBoardStatus(selectedOption);
    };

    const options = [
        { value: "public", text: "PUBLUC" },
        { value: "private", text: "PRIVATE" },
    ];

    //modify title
    const titleHandler = (e) => {
        setTitle(e.currentTarget.value);
    }

    //modify content
    const contentHandler = (e) => {
        setContent(e.currentTarget.value);
    }

    //modify files
    const filesHandler = (e) => {
        const selectedFiles = e.currentTarget.files;
        setFiles([...selectedFiles]);

    }

    //submit
    const submitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append('file', files[i]);
            console.log("files[i] = " + files[i]);

        }
        formData.append('title', title);
        formData.append('content', content);
        formData.append('status', boardStatus);

        await axios.post(`http://localhost:4000/api/boards/updateBoard?${queryStringBoardId}`, formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data; charset=utf-8'",
                    "Authorization": "Bearer " + myToken
                }
            }
        ).then(result => {
            console.log(result.data);
            if (result.data === 'success') {
                navigate('/');
              }
        })
    }




    return (
        <div className="inputcontainer">
            <form className="form-input" onSubmit={submitHandler} >
                <input autoComplete="off" type="text" className="title" value={title} onChange={titleHandler}></input>
                <div>
                    {files.map((files, index) => (
                        <img key={index} src={`${process.env.PUBLIC_URL}/images/${files.storedName}`} alt={`Image ${index}`} />
                    ))}
                </div>
                <textarea autoComplete="off" className="content" value={content} onChange={contentHandler}></textarea>
                <input type="file" className="files" onChange={filesHandler} multiple></input>
                <select id="boardStatus" onChange={boardStatusHandler} value={boardStatus}>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}> {option.text} </option>)
                    )}
                </select>
                <button className="postbtn" type="submit"> POST IT</button>
            </form>
        </div>
    );
}

export default GetOneBoard