import styles from "./RoleContextMenu.module.css"
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { useAppDispatch } from "redux/hooks"
import changeRole from "redux/reducers/adminReducer/Actions/changeRole"
import getAllUsers from "redux/reducers/adminReducer/Actions/getAllUsers"

interface RoleContextMenu {
    nombre: string,
    id: string,
    x: number,
    y: number,
    setRoleView: Dispatch<SetStateAction<boolean>>,
}

export default function RoleContextMenu({nombre, id, x, y, setRoleView}: RoleContextMenu) {
const dispatch = useAppDispatch()
const divRef = useRef() as React.MutableRefObject<HTMLInputElement>
const ulRef = useRef() as any
const textRef = useRef() as any
  useEffect(()=>{
    const handleRoleView = (e: any) => {
      if (e.path[0] !== divRef.current && e.path[0] !== ulRef.current && e.path[0] !== textRef.current) setRoleView(false)
    }
    window.addEventListener("click", handleRoleView)
    return () =>{
      window.removeEventListener("click", handleRoleView)
    }
  },[])

  function changeUserRole (value: string) {
    dispatch(changeRole({value, id}))
    .then(() => dispatch(getAllUsers()))
  } 

  return (
    <div ref={divRef} className={styles.wrapper} style={{top: y, left: x}}>
      <ul ref={textRef}>
        <h3 ref={ulRef} style={{cursor: "default"}}>Role {nombre}</h3>
        <li onClick={()=> changeUserRole("user")}>User</li>
        <li onClick={()=> changeUserRole("admin")}>Admin</li>
      </ul>
    </div>
  )
}
