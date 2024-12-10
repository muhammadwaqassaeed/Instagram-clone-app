import React, { useState, useEffect } from 'react'
import "../css/Profile.css";
import PostDetails from '../components/PostDetails';
import ProfilePic from '../components/ProfilePic';

export default function Profile() {
  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"

  const [pic, setPic] = useState([])
  const [show, setShow]=useState(false)
  const [posts, setPost]=useState([])
  const [changePic, setChangePic] = useState(false)
  const [user, setUser] = useState("")


  const toggleDetails = (posts)=>{
    if(show){
      setShow(false);
    }else{
      setShow(true);
      setPost(posts);
    }
  }

  useEffect(() => {
    fetch(`http://localhost:5001/user/${JSON.parse(localStorage.getItem("user"))._id}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
      .then(res => res.json())
      .then((result) => {
        console.log(result)
        setPic(result.posts);
        setUser(result.user)
      })

  }, []);

  const changeprofile = ()=>{
    if(changePic){
      setChangePic(false)
    }else{
      setChangePic(true)

    }
  }

  return (
    <div className='profile'>

      {/* profile frame */}
      <div className='profile-frame'>
        {/* profile pic */}
        <div className='profile-pic'>
          <img 
          onClick={()=>{changeprofile()}}
          src={user.Photo? user.Photo:picLink} alt='' />
        </div>
        {/* profile data  */}
        <div className='profile-data'>
          <h1>{JSON.parse(localStorage.getItem("user")).name}</h1>
          <div className='profile-info' style={{ display: "flex" }}>
          <p>{pic.length} posts</p>

            <p>{user.followers ? user.followers.length:"0"} followers</p>
            <p>{user.following ? user.following.length:"0"} following</p>
          </div>
        </div>
      </div>
      <hr style={{ width: "90%", margin: "25px auto", opacity: "0.8", }} />
      {/* gellery */}
      <div className='gallery'>
        {pic.map((pics) => {
          return <img key={pics._id} src={pics.photo} onClick={()=>{toggleDetails(pics)}} className='item' />
        })}

      </div>
      {show &&
      <PostDetails item={posts} toggleDetails={toggleDetails}/>

      }
      {changePic &&
      <ProfilePic changeprofile={changeprofile}/>

      }
    </div>
  )
}
