import React, { useState, useEffect } from 'react'
import "../css/Createpost.css";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


export default function Createpost() {
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");
    const navigate = useNavigate()

    // Toast function
    const notifyA = (msg) => toast.error(msg)
    const notifyB = (msg) => toast.success(msg)

    useEffect(() => {
        // saving post mongodb
        if (url) {
            fetch("http://localhost:5001/createPost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    body,
                    pic: url
                })
            }).then(res => res.json())
                .then(data => {
                    if (data.error) {
                        notifyA(data.error)
                    } else {
                        notifyB("Successfully Posted")
                        navigate("/")
                    }
                })
                .catch(err => console.log(err))
        }


    }, [url])
    // posting image to cloudinary 

    const postDetails = () => {
        console.log(body, image)
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "insta clone")
        data.append("cloud_name", "igcloud1")
        fetch("https://api.cloudinary.com/v1_1/igcloud1/image/upload", {
            method: "post",
            body: data
        }).then(res => res.json())
            .then(data => setUrl(data.url))
            .catch(err => console.log(err))



    }


    const loadfile = (event) => {
        var output = document.getElementById("output");
        output.src = URL.createObjectURL(event.target.files[0]);
        output.onload = function () {
            URL.revokeObjectURL(output.src) // free memory
        };
    }
    return (
        <div className='createpost'>
            {/* header  */}
            <div className='post-header'>
                <h4 style={{ margin: "3px auto" }}>Create New Post</h4>
                <button id='post-btn' onClick={() => { postDetails() }}>Share</button>
            </div>
            {/* Image preview  */}
            <div className='main-div'>
                <img id='output' src='https://cdn.icon-icons.com/icons2/510/PNG/512/image_icon-icons.com_50366.png' />
                <input type='file' accept='image/' onChange={(event) => {
                    loadfile(event);
                    setImage(event.target.files[0])
                }} />
            </div>
            {/* details  */}
            <div className='details'>
                <div className='card-header'>
                    <div className='card-pic'>
                        <img src='/waqas image.jpeg' alt='' />
                    </div>
                    <h5>Waqas</h5>
                </div>
                <textarea type="text" value={body} onChange={(e) => {
                    setBody(e.target.value)
                }} placeholder='write a caption.....'></textarea>
            </div>
        </div>
    )
}
