
import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App(props) {

  const [posts, setPosts] = useState([]);
  useEffect(() => {
    // Fetch data from the server API endpoint
    axios.get('http://localhost:4000/api/boards/getAllboards')
      .then((response) => {
        setPosts(response.data); // Update component state with the fetched data
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);


  return (
    <div className="container" style={{ width: '800px' }}>
      <h1>Bulletin Board</h1>
      {posts.map((post) => (
        <div key={post.id} className="boardsList">
          <a href={`/boards/getOneBoard?boardId=${post.id}`} style={{ color: 'black', textDecoration: 'none' }}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <p>Author: {post.users.email}</p>
            <p>like {post.like}</p>
            <p>Date: {post.createdAt}</p>

            <hr />
          </a>
        </div>
      ))}
    </div>
  );
}

export default App;