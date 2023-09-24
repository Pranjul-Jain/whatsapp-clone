import React from 'react'

const Input = (props) => {
  return (
    <div className={props.className}>
        <input className={props.inputClassName} type={props.type} name={props.name} id={props.id} placeholder={props.placeholder} required={props.required} />
        <div className={props.errorMessage} ref={props.errorref}></div>
    </div>
  )
}

export default Input