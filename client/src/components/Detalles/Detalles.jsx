import React from "react";
import Nav from "components/Nav/Nav";
import styles from "./Detalles.module.css";
import { useAppSelector } from "redux/hooks";
import carrito from "../multimedia/cart.png";
import viaje from "../multimedia/travel.png";
import salud from "../multimedia/medic.png";
import combustible from "../multimedia/car.png";
import ocio from "../multimedia/ocio.png";

export default function Detalles() {
  const usuario = useAppSelector((state) => state.user.usuario);

  const styleBar = {
    border: "2px solid white",
    borderRadius: "10px",
    overflow: "hidden",
    display: "flex",
  };

  function totalViajes() {
    const extras = usuario.Account.variableExpenses.filter(
      (e) => e.category === "Viaje"
    );
    const total = extras.reduce((prev, actual) => {
      return prev + actual.amount;
    }, 0);
    return total;
  }

  function totalCombustible() {
    const extras = usuario.Account.variableExpenses.filter(
      (e) => e.category === "Combustible"
    );
    const total = extras.reduce((prev, actual) => {
      return prev + actual.amount;
    }, 0);
    return total;
  }

  function totalOcio() {
    const extras = usuario.Account.variableExpenses.filter(
      (e) => e.category === "Ocio"
    );
    const total = extras.reduce((prev, actual) => {
      return prev + actual.amount;
    }, 0);
    return total;
  }

  function totalAlimentos() {
    const extras = usuario.Account.variableExpenses.filter(
      (e) => e.category === "Alimentos"
    );
    const total = extras.reduce((prev, actual) => {
      return prev + actual.amount;
    }, 0);
    return total;
  }

  function totalSalud() {
    const extras = usuario.Account.variableExpenses.filter(
      (e) => e.category === "Salud"
    );
    const total = extras.reduce((prev, actual) => {
      return prev + actual.amount;
    }, 0);
    return total;
  }

  function calculate() {
    const ingresos = usuario.Account.extraInput.reduce((prev, actual) => {
      console.log(prev, actual);
      return prev + actual.amount;
    }, 0);
    const gastos = usuario.Account.variableExpenses.reduce((prev, actual) => {
      return prev + actual.amount;
    }, 0);
    const total = gastos + ingresos;
    const porcentajeGastos = Math.round((gastos * 100) / total);
    const porcentajeIngreso = 100 - porcentajeGastos;
    return { porcentajeGastos, porcentajeIngreso };
  }
  console.log(calculate());

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
              <div style={incomes}>{calculate().porcentajeIngreso + "%"} </div>
              <div style={gastos}>{calculate().porcentajeGastos + "%"} </div>
            </div>
          </div>
          <div className={styles.seccion_wrapper}>
            <div>1</div>
            <div>2</div>
            <div className={styles.totales}>
              <img src={carrito} alt="LOL" />{" "}
              <span> Gastos de Alimentos totales = ${totalAlimentos()} </span>
              <img src={viaje} alt="LOL" />{" "}
              <span> Gastos de Viajes totales = ${totalViajes()} </span>
              <img src={salud} alt="LOL" />{" "}
              <span> Gastos de Salud totales = ${totalSalud()} </span>
              <img src={combustible} alt="LOL" />{" "}
              <span>Gastos de Combustible totales = ${totalCombustible()}</span>
              <img src={ocio} alt="LOL" />{" "}
              <span>Gastos en Ocio totales = ${totalOcio()}</span>
            </div>
            <div>4</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// npm install @mui/icons-material

// npm i @types/mui

// npm i @types/material-ui
