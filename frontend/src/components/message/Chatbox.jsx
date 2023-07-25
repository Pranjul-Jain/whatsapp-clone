import React,{useEffect,useRef} from 'react'

const Chatbox = ({
  chatboxRef,
  emojiState, 
  setEmojiState,
  chatsocket,
  ...props}
) => {
  useEffect(()=>{
    chatsocket.onmessage = (textdata)=>{
      textdata = JSON.parse(textdata.data)

      props.setMessages(prevState=>[
        ...prevState,
        {"user_id":textdata.sender_id,"message":textdata.message,"message_timestamp":textdata.message_timestamp}
      ])
      document.querySelector("#"+props['aria-label']+" .message").innerText = textdata.message.length>45 
      ?textdata.message.replace("\n"," ").substring(0,45)+"...":textdata.message
      
      const date = new Date(textdata.message_timestamp);
      document.querySelector("#"+props['aria-label']+" .time").innerText = date.getHours()+":"+date.getMinutes()
    }

    chatsocket.onclose = (event)=>{
      alert("this user connection has been closed unexpectedly")
    }
  },[chatsocket])

  const chatheight = useRef(0.25);

  useEffect(()=>{
    emojiState==="open"
    ?document.querySelector("#chatbox-smiley").style.color="rgb(32, 153, 113)"
    :document.querySelector("#chatbox-smiley").style.color="rgba(155, 152, 152, 0.685)"

    const messageSection = document.querySelector(".messages-section"+(props.className?"."+props.className:props.className))
    const gridrowsvalue =  emojiState==="close"?`0.25fr 2fr ${chatheight.current}fr`:`0.25fr 0.8fr 1.2fr ${chatheight.current}fr`

    if(messageSection){
     messageSection.style.gridTemplateRows = gridrowsvalue
    }

  },[emojiState])


  const newLine = useRef(0);
  return (
    <div className="chatbox">
        {emojiState==="open"?<i className="fa-solid fa-xmark" onClick={()=>setEmojiState("close")}></i>:""}
        <i className="fa-solid fa-face-grin-wide" id="chatbox-smiley" onClick={()=>{emojiState==="close"?setEmojiState("open"):null}}></i>
        <i className="fa-sharp fa-solid fa-paperclip"></i>
        <textarea ref={chatboxRef} autoComplete="off" className="chatbox-input" name="message" type="text" placeholder='Type a message' onKeyDown={handleKey} />
        <i className="fa-solid fa-microphone"></i>
    </div>
  )

  function sendMessage(message){
    if(String(message).trim()){
      chatsocket.send(JSON.stringify({
        "message":message.trim(),
        "sender_id":props.user_id
      }))
      newLine.current = 0;
      chatheight.current = 0.25;
      const gridrowsvalue =  emojiState==="close"?`0.25fr 2fr ${chatheight.current}fr`:`0.25fr 0.8fr 1.2fr ${chatheight.current}fr`
      document.querySelector(".messages-section.d-grid").style.gridTemplateRows = gridrowsvalue
    }
  }

  function handleKey(event){
    if(event.keyCode === 13 && !event.shiftKey){
      sendMessage(event.target.value)
      event.target.value = "";
    }
    else if(event.keyCode === 13 && event.shiftKey){
       newLine.current += 1
       if(newLine.current <= 4){
        chatheight.current += 0.1
        const gridrowsvalue =  emojiState==="close"?`0.25fr 2fr ${chatheight.current}fr`:`0.25fr 0.8fr 1.2fr ${chatheight.current}fr`
        document.querySelector(".messages-section.d-grid").style.gridTemplateRows = gridrowsvalue
       }
    }else if(event.keyCode === 8 && newLine.current>=1 && event.target.value.at(-1)==='\n'){
      if(newLine.current <=4){
        chatheight.current -= 0.1
        newLine.current -= 1
        const gridrowsvalue =  emojiState==="close"?`0.25fr 2fr ${chatheight.current}fr`:`0.25fr 0.8fr 1.2fr ${chatheight.current}fr`
        document.querySelector(".messages-section.d-grid").style.gridTemplateRows = gridrowsvalue
      }else{
        newLine.current -= 1
      }
    } 
  }
}

export default Chatbox;