import React,{useEffect,useRef} from 'react'

const UserSearchbar = () => {
  const isRendered = useRef(0)

  useEffect(()=>{
    const magnifyingGlass = document.querySelector(".user-searchbar .fa-solid")
    
    const toggleIcon = ()=>{
      magnifyingGlass.classList.toggle("fa-magnifying-glass")
      magnifyingGlass.classList.toggle("fa-arrow-up")
    }

    if(isRendered.current == 1 && magnifyingGlass){
      document.addEventListener("focusin",toggleIcon)
      document.addEventListener("focusout",toggleIcon)
    }
    
    isRendered.current += 1

  })

  return (
    <div className="user-searchbar">
        <div>
          <input type='search' placeholder="Search or start new chat"/>
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
    </div>
  )

}

export default UserSearchbar;