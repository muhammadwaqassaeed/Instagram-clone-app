import React, { useState, useEffect, useRef } from 'react'


export default function ProfilePic({ changeprofile }) {
    const hiddenFileInput = useRef(null)
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")

    const handleClick = () => {
        hiddenFileInput.current.click()

    }

    // posting image to cloudinary 

    const postDetails = () => {
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

    useEffect(()=>{
        if(image){
            postDetails()
        }
    },[image])

    const postPic = ()=>{

        
            fetch("http://localhost:5001/uploadprofilepic", {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({

                    pic: url
                })
            }).then(res => res.json())
                .then(data => {
                    console.log(data)
                    changeprofile();
                    window.location.reload();
                    // if (data.error) {
                    //     notifyA(data.error)
                    // } else {
                    //     notifyB("Successfully Posted")
                    //     navigate("/")
                    // }
                })
                .catch(err => console.log(err))
        
    }

    useEffect(()=>{
        if(url){
            postPic();
        }
    },[url])


    return (
        <div className='profilePic'>

            <div className="confirmation-popup active">
                <p>Change profile photo</p>
                <div style={{ borderTop: '1px solid #00000030' }}>
                    <button className='uploadBtn' style={{ color: "#1EA1F7" }}
                        onClick={handleClick}
                    >upload photo</button>
                    <input type='file' accept='image' style={{ display: 'none' }} ref={hiddenFileInput}
                        onChange={(e) => { setImage(e.target.files[0]) }}
                    />
                </div>

                <div style={{ borderTop: '1px solid #00000030' }}>
                    <button className='uploadBtn' style={{ color: "#ED4956" }}
                    onClick={()=>{
                        setUrl(null);
                        postPic();
                    }}
                    >Remove Current Photo</button>
                </div>
                <div style={{ borderTop: '1px solid #00000030' }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "15px" }}
                        onClick={changeprofile}
                    >Cancel</button>


                </div>
            </div>

            <div className="confirmation-overlay"></div>

        </div>
    )
}
