import { createSlice } from "@reduxjs/toolkit"
//here we are setting the variable to send to redux store so that we can access the variable anywhere inside the app
//this is the count variable stored inside the redux store
export const counterSlice = createSlice({
  name: "counter",
  //initialState is inbuilt where it sets the variable into the initial value as 0
  initialState: {
    value: 0
  },
  
  reducers: {
    //Just remember the syntax
    setCount: (state, action) => {
      state.value = action.payload;
    },
  }
});

//Export the setCount reducer 
export const { setCount } = counterSlice.actions

export default counterSlice.reducer