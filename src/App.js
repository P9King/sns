
import React, { useEffect, useState } from "react";
import "./public/css/board/postBoard.css";
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
    <div>
      <h1>Bulletin Board</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <p>Author: {post.users.email}</p>
          <p>Date: {new Date(post.date).toLocaleDateString()}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;