import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

import { registerUser } from './actions/registerUser'
import { loginUser } from './actions/loginUser'
import { googleLogin } from './actions/googleLogin'
import { logout } from './actions/logout'
import { getUserInfo } from './actions/getUserInfo'
import { addDato } from './actions/addDato'
import { deleteDato } from './actions/deleteDato'
import { addCategory } from './actions/addCategory'
import { deleteCategory } from './actions/deleteCategory'
import { getCurrency } from "./actions/getCurrency";
import { addSaving } from './actions/addSaving'
import { deleteSaving } from './actions/deleteSaving'
import addReview from "./actions/addReview";
import deleteReview from "./actions/deleteReview";


export const updatePersonalInfo: any = createAsyncThunk("user/updatePersonalInfo",
  async (info: any) => {
    const { data } = await axios.put("/user/update", info)
    return data
  })

export const uploadImage: any = createAsyncThunk("user/uploadImage",
  async (info: any) => {
    let formData = new FormData();
    formData.append("file", info.img)
    formData.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET as string | Blob)
    const result = await axios.post("https://api.cloudinary.com/v1_1/finanzas-personales/image/upload",
      formData, { withCredentials: false });
    const { data } = await axios.put("/user/update", { id: info.id, key: "avatar", value: result.data.url });
    return data
  });

//---------------------------------

interface Entries {
  date: string,
  end?: string,
  frequency?: string,
  description: string,
  category: string,
  amount: number
}
interface User {
  usuario: any,
  // {
  //   firstName: string
  //   lastName: string
  //   email: string
  //   password: string
  //   savings: []
  //   monthly: {
  //     input: [],
  //     output: []
  //   },
  //   extra: {
  //     input: [],
  //     output: []
  //   },
  //   categories: [],
  //   review: {
  //     text: string
  //     rating: number
  //   }
  // }
  status: 'idle' | 'loading' | 'success' | 'failed'
  allInputs: Entries[] | [],
  allOutputs: Entries[] | [],
  renderInputs: Entries[] | [],
  renderOutputs: Entries[] | [],
  totalOutputsMonth: number,
  totalInputsMonth: number
  options: any
  dataCurrency: {}
}

const initialState: User = {
  usuario: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    savings: [],
    review: {
      text: "",
      rating: 0
    },
    monthly: {
      input: [],
      output: []
    },
    extra: {
      input: [],
      output: []
    },
    categories: []
  },
  options: {
    frequency: 'default',
    category: 'default',
    month: ''
  },
  status: 'idle',
  allInputs: [],
  allOutputs: [],
  renderInputs: [],
  renderOutputs: [],
  totalOutputsMonth: 0,
  totalInputsMonth: 0,
  dataCurrency: {}
}

const reducerSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    renderInput: (state, { payload }) => {
      try {
        // Bring monthly inputs
        const month = state.usuario.monthly.input.filter((e: Entries) => `${e.date.split('-')[0]}-${e.date.split('-')[1]}` === payload)
        // const monthFilter = month ? month.filter((e: Entries) => e.date.split('-')[0] + e.date.split('-')[1] === payload) : []
        const monthEntries = month.length > 0 ? month.map((e: Entries) => e = { ...e, frequency: 'monthly' }) : []
        // const month = state.usuario.monthly.input.slice().map((e:Entries) => e = {...e, frequency: 'monthly'} ) || []
        // Bring extra inputs
        const extraIndex = state.usuario.extra.input.map((e: Entries) => e.date).indexOf(payload) || 0
        const extra = extraIndex < 0 ? [] : state.usuario.extra.input[extraIndex].entries.map((e: Entries) => e = { ...e, frequency: 'extra' }).map((e: Entries) => e = { ...e, date: e.date.split("T")[0] })
        const sortInputs = [...monthEntries, ...extra].sort((a, b) => b.date.split('-')[2] - a.date.split('-')[2])
        state.renderInputs = sortInputs;
        state.allInputs = sortInputs;
      } catch (e) {
        console.log(e)
      }
    },
    totalInput: (state) => {
      let reduceTotal = 0
      state.renderInputs.forEach(entrie => reduceTotal += entrie.amount)
      state.totalInputsMonth = reduceTotal
    },
    renderOutput: (state, { payload }) => {
      try {    // Bring monthly inputs
        const month = state.usuario.monthly.output.filter((e: Entries) => `${e.date.split('-')[0]}-${e.date.split('-')[1]}` === payload) || []
        // const monthFilter = month ? month.filter((e: Entries) => e.date.split('-')[0] + e.date.split('-')[1] === payload) : []
        const monthEntries = month.length > 0 ? month.map((e: Entries) => e = { ...e, frequency: 'monthly' }) : []

        // Bring extra inputs
        const extraIndex = state.usuario.extra.output.map((e: Entries) => e.date).indexOf(payload) || 0
        const extra = extraIndex < 0 ? [] : state.usuario.extra.output[extraIndex].entries.map((e: Entries) => e = { ...e, frequency: 'extra' }).map((e: Entries) => e = { ...e, date: e.date.split("T")[0] })
        const sortOutputs = [...monthEntries, ...extra].sort((a, b) => b.date.split('-')[2] - a.date.split('-')[2])
        state.renderOutputs = sortOutputs;
        state.allOutputs = sortOutputs;
      } catch (e) {
        console.log(e)
      }
    },
    totalOutput: (state) => {
      let reduceTotal = 0
      state.renderOutputs.forEach(entrie => reduceTotal += entrie.amount)
      state.totalOutputsMonth = reduceTotal;
    },
    changeOptions: (state, { payload }) => {
      state.options[payload[0]] = payload[1]
    },
    clearChangeOptions: (state) => {
      state.options = {frequency: 'default', category: 'default', month: ''}
    },
    filterOutputByOptions: (state) => {
      //Month
      if (state.options.month === '') {
        state.renderOutputs = state.allOutputs
      } else {
        const month = state.usuario.monthly.output.filter((e: Entries) => `${e.date.split('-')[1]}` === state.options.month) || []
        const monthEntries = month.length > 0 ? month.map((e: Entries) => e = { ...e, frequency: 'monthly' }) : []
        const extraIndex = state.usuario.extra.output.find((e: Entries) => `${e.date.split('-')[1]}` === state.options.month)

        if (!extraIndex) {
          state.renderOutputs = [...monthEntries]
        } else {
          const extraEntries = extraIndex.entries.map((e: Entries) => e = { ...e, frequency: 'extra' })
          state.renderOutputs = [...monthEntries, ...extraEntries]
        }
      }
      //Frequency
      switch (state.options.frequency) {
        case 'monthly': {
          state.renderOutputs = state.renderOutputs.filter((entries: Entries) => entries.frequency === 'monthly')
          break
        }
        case 'extra': {
          state.renderOutputs = state.renderOutputs.filter((entries: Entries) => entries.frequency === 'extra')
          break
        }
        case 'default': {
          break
        }
        default: {
          break
        }
      }
      //Category
      if (state.options.category === 'default') {
        return;
      } else {
        state.renderOutputs = state.renderOutputs.filter((entries: Entries) => state.options.category === entries.category)
      }
    },
    filterInputByOptions: (state) => {
      //Month
      if (state.options.month === '') {
        state.renderInputs = state.allInputs
      } else {
        const month = state.usuario.monthly.input.filter((e: Entries) => `${e.date.split('-')[1]}` === state.options.month) || []
        const monthEntries = month.length > 0 ? month.map((e: Entries) => e = { ...e, frequency: 'monthly' }) : []
        const extraIndex = state.usuario.extra.input.find((e: Entries) => `${e.date.split('-')[1]}` === state.options.month)

        if (!extraIndex) {
          state.renderInputs = [...monthEntries]
        } else {
          const extraEntries = extraIndex.entries.map((e: Entries) => e = { ...e, frequency: 'extra' })
          state.renderInputs = [...monthEntries, ...extraEntries]
        }
      }
      //Frequency
      switch (state.options.frequency) {
        case 'monthly': {
          state.renderInputs = state.renderInputs.filter((entries: Entries) => entries.frequency === 'monthly')
          break
        }
        case 'extra': {
          state.renderInputs = state.renderInputs.filter((entries: Entries) => entries.frequency === 'extra')
          break
        }
        case 'default': {
          break
        }
        default: {
          break
        }
      }
      //Category
      if (state.options.category === 'default') {
        return;
      } else {
        state.renderInputs = state.renderInputs.filter((entries: Entries) => state.options.category === entries.category)
      }
    },
    expensesOrderByAmount: (state, { payload }) => {
      const orderExpenses: Entries[] = [...state.renderOutputs];
      let orderByAmount = payload === 'menorAMayor'
        ? orderExpenses.sort((a, b) => a.amount - b.amount)
        : orderExpenses.sort((a, b) => b.amount - a.amount)
      state.renderOutputs = orderByAmount
    },
    inputsOrderByAmount: (state, { payload }) => {
      const orderInputs: Entries[] = [...state.allInputs];
      let orderByAmount = payload === 'menorAMayor'
        ? orderInputs.sort((a, b) => a.amount - b.amount)
        : orderInputs.sort((a, b) => b.amount - a.amount)
      state.renderInputs = orderByAmount;
    },
  },
  extraReducers: {
    [registerUser.pending]: (state) => {
      state.status = "loading"
    },
    [registerUser.fulfilled]: (state) => {
      state.status = "success"
    },
    [registerUser.rejected]: (state) => {
      state.status = "failed"
    },
    [loginUser.pending]: (state) => {
      state.status = "loading"
    },
    [loginUser.fulfilled]: (state) => {
      state.status = "success"
    },
    [loginUser.rejected]: (state) => {
      state.status = "failed"
    },
    [googleLogin.pending]: (state) => {
      state.status = "loading"
    },
    [googleLogin.fulfilled]: (state) => {
      state.status = "success"
    },
    [googleLogin.rejected]: (state) => {
      state.status = "failed"
    },
    [logout.pending]: (state) => {
      state.status = "loading"
    },
    [logout.fulfilled]: (state) => {
      state.status = "success"
    },
    [logout.rejected]: (state) => {
      state.status = "failed"
    },
    [getUserInfo.pending]: (state) => {
      state.status = "loading"
    },
    [getUserInfo.fulfilled]: (state, { payload }) => {
      state.status = "success"
      state.usuario = payload
    },
    [getUserInfo.rejected]: (state) => {
      state.status = "failed"
    },
    [updatePersonalInfo.pending]: (state) => {
      state.status = "loading"
    },
    [updatePersonalInfo.fulfilled]: (state, { payload }) => {
      state.status = "success"
      state.usuario[payload.key] = payload.value
    },
    [updatePersonalInfo.rejected]: (state) => {
      state.status = "failed"
    },

    //---------------------------------------------------------
    [addDato.pending]: (state) => {
      state.status = "loading"
    },
    [addDato.fulfilled]: (state, { payload }) => {
      state.status = "success"
      state.usuario = payload
    },
    [addDato.rejected]: (state) => {
      state.status = "failed"
    },
    [deleteDato.pending]: (state) => {
      state.status = 'loading'
    },
    [deleteDato.fulfilled]: (state, { payload }) => {
      state.status = 'success'
      state.usuario = payload
    },
    [deleteDato.rejected]: (state) => {
      state.status = 'failed'
    },
    [uploadImage.pending]: (state) => {
      state.status = "loading"
    },
    [uploadImage.fulfilled]: (state, { payload }) => {
      state.status = "success"
      state.usuario[payload.key] = payload.value
    },
    [uploadImage.rejected]: (state) => {
      state.status = "failed"
    },
    [addCategory.pending]: (state) => {
      state.status = "loading"
    },
    [addCategory.fulfilled]: (state, { payload }) => {
      state.status = "success"
      state.usuario = payload
    },
    [addCategory.rejected]: (state) => {
      state.status = "failed"
    },
    [deleteCategory.pending]: (state) => {
      state.status = "loading"
    },
    [deleteCategory.fulfilled]: (state, { payload }) => {
      state.status = "success"
      state.usuario = payload
    },
    [deleteCategory.rejected]: (state) => {
      state.status = "failed"
    },
    [addSaving.pending]: (state) => {
      state.status = "loading"
    },
    [addSaving.fulfilled]: (state, { payload }) => {
      state.status = "success"
      state.usuario = payload
    },
    [addSaving.rejected]: (state) => {
      state.status = "failed"
    },
    [deleteSaving.pending]: (state) => {
      state.status = "loading"
    },
    [deleteSaving.fulfilled]: (state, { payload }) => {
      state.status = "success"
      state.usuario = payload
    },
    [deleteSaving.rejected]: (state) => {
      state.status = "failed"
    },
    [getCurrency.pending]: (state) => {
      state.status = "loading"
    },
    [getCurrency.fulfilled]: (state, { payload }) => {
      state.status = "success"
      state.dataCurrency = payload
    },
    [getCurrency.rejected]: (state) => {
      state.status = "failed"
    },
    [addReview.pending]: (state) => {
      state.status = "loading"
    },
    [addReview.fulfilled]: (state, { payload }) => {
      state.status = "success"
      state.usuario.review = payload
    },
    [addReview.rejected]: (state) => {
      state.status = "failed"
    },
    [deleteReview.pending]: (state) => {
      state.status = "loading"
    },
    [deleteReview.fulfilled]: (state) => {
      state.status = "success"
      state.usuario.review = undefined
    },
    [deleteReview.rejected]: (state) => {
      state.status = "failed"
    },
  }
})
export const {
  totalInput,
  renderOutput,
  renderInput,
  totalOutput,
  changeOptions,
  filterOutputByOptions,
  inputsOrderByAmount,
  expensesOrderByAmount,
  filterInputByOptions,
  clearChangeOptions
} = reducerSlice.actions;

export default reducerSlice.reducer;
