import React, { useEffect, useState } from "react";
import "../../public/css/board/postBoard.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


function PostBoard(props) {
  const [boardStatus, setBoardStatus] = useState('');
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  //save token from server
  const myToken = localStorage.getItem('myToken');
  console.log("asdasd", myToken);

  const boardStatusHandler = (e) => {
    const selectedOption = e.currentTarget.value;
    setBoardStatus(selectedOption);
  };

  function filesHandler(e) {
    const selectedFiles = e.currentTarget.files;
    setFiles([...selectedFiles]);
  }

  const options = [
    { value: "public", text: "PUBLUC" },
    { value: "private", text: "PRIVATE" },
  ];

  function submitHandler(e) {
    e.preventDefault();

    const title = document.querySelector('.title').value;
    const content = document.querySelector('.content').value;
    const status = document.querySelector('#boardStatus').value;

    console.log("filess", files);
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);

    }
    formData.append('title', title);
    formData.append('content', content);
    formData.append('status', status);

    axios.post('http://localhost:4000/api/boards/postBoard', formData, {
      headers: {
        "Content-Type": "multipart/form-data; charset=utf-8'",
        "Authorization": "Bearer " + myToken
      },
    })
      .then((result) => {
        console.log(result.data);
        if (result.data === 'success') {
          navigate('/');
        }
      })

  }

  return (
    <div className="inputcontainer">
      <form className="form-input" onSubmit={submitHandler}>
        <input autoComplete="off" type="text" className="title" placeholder="Title"></input>
        <textarea autoComplete="off" className="content" placeholder="Write your content"></textarea>
        <input autoComplete="off" type="file" className="files" onChange={filesHandler} multiple></input>
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

export default PostBoard