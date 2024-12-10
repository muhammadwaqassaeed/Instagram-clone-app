import React, { useEffect, useState } from 'react'
import "../css/Home.css";
import { useNavigate } from 'react-router-dom';
import { Link} from 'react-router-dom';

// import axios from 'axios';
// import { post } from '../../../insta-clone-backend/routes/createPost';


export default function Home() {
  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
  const navigate = useNavigate()
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false)
  const [item, setItem] = useState([])
  const [isLiked, setIsLiked] = useState(false);

// show and hide comments 

  const toggleComment = (posts)=>{
    if(show){
      setShow(false);
    }else{
      setShow(true);
      setItem(posts);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("./signup")
    }
    // featching all data 
    fetch("http://localhost:5001/allposts", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
    }).then(res => res.json())
      .then(result =>{
        console.log(result)
        setData(result)
      } )
      .catch(err => console.log(err))
  }, []);


  const makeComment = (text, postId) => {
    fetch("http://localhost:5001/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
      },
      body: JSON.stringify({ text, postId }),
    })
      .then(res => res.json())
      .then(result => {
        console.log(result);
        const newData = data.map(posts => (posts._id === result._id ? result : posts));
        setData(newData);
        // setComment("");
        document.getElementById("commentInput").value = "";
      })
      .catch(err => {
        console.log(err);
      });
  };
  const likePost = (id) => {
    // const url = `http://localhost:5000/like`;
    // console.log('Requesting URL:', url);
  
    fetch("http://localhost:5001/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId: id
      }),
    }).then(res => res.json())
      // .then(res => {
      //   if (!res.ok) {
      //     throw new Error(`Server returned ${res.status} ${res.statusText}`);
      //   }
      //   return res.json();
      // })
      .then(result => {
       
        console.log(result);
        const newData = data.map(posts => (posts._id == result._id ? result : posts));
        setData(newData);
        // window.location.reload();
      })
      .catch(err => {
        console.error("Error during likePost:", err);
      });
};

  useEffect(()=>{
    likePost()
  },[])
  const unlikePost = (id) => {
    fetch("http://localhost:5001/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId: id
      }),
    }).then(res => res.json())
      // .then(res => {
      //   if (!res.ok) {
      //     throw new Error(`HTTP error! Status: ${res.status}`);
      //   }
      //   return res.json();
      // })
      .then(result => {
        console.log(result);
        const newData = data.map(posts => (posts._id == result._id ? result : posts));
        setData(newData);
      })
      .catch(err => {
        console.error("Error during unlikePost:", err);
      });
  };
  
  

  return (
    <div className='home'>
      {data.map((posts) => {
        return (
          <div key={posts._id} className='card'>
            {/* card header  */}
            <div className='card-header'>
              <div className='card-pic'>
                <img src={posts.postedBy.Photo? posts.postedBy.Photo:picLink} alt='' />
              </div>
              <Link to={`/profile/${posts.postedBy._id}`} style={{ textDecoration: 'none' }}>
              <h5 style={{marginLeft:'10px', marginTop:'10px', color: 'black', transition: 'color 0.3s'}}>{posts.postedBy.name}</h5>
              </Link>
            </div>
            {/* card image  */}
            <div className='card-image'>
              <img src={posts.photo} alt='' />
            </div>
            {/* card content  */}
            <div className='card-content'>
           
            <p>{posts.caption}</p>

            {
              posts.likes.includes(JSON.parse(localStorage.getItem("user"))._id)?
              (
                <span className="material-symbols-outlined material-symbols-outlined-red" onClick={()=>{unlikePost(posts._id)}}>favorite</span>

              ):(
                <span className="material-symbols-outlined" onClick={()=>{likePost(posts._id)}}>favorite</span>

              )
            }
              <p>{posts.likes.length} Like</p>
              <p>{posts.body}</p>
              <p style={{fontWeight:'bold', cursor:'pointer'}} onClick={()=>{toggleComment(posts)}}>View all comments</p>
            </div>
            {/* {
                posts.comments.map(comment=>{
                  return(
                    <h6 key={comment._id}><span>{comment.postedBy.name} </span>{comment.text}</h6>
                  )
                })
              } */}

            
            <div className='add-comment'>
              <span className="material-symbols-outlined">mood
              </span>
             
              <form onSubmit={(e)=>{
                e.preventDefault()
                makeComment(e.target[0].value,posts._id);
                e.target.reset();
              }}>
                <input type="text" id='commentInput' placeholder='add comments...' />
                <button className='comment' type="submit">Post</button>

              </form>

            </div>
          </div>
        )
      })}

      {/* show comment  */}
        { show && (
      <div className='showComment'>
        <div className='container'>
          <div className='postPic'>
            <img src={item.photo} alt=''/>
          </div>
          <div className='details'>
          <div className='card-header' style={{borderBottom:"1px solid #00000029"}}>
              <div className='card-pic'>
                <img src='/waqas image.jpeg' alt='' />
              </div>
              <h5>{item.postedBy.name}</h5>
            </div>
            {/* comment section  */}
            <div className='comment-sction' style={{borderBottom:"1px solid #00000029"}}>

                {
                item.comments.map(comment=>{
                  return(
                    // <h6 key={comment._id}>
                    <p className='comm' key={comment._id}>
                      
                <img src='/waqas image.jpeg' alt='' />
                      <span style={{fontWeight:'bold'}}> {comment.postedBy.name} </span>
                      {comment.text}
                      </p>

                      // </h6>
                  )
                })
              }
            </div>

            <div className='card-content'>
              <p>{item.likes.length} Likes</p>
              <p>{item.body}</p>
            </div>
            
            <div className='add-comment'>
              <span className="material-symbols-outlined">mood
              </span>

              <form onSubmit={(e)=>{
                e.preventDefault()
                makeComment(e.target[0].value,item._id);
                toggleComment();
                e.target.reset();
              }}>
                <input type="text" id='commentInput' placeholder='add comments...' />
                <button className='comment' type="submit">Post</button>

              </form>
              
            </div>

          </div>
        </div>
        <div className='close-comment'>
        <span className="material-symbols-outlined material-symbols-outlined-comment" onClick={()=>{toggleComment()}}>close
        </span>
        </div>
      </div>
        )}
    </div>
  )
}
