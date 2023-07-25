import React from 'react'

const MessageDisplay = ({group,messages,user_id}) => {
  let currentDate = null;
  return (
    <div className="message-display" key={"message-display - "+new Date().getTime()}>
        { messages.length >= 1 && 
          messages.map(
            (_,index)=>{
            const date = new Date(messages.at(-(index+1)).message_timestamp);
            if(currentDate == null){
              currentDate = date;
            }
            else if(currentDate.toLocaleDateString() != date.toLocaleDateString()){
              const tempdate = currentDate.toLocaleDateString();
              currentDate = date;
              
              return (<>
                <div key={"date-"+index} className="message-timestamp" >{tempdate===new Date().toLocaleDateString()?"TODAY":tempdate}</div>
                <pre user_id={messages.at(-(index+1)).user_id} className={"user-message"+ (user_id===messages.at(-(index+1)).user_id?" self":"")} key={"pre"+index+1}>{group?<span>{(user_id===messages.at(-(index+1)).user_id)?"You":user_id}</span>:null} <pre className="j-fs" style={group?{paddingRight:"2.5em"}:{}}>{messages.at(-(index+1)).message}</pre>{group?<span className="user-time">{date.getHours()+":"+date.getMinutes()}</span>:null}</pre>
              </>)
            }else if(index == messages.length-1){
              return (<>
                <pre user_id={messages.at(-(index+1)).user_id} className={"user-message"+ (user_id===messages.at(-(index+1)).user_id?" self":"")} key={"pre"+index+1}>{group?<span>{(user_id===messages.at(-(index+1)).user_id)?"You":user_id}</span>:null} <pre className="j-fs" style={group?{paddingRight:"2.5em"}:{}}>{messages.at(-(index+1)).message}</pre>{group?<span className="user-time">{date.getHours()+":"+date.getMinutes()}</span>:null}</pre>
                <div key={"date-"+index} className="message-timestamp">{currentDate.toLocaleDateString()===new Date().toLocaleDateString()?"TODAY":currentDate.toLocaleDateString()}</div>
              </>)
            }
            
            return (<pre user_id={messages.at(-(index+1)).user_id} className={"user-message"+ (user_id===messages.at(-(index+1)).user_id?" self":"")} key={"pre"+index+1}>{group?<span>{(user_id===messages.at(-(index+1)).user_id)?"You":user_id}</span>:null} <pre className="j-fs" style={group?{paddingRight:"2.5em"}:{}}>{messages.at(-(index+1)).message}</pre>{group?<span className="user-time">{date.getHours()+":"+date.getMinutes()}</span>:null}</pre>)

        })}
    </div>
  )
}

export default MessageDisplay