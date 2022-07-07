import React, { useState } from "react";
import { useAppSelector } from "redux/hooks";

export default function SearchBar(){
  const usuario = useAppSelector((state) => state.user.usuario)

   const [input, setInput] = useState("")

   const [filtrado, setFiltrado] = useState<any>([])

   const date = `${new Date().getFullYear()}-${String(new Date().getMonth()).length < 2 ? "0" + String(new Date().getMonth() + 1) : String(new Date().getMonth())}`

   const extraDate = usuario?.extra.output.find((e: any) => e.date === date)

   const monthly = usuario?.monthly

   function inputChange(e: any) {
    setInput(e.target.value);
  }
  
  function handleClick(e: React.SyntheticEvent){
    e.preventDefault()
  let inputaux = input.toLowerCase().trim()
  let busqueda = [...extraDate.entries, ...monthly.output].filter((e) => e.description.toLowerCase().includes(inputaux))

  //   let busquedaExtra =  extraDate.entries?.filter((e: any) => (e.description.toLowerCase().includes(input.toLowerCase().trim())) )

  //   let busquedaMensual = monthly.output.filter((e: any) => (e.description.toLowerCase().includes(input.toLowerCase().trim())))

  //   let concatenado = busquedaExtra.concat(busquedaMensual)

  setFiltrado(busqueda)
  // setFiltrado(concatenado)
  }

  
return(
    <div>
     <input 
        style={{width: "90%"}}
        type="text"
        placeholder="Busca gastos por su descripción!.."
        onChange={(e) => inputChange(e)}
      />
      <button
      onClick={(e) => handleClick(e)}
        type="submit"
      >
        Buscar
      </button>
      <div>
      {filtrado.length ?
      filtrado.map((e: any) => (
        <div>
          <span>{e.date.split("T")[0]}</span>
          <br/>
          <span>{e.category}</span>
          <br/>
          <span>{e.description}</span>
          <br/>
          <span>${e.amount}</span>
        </div>
      ))
    : <span>¡Acá salen tus gastos buscados!</span>
    }
      </div>
    </div>
)
}