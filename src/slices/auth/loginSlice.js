import { createSlice } from '@reduxjs/toolkit'

export const loginSlice = createSlice({
    name: 'isLogin',
    initialState: null,
    reducers: {
      setIsLogin: (state, action) => {
          return action.payload;
        },
    },
})


export const { setIsLogin } = loginSlice.actions;
export default loginSlice.reducer;