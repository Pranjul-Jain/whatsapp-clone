import React, { useState,useRef } from 'react'
import axios from "axios";

axios.defaults.withCredentials = true;

const MessageDisplay = ({group,messages,user_id}) => {
  let currentDate = null;
  const usersName = useRef({});
  return (
    <div className="message-display" id={"message-display - "+new Date().getTime()}>
        { messages.length >= 1 && 
          messages.map(
            (_,index)=>{
            const date = new Date(messages.at(-(index+1)).message_timestamp);
            if(group && user_id!==messages.at(-(index+1)).user_id &&!usersName.current[messages.at(-(index+1)).user_id]){

              getReceiverName(messages.at(-(index+1)).user_id,index);
            }
          
            const name = usersName.current[messages.at(-(index+1)).user_id];

            if(currentDate == null){
              currentDate = date;
            }
            else if(currentDate.toLocaleDateString() != date.toLocaleDateString()){
              const tempdate = currentDate.toLocaleDateString();
              currentDate = date;
              
              return (<>
                <div key={"date-"+index} className="message-timestamp" >{tempdate===new Date().toLocaleDateString()?"TODAY":tempdate}</div>
                <pre user_id={messages.at(-(index+1)).user_id} className={"user-message"+ (user_id===messages.at(-(index+1)).user_id?" self":"")} key={"pre"+index+1}>{group?<span id={"user-name-"+index}>{(user_id===messages.at(-(index+1)).user_id)?"You":name}</span>:null} <pre className="j-fs" style={group?{paddingRight:"2.5em"}:{}}>{messages.at(-(index+1)).message}</pre>{group?<span className="user-time">{date.getHours()+":"+date.getMinutes()}</span>:null}</pre>
              </>)
            }else if(index == messages.length-1){
              return (<>
                <pre user_id={messages.at(-(index+1)).user_id} className={"user-message"+ (user_id===messages.at(-(index+1)).user_id?" self":"")} key={"pre"+index+1}>{group?<span id={"user-name-"+index}>{(user_id===messages.at(-(index+1)).user_id)?"You":name}</span>:null} <pre className="j-fs" style={group?{paddingRight:"2.5em"}:{}}>{messages.at(-(index+1)).message}</pre>{group?<span className="user-time">{date.getHours()+":"+date.getMinutes()}</span>:null}</pre>
                <div key={"date-"+index} className="message-timestamp">{currentDate.toLocaleDateString()===new Date().toLocaleDateString()?"TODAY":currentDate.toLocaleDateString()}</div>
              </>)
            }
            
            return (<pre user_id={messages.at(-(index+1)).user_id} className={"user-message"+ (user_id===messages.at(-(index+1)).user_id?" self":"")} key={"pre"+index+1}>{group?<span id={"user-name-"+index}>{(user_id===messages.at(-(index+1)).user_id)?"You":name}</span>:null} <pre className="j-fs" style={group?{paddingRight:"2.5em"}:{}}>{messages.at(-(index+1)).message}</pre>{group?<span className="user-time">{date.getHours()+":"+date.getMinutes()}</span>:null}</pre>)

        })}
    </div>
  )

  function getReceiverName(receiver_id,key){

      axios.get(import.meta.env.VITE_SERVER_URL + "/getreceivername/",{
        params : {
          "receiver_id":receiver_id,
          "user_id":user_id,
        },
        headers : {
          "Content-Type":"text/json",
        }
      }).then(res=>res.data).then(res=>{
        if(res.username){
          usersName.current[receiver_id] = res.username;
          document.querySelector(`#user-name-${key}`).innerHTML = res.username;
        }
      })
  }
}

export default MessageDisplay