import React from 'react'
import { RiCloseLine} from "react-icons/ri"
import "../css/Modal.css";


export default function Modal() {
  return (
    <div className='darkBg'>
        <div className='centered '>
        <div className='modal'>
        <div className='modalHeader'>
            <h5 className='heading'>Confirm</h5>
        </div>
        <button className='closebtn'>
            <RiCloseLine></RiCloseLine>
        </button>
        {/* modal content  */}
        <div className='modalContent'>
            Are you really want vto log out?
        </div>
        {/* modal action  */}

        <div className='modalAction'>
            <div className='actionContainer'>
                <button className='logoutBtn'>Logout</button>
                <button className='cencleBtn'>Cencle</button>

            </div>
        </div>
    </div>
        </div>
    </div>
   
  )
}
