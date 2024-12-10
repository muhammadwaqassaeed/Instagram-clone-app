import React, { useState, useEffect } from 'react'
import "../css/Profile.css";
// import PostDetails from './PostDetails';
import { useParams } from 'react-router-dom';

export default function UserProfile() {
    var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
    const {userid} = useParams()
    console.log(userid);
  const [isFollow, setIsFollow]= useState(false)
  const [user, setUser] = useState("")
  const [posts, setPosts]=useState([])


//   useEffect(() => {
//     fetch(`/user/${userid}`, {
//       headers: {
//         "Authorization": "Bearer " + localStorage.getItem("jwt")
//       }
//     })
//       .then(res => res.json())
//       .then((result) => {
//         setUser(result.user)
//         setPosts(result.post)
//       })

//   }, [userid]);


useEffect(() => {
    fetch(`http://localhost:5001/user/${userid}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then(result => {
        console.log('User:', user);
console.log('Posts:', posts);
      setUser(result.user);
      setPosts(result.posts);
      if(result.user.followers.includes(JSON.parse(localStorage.getItem("user"))._id)){
        setIsFollow(true)
      }

    })
    .catch(err => {
        console.log(err);
      });
  }, [isFollow]);

  // follow btn
  const followUser =(userId)=>{
    fetch("http://localhost:5001/follow",{
        method:"put",
        headers: {
            "Content-Type":"application/json",
            "Authorization": "Bearer " + localStorage.getItem("jwt")
          },
          body:JSON.stringify({
            followId:userId
          })
    }).then((res)=>res.json())
    .then((data)=>{
        console.log(data);
        setIsFollow(true)

    })
  }
  
  const unfollowUser =(userId)=>{
    fetch("http://localhost:5001/unfollow",{
        method:"put",
        headers: {
            "Content-Type":"application/json",
            "Authorization": "Bearer " + localStorage.getItem("jwt")
          },
          body:JSON.stringify({
            followId:userId
          })
    }).then((res)=>{res.json()})
    .then((data)=>{
        console.log(data);
        setIsFollow(false)

    })
  }
  
  return (
    <div className='profile'>

      {/* profile frame */}
      <div className='profile-frame'>
        {/* profile pic */}
        <div className='profile-pic'>
          <img src={user.Photo? user.Photo:picLink} alt='' />
        </div>
        {/* profile data  */}
        <div className='profile-data'>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
             <h1>{ user.name}</h1>   
             <button className='followBtn'
             onClick={()=>{
                if(isFollow){
                    unfollowUser(user._id)
                }else{
                    followUser(user._id)
                }
                
            }}
             >
                {isFollow ? "Unfollow" : "Follow"}
                </button>
            </div>
        
          <div className='profile-info' style={{ display: "flex" }}>
           <p>{posts.length} posts</p>

            <p>{user.followers ? user.followers.length:"0"} followers</p>
            <p>{user.following ? user.following.length:"0"} following</p>
          </div>
        </div>
      </div>
      <hr style={{ width: "90%", margin: "25px auto", opacity: "0.8", }} />
      {/* gellery */}
      <div className='gallery'>
        {posts.map((pics) => {
          return <img key={pics._id} src={pics.photo}
        //    onClick={()=>{toggleDetails(pics)}}
           className='item' />
        })}

      </div>
      {/* {show &&
      <PostDetails item={posts} toggleDetails={toggleDetails}/>

      } */}
    </div>
  )
}
