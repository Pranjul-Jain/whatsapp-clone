import React from 'react'
import axios from "axios"

axios.defaults.withCredentials = true

const AddMemberForm = ({
    user_id,
    getUsers
}) => {
  return (
    <div className="add-member-section">
        <h1 className="heading">Add Member <button onClick={()=>document.querySelector(".add-member-section").style.left="-100%"}>X</button></h1>
        <hr />
        <form className="add-member-form" onSubmit={addMember}>
            <div className="form-control">
                <label>User Number</label>
                <input type="text" name="number" placeholder='Enter user number' />
            </div>
            <div className="form-control">
                <label>User Name</label>
                <input type="text" name="name" placeholder='Enter user name' />
            </div>
            <button type="submit" className="btn-submit mr-right">Submit</button>
        </form>
    </div>
  )

  async function addMember(event){
    event.preventDefault();
    const formdata = new FormData();
    formdata.append("number",event.target.number.value)
    formdata.append("name",event.target.name.value)
    formdata.append("user_id",user_id.current)

    const response = await axios.post(import.meta.env.VITE_SERVER_URL + "/addmember",formdata,{
        headers:{
            "content-type":"application/json",
        },
        withCredentials:true
    }).then(res=>res).catch(err=>console.log(err))

    if(response){
       const data = await response.data;
       if(data.message === "user added"){
            event.target.number.value = ""
            event.target.name.value = ""
            document.querySelector(".add-member-section").style.left="-100%";
            getUsers(user_id.current)
        }
    }
  }
}

export default AddMemberForm