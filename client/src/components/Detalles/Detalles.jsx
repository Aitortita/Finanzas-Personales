import React, { useState } from "react";
import Nav from "components/Nav/Nav";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import styles from "./Detalles.module.css";
import { useAppSelector } from "redux/hooks";

// ICONOS
import carrito from "../multimedia/cart.png";
import viaje from "../multimedia/travel.png";
import salud from "../multimedia/medic.png";
import combustible from "../multimedia/car.png";
import ocio from "../multimedia/ocio.png";
import lock from "../multimedia/lock.png"

//CONTROLADORES
import {totalAlimentos,
  totalCombustible,
  totalOcio,
  totalSalud,
  totalViajes,
  
} from "./Controladores"

export default function Detalles() {
  const usuario = useAppSelector((state) => state.user.usuario);

  const [input,setInput] = useState("")

  const styleBar = {
    border: "2px solid white",
    borderRadius: "10px",
    overflow: "hidden",
    display: "flex",
  };
  function calculate() {
    const ingresos = usuario?.Account.extraInput.reduce((prev, actual) => {
      console.log(prev, actual);
      return prev + actual.amount;
    }, 0);
    const gastos = usuario?.Account.variableExpenses.reduce((prev, actual) => {
      return prev + actual.amount;
    }, 0);
    const total = gastos + ingresos;
    const porcentajeGastos = Math.round((gastos * 100) / total);
    const porcentajeIngreso = 100 - porcentajeGastos;
    return { porcentajeGastos, porcentajeIngreso };
  }

  const incomes = {
    background: "green",
    width: calculate().porcentajeIngreso + "%",
    height: "100px",
  };

  const gastos = {
    background: "red",
    width: calculate().porcentajeGastos + "%",
    height: "100px",
  };

  const data1 = () => {
    const gastos = usuario.Account.variableExpenses.reduce((prev, actual) => {
      return prev + actual.amount;
    }, 0);
    console.log(gastos)
    let data1 = usuario?.Account.variableExpenses.reduce((c, v) => {
      c[v.category] = (c[v.category] || 0) + v.amount;
      return c;
    }, {});
    const data = [];
    for (const key in data1) {
      data.push({
        name: key,
        value: Math.round((data1[key] * 100)/gastos) ,
        unit:"%"
      })
    }
    return data;
  }
  const labelFormatter = ({value})=>{
    return value + "%"
  }
  console.log(usuario.Account ? data1() : null);

  const colors = ["#e27b7b", "#cfc4c4", "#96db99", "#92b0c4", "#d4ca8e"];
  return (
    <div>
      <Nav />
      <div className={styles.detalles_wrapper}>
        <h1>Detalles</h1>
        <div>
          <div>
            <select name="" id="">
              <option value="">Anual</option>
              <option value="">Mensual</option>
              <option value="">Diario</option>
            </select>
          </div>
          <div>
            <div style={{ display: "flex" }}>
              <h5>Ingresos</h5>
              <h5 style={{ marginLeft: "200px" }}>gastos</h5>
            </div>
            <div style={styleBar}>
              <div style={incomes}>{calculate().porcentajeIngreso} %</div>
              <div style={gastos}>{calculate().porcentajeGastos} %</div>
            </div>
          </div>
          <div className={styles.seccion_wrapper}>
            
              <div className={styles.primer_wrapper}>
                <PieChart width={400} height={400} >
                  <Pie
                    data={data1()}
                    dataKey="value"
                    nameKey={"name"}
                    cx="50%"
                    cy="50%"
                    outerRadius={150}                  
                    label={labelFormatter}
                  >
                    {data1().map((entry, index) => {
                      return <Cell key={`cell-${index}`} fill={colors[index]}  />;
                    })}
                  </Pie>
                  <Tooltip  />
                  <Legend />
                  
                </PieChart>
              </div>
            
            <div>
              <input type="text" />                                  
              <div>
                
              </div>
            </div>
            <div className={styles.totales}>
              <img src={carrito} alt="LOL" />{" "}
              <span> Gastos de Alimentos totales = ${totalAlimentos(usuario)} </span>
              <img src={viaje} alt="LOL" />{" "}
              <span> Gastos de Viajes totales = ${totalViajes(usuario)} </span>
              <img src={salud} alt="LOL" />{" "}
              <span> Gastos de Salud totales = ${totalSalud(usuario)} </span>
              <img src={combustible} alt="LOL" />{" "}
              <span>Gastos de Combustible totales = ${totalCombustible(usuario)}</span>
              <img src={ocio} alt="LOL" />{" "}
              <span>Gastos en Ocio totales = ${totalOcio(usuario)}</span>
            </div>
            <div className={styles.blocked_wrapper}>
              <div className={styles.blocked}>
                <img src={lock} alt="" />
                <span>Compra premium para mas detalles</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

