import { configureStore } from "@reduxjs/toolkit"
import counterReducer from "./counter/counterSlice"

//This is the redux store where we are storing the variable 
export default configureStore({
  reducer: {
    counter: counterReducer
  }
})