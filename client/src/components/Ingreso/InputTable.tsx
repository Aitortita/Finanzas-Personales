import React, { useEffect, useRef, useState } from 'react';
import styles from "./Tables.module.css";
import stylesPag from "./Pagination.module.css"
import Nav from "../Nav/Nav";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { totalInput, renderInput, inputsOrderByAmount, changeOptions, filterInputByOptions, clearChangeOptions } from "redux/reducers/userReducer/userReducer";
import { addDato } from 'redux/reducers/userReducer/actions/addDato'
import { deleteDato } from 'redux/reducers/userReducer/actions/deleteDato'
import PopUp from 'components/Saves/Form/PopUp';
import CategoryCreate from 'components/Category/CategoryCreate';
import { setIn } from 'formik';
import { SelectAllSharp } from '@mui/icons-material';

export default function InputTable() {
  //---------------Date----------------
  const today = `${new Date().getFullYear()}-${((new Date().getMonth() + 1) < 10) ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)}-${(new Date().getDate() < 10) ? '0' + new Date().getDate() : new Date().getDate()}`
  const [date, setDate] = useState(`${today.split('-')[0]}-${today.split('-')[1]}`)
  //-----------------------------------

  //Selects/button
  function handleDelete(event: accountParameter) {
    dispatch(deleteDato(event))
  }

  function filterByMonth(e: any) {
    e.preventDefault();
    dispatch(changeOptions(['month', e.target.value]))
    dispatch(filterInputByOptions())
    dispatch(totalInput())
  }

  function handleOrderAmount(e: React.ChangeEvent<HTMLSelectElement>) {
    e.preventDefault();
    dispatch(inputsOrderByAmount(e.target.value))
  }

  function handleOrderByCategories(e: any) {                          //--------!!!
    e.preventDefault();
    dispatch(changeOptions(['category', e.target.value]))
    dispatch(filterInputByOptions());
    dispatch(totalInput())
  }

  function handleFilterByFrequency(e: React.ChangeEvent<HTMLSelectElement>) {
    e.preventDefault();
    dispatch(changeOptions(['frequency', e.target.value]))
    dispatch(filterInputByOptions())
    dispatch(totalInput())
  }

  function handleFilterByYear(e: any) {
    e.preventDefault();
    dispatch(changeOptions(['year', e.target.value]))
    dispatch(filterInputByOptions())
    dispatch(totalInput())
  }

  function resetAll() {
    (document.getElementById("selectCategories") as HTMLFormElement).value = 'default';
    (document.getElementById("selectFrequency") as HTMLFormElement).value = 'default';
    (document.getElementById("selectYear") as HTMLFormElement).value = ''
  }

  function handleRefresh(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    dispatch(renderInput(date))
    dispatch(totalInput())
    dispatch(clearChangeOptions())
    return resetAll()
  }

  // Interfaces
  interface Value {
    date: string,
    end?: string,
    description: string,
    category: string,
    amount: number,
    frequency?: string
  }
  interface AgregarIngresos {
    id?: string,
    frequency: string,
    key: string,
    value: Value,
  }

  //Delete
  interface accountParameter {
    id?: string,
    type: string,
    frequency: string,
    value: any
  }

  interface keySelect {
    keyInput: string
  }

  interface Category {
    name: string,
    frequency: string,
    type: string,
    _id: {
      $oid: string
    }
  }
  //---------------------------------
  // Variables & States
  const dispatch = useAppDispatch();
  const { usuario, totalInputsMonth, status, renderInputs } = useAppSelector(state => state.user);

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (status === 'success') {
      dispatch(renderInput(date))
      dispatch(totalInput())
    }
  }, [status])

  // const [formCategoryDelete, setFormCategoryDelete] = useState<Category>({
  //   key: 'CategoriesInputs',
  //   value: ''
  // })
  //-----------------------------------


  //Controllers

  const [selectKey, setSelectKey] = useState<keySelect>({
    keyInput: '',
  })
  const [input, setInput] = useState<Value>({ // Form inputs
    category: '',
    description: '',
    amount: 0,
    date: today
  });

    // Validate
    const firstRender = useRef(true)

    const [valMsg, setMsg] = useState('')
    const [valDisable, setDisabled] = useState(true)
  
    useEffect(() => {
      if (firstRender.current === true) {
        firstRender.current = false
        return
      }
      
      !selectKey.keyInput ? setMsg('Proporcione un tipo') :
      !input.category ? setMsg('Proporcione una categoria') :
      !input.description ? setMsg('Proporcione una descripcion') :
      !input.amount ? setMsg('Proporcione un monto') : 
      setMsg('')

      
    }, [input, selectKey])
    
    useEffect(() => {
      setDisabled(valMsg === '' ? false : true)
    }, [valMsg])

    
    
    //-----------------------------------

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {	//Input changer
    setInput({
      ...input,
      [e.target.name]: e.target.value
    })
  }
  function handleSelectInputs(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectKey({
      ...selectKey,
      keyInput: e.target.value,
    })
    setInput({
      ...input,
      category: ''
    })
  }

  function handleSelectCategories(e: React.ChangeEvent<HTMLSelectElement>) {
    
    setInput({
      ...input,
      category: e.target.value
    })
  }

  const form: AgregarIngresos = {
    frequency: selectKey.keyInput,
    key: 'input',
    value: input,
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {         //-----Form
    e.preventDefault();
    console.log(form)
    dispatch(addDato(form));
    setInput({
      category: '',
      description: '',
      amount: 0,
      date: ''
    })
    setSelectKey({
      keyInput: ''
    })
    resetAll()
  }
  
  //---------------------------------


  //Form de categorias



  //Form DELETE categorias
  // function handleChangeCategoryDelete(e: any) {
  //   setFormCategoryDelete({
  //     ...formCategoryDelete,
  //     value: e.target.value
  //   })
  // }

  // function handleSubmitCategoryDelete(e: React.FormEvent<HTMLFormElement>) {
  //   e.preventDefault();
  //   dispatch(deleteCategory(formCategoryDelete))
  // }



  //Paginado
  const [page, setPage] = useState(1);
  const [inputsPerPage, ] = useState(6);

  const [pageLimit, ] = useState(10);
  const [maxPageLimit, setMaxPageLimit] = useState(10);
  const [minPageLimit, setMinPageLimit] = useState(0);

  const pageNumber = [];
  for (let i = 1; i <= Math.ceil(renderInputs.length / inputsPerPage); i++) {
    pageNumber.push(i)
  }

  const indice = pageNumber && pageNumber.map(pag => {
    if (pag <= maxPageLimit && pag > minPageLimit) {
      return <button className={pag === page ? stylesPag.active : styles.normal} onClick={() => setPage(pag)}>{pag}</button>
    } else return null;
  })

  const handlePrevButton = () => {
    setPage((prev) => prev === 1 ? prev : prev - 1);
    if (page !== 1 && (page - 1) % pageLimit === 0) {
      setMaxPageLimit(maxPageLimit - pageLimit);
      setMinPageLimit(minPageLimit - pageLimit);
    }
  }

  const handleNextButton = () => {
    setPage((next) => next === pageNumber.length ? next : next + 1);
    if (page + 1 > maxPageLimit) {
      setMaxPageLimit(maxPageLimit + pageLimit);
      setMinPageLimit(minPageLimit + pageLimit);
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "178px 1fr" }}>
      <Nav />
      <div className={styles.background}>
        <div className={styles.wrapperAllIngreso}>
          {/* Title */}
          <div className={styles.title}>
            <h1>Tus Ingresos </h1>
          </div>

          {/* Order */}
          <div className={styles.selectsOrder}>
            <select value='Ordenar' onChange={(e) => handleOrderAmount(e)}>
              <option value='default'>Ordenar por monto</option>
              <option value='mayorAMenor'>De mayor a menor</option>
              <option value='menorAMayor'>De menor a mayor</option>
            </select>

            <select id='selectCategories' onChange={(e) => handleOrderByCategories(e)}>
              <option value='default'>Ordenar por categoria</option>
              {
                ['Salario', 'Préstamo', 'Herencia', 'Changa', 'Encontrado'].map(undefinedCategory => {
                  return (<option value={undefinedCategory}>{undefinedCategory}</option>)
                })
              }
              {usuario.categories.length > 0 &&
                usuario.categories.filter((category: Category) => category.type === 'input').map((category: Category) => {
                  return (<option value={category.name}>{category.name.charAt(0).toUpperCase() + category.name.slice(1).toLowerCase()}</option>)
                })
              }
              <option value='Ahorros' className={styles.Ahorros}>Ahorros</option>
            </select>

            <select id='selectFrequency' onChange={(e) => handleFilterByFrequency(e)}>
              <option value='default'>Ordenar por frecuencia</option>
              <option value='monthly'>Ingreso fijo</option>
              <option value='extra'>Ingreso extra</option>
            </select>

            <select id='selectYear' onChange={(e) => handleFilterByYear(e)}>
              <option value=''>Ordenar por año</option>
              <option value='2022'>2022</option>
              <option value='2023'>2023</option>
              <option value='2024'>2024</option>
            </select>

          </div>

          {/* Month */}
          <div className={styles.allMonths}>
            <div className={styles.monthCard}>
              {
                ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map(
                  (month, i) => {
                    return (<button value={i < 9 ? `0${i + 1}` : `${i + 1}`} className={styles.month} id={month} onClick={(e) => filterByMonth(e)}>{month}</button>
                    )
                  }
                )
              }
            </div>
            <div className={styles.annualCard}>
              <button type='reset' className={styles.annual} onClick={handleRefresh}>Refresh</button>
            </div>
          </div>

          {/* Table */}
          <table className={styles.table}>
            <thead className={styles.head}>
              <tr>
                <th>Frecuencia</th>
                <th>Fecha</th>
                <th>Categoria</th>
                <th>Descripción</th>
                <th>Monto</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {renderInputs?.length > 0 ? renderInputs.slice((page - 1) * inputsPerPage, (page - 1) * inputsPerPage + inputsPerPage).map((detalles: any) => {
                return (
                  detalles.frequency === 'monthly' ?
                    <tr className={styles.monthlyInput} key={detalles._id}>
                      <th>Ingreso fijo</th>
                      <th>{detalles.date && detalles.date.split("T")[0]}</th>
                      <th>{detalles.category ? detalles.category.charAt(0).toUpperCase() + detalles.category.slice(1).toLowerCase() : "-"}</th>
                      <th>{detalles.description}</th>
                      <th>$ {detalles.amount}</th>
                      <th><button onClick={() => handleDelete({ frequency: detalles.frequency, type: 'input', value: detalles })}></button></th>
                    </tr>
                    : <tr key={detalles._id}>
                      <th>Ingreso extra</th>
                      <th>{detalles.date && detalles.date.split("T")[0]}</th>
                      <th>{detalles.category ? detalles.category.charAt(0).toUpperCase() + detalles.category.slice(1).toLowerCase() : "-"}</th>
                      <th>{detalles.description}</th>
                      <th>$ {detalles.amount}</th>
                      <th><button onClick={() => handleDelete({ frequency: detalles.frequency, type: 'input', value: detalles })}></button></th>
                    </tr>
                )
              }) : <></>
              }
              <tr>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th className={styles.totalAmount}><b>Total: ${totalInputsMonth}</b></th>
                <th className={styles.lastBox}></th>
              </tr>
            </tbody>
          </table>

          {/* Pagination */}
          <div className={stylesPag.wrapperPag}>
            <button className={page <= 1 ? stylesPag.disabledPrev : stylesPag.paginationPrev} onClick={() => handlePrevButton()}>Prev</button>
            {indice}
            <button className={page >= pageNumber.length ? stylesPag.disabledNext : stylesPag.paginationNext} onClick={() => handleNextButton()}>Next</button>
          </div>

          {/* Creation form */}
          <div className={styles.wrapperForms}>
            <form onSubmit={(e) => handleSubmit(e)}>
              <div className={styles.form}>

                <select value={selectKey.keyInput} onChange={handleSelectInputs}>
                  <option value='' disabled={true}>Selecciona el tipo</option>
                  <option value='monthly'>Ingreso fijo</option>
                  <option value='extra'>Ingreso extra</option>
                </select>

                <select value={input.category} onChange={handleSelectCategories}>
                  <option value='' disabled={true}>Selecciona una categoría</option>
                  {
                    selectKey.keyInput ?
                      selectKey.keyInput === 'monthly'
                        ? ['Salario', 'Préstamo'].map(montInput => {
                          return (<option value={montInput}>{montInput}</option>)
                        })
                        : ['Changa', 'Herencia', 'Encontrado', 'Préstamo'].map(extraInput => {
                          return (<option value={extraInput}>{extraInput}</option>)
                        })
                        : <></>

                      
                  }
                  {selectKey.keyInput ?
                    usuario.categories.length > 0
                      && selectKey.keyInput === 'monthly'
                      ? usuario.categories.filter((montInput: Category) => montInput.frequency === 'monthly' && montInput.type === 'input').map((montInput: Category, i: number) => {
                        return (
                          <option value={montInput.name} key={i}>{montInput.name.charAt(0).toUpperCase() + montInput.name.slice(1).toLowerCase()}</option>)
                      })
                      : usuario.categories.filter((extraInput: Category) => extraInput.frequency === 'extra' && extraInput.type === 'input').map((extraInput: Category, i: number) => {
                        return (<option value={extraInput.name} key={i}>{extraInput.name.charAt(0).toUpperCase() + extraInput.name.slice(1).toLowerCase()}</option>)
                      })
                    : usuario.categories.length > 0
                    && usuario.categories.map((allInputs: Category, i: number) => {
                      return (<option value={allInputs.name} key={i}>{allInputs.name.charAt(0).toUpperCase() + allInputs.name.slice(1).toLowerCase()}</option>)
                    })
                  }
                  <option value='Crear' className={styles.Crear}>Crear</option>
                </select>
                <input
                  type='text'
                  name='description'
                  value={input.description}
                  placeholder='Agrega una descripción'
                  onChange={handleChange}
                  autoFocus={true}
                >
                </input>
                <label>$</label>
                <input
                  type='number'
                  name='amount'
                  min='0'
                  value={input.amount}
                  placeholder='Agrega un monto'
                  onChange={handleChange}
                  className={styles.amount}
                >
                </input>
                <input
                  type='date'
                  name='date'
                  value={input.date}
                  placeholder='Agrega una fecha'
                  onChange={handleChange}
                >
                </input>
                <button type='submit' disabled={valDisable}>Agregar</button>
              </div>
            </form>

            {/* Error Display */}
            <span id='validateError'>{valMsg}</span>

            {/* Category Creation */}
            {
              input.category === 'Crear'
              && (<div className={styles.CrearDiv}>
                <button onClick={() => setOpen(!open)} className={styles.CrearButton}>Agregar una nueva categoría</button>
                <PopUp
                  open={open}
                  setOpen={setOpen}
                  onClick={() => setOpen(open)}
                  title="Completa para agregar una categoría!">
                  <CategoryCreate />
                </PopUp>
              </div>)
            }
          </div>
        </div>
      </div>
    </div>
  )
}
