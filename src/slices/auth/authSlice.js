import { createSlice } from '@reduxjs/toolkit'


export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    email: '',
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setEmail: (state, action) => {
      console.log("this sis slice ",action);
      state.email = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.email = '';
    },
  },

})

export const { setToken, setEmail, logout } = authSlice.actions;
export default authSlice.reducer;