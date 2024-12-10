import React from 'react'
import"../css/PostDetails.css";
import { useNavigate } from 'react-router-dom';
import  { toast} from 'react-toastify';


export default function PostDetails({item, toggleDetails}) {
    const navigate = useNavigate();
       // Toast function
  const notifyA = (msg)=> toast.error(msg)
  const notifyB = (msg)=> toast.success(msg)

    // const removePost = (postId)=>{
    //     console.log(postId);
    //     fetch(`http://localhost:5000/deletePost/${postId}`,{
    //         method:"delete",
    //         headers: {
    //             "Authorization": "Bearer " + localStorage.getItem("jwt")
    //           },
    //     } )
    //     .then(res=>res.json())
    //     .then((result)=>{
    //         console.log(result)
    //     });

    // }

    const removePost = (postId) => {
        if(window.confirm("Do you really want to delete post?")){
            fetch(`http://localhost:5001/deletePost/${postId}`, {
                method: "delete",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
            })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error(`Failed to delete post with status: ${res.status}`);
                }
            })
            .then(result => {
                console.log(result);
                toggleDetails();
                window.location.reload();
                navigate("/profile")
                notifyB(result.message);
            })
            .catch(error => {
                console.error(error);
            });

        }
       
    };
    

    return (
        <div className='showComment'>
            <div className='container'>
                <div className='postPic'>
                    <img src={item.photo} alt='' />
                </div>
                <div className='details'>
                    <div className='card-header' style={{ borderBottom: "1px solid #00000029" }}>
                        <div className='card-pic'>
                            <img src='/waqas image.jpeg' alt='' />
                        </div>
                        <h5>{item.postedBy.name}</h5>
                        <div className='deletePost' onClick={()=>{removePost(item._id)}}> 
                        <span className="material-symbols-outlined" >delete</span>
                        </div>
                    </div>
                    {/* comment section  */}
                    <div className='comment-sction' style={{ borderBottom: "1px solid #00000029" }}>

                        {
                            item.comments.map(comment => {
                                return (
                                    // <h6 key={comment._id}>
                                    <p className='comm' key={comment._id}>

                                        <img src='/waqas image.jpeg' alt='' />
                                        <span style={{ fontWeight: 'bold' }}> {comment.postedBy.name} </span>
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

                        <form onSubmit={(e) => {
                            // e.preventDefault()
                            // makeComment(e.target[0].value, item._id);
                            // toggleComment();
                            e.target.reset();
                        }}>
                            <input type="text" id='commentInput' placeholder='add comments...' />
                            <button className='comment' type="submit">Post</button>

                        </form>

                    </div>

                </div>
            </div>
            <div className='close-comment'>
                <span className="material-symbols-outlined material-symbols-outlined-comment" 
                onClick={() => { toggleDetails() }}
                >close
                </span>
            </div>
        </div>
    )
}
