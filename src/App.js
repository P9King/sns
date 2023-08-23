
import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App(props) {

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [lastBoardId, setLastBoardId] = useState(false);


  useEffect(() => {
    axios.post(`http://localhost:4000/api/boards/getLatestBoards`, {})
      .then(response => {
        console.log("the latest five boards? ", response.data);
        const lastId = response.data[response.data.length - 1];
        setPosts(response.data);
         setLastBoardId(lastId.id);
      })
  }, [])

  const loadMorePosts = () => {
    if (loading) {
      console.log("last boatd id is empty");
      return;
    }

    if (lastBoardId != false && lastBoardId >= 0) {
      console.log("last boatd id is work");
      setLoading(true);

      axios.get(`http://localhost:4000/api/boards/getAllBoards?boardId=${lastBoardId}&page=${page}`)
        .then((response) => {
          console.log(response.data);
          setPosts((prevPosts) => [...prevPosts, ...response.data]);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
          setLastBoardId(lastBoardId - 5);
        });
    }
  };

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollY + clientHeight >= scrollHeight - 1) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    loadMorePosts();
  },[page])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page]);


  return (
    <div className="container" style={{ width: '800px'}}>
      <h1>Bulletin Board</h1>
      {posts.map((post) => (
        <div key={post.id} className="boardsList">
          <a href={`/boards/getOneBoard?boardId=${post.id}`} style={{ color: 'black', textDecoration: 'none' }}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            {/* <p>Author: {post.users.email}</p> */}
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