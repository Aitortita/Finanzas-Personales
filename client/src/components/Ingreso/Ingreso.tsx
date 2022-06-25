import React from 'react';
import Nav from "../Nav/Nav";
import ConDatos from "./ConDatos";
import SinDatos from './SinDatos';

import { useAppSelector } from "../../redux/hooks";

export default function Ingreso() {
  const { todosLosUsuarios } = useAppSelector( state => state.userReducer); 

  return (
    <div>
      <Nav/>
      {todosLosUsuarios ? <SinDatos/> : <ConDatos/>}  
    </div>
  )
  }