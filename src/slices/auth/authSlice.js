import { createSlice } from '@reduxjs/toolkit'


export const authSlice = createSlice({
  name: 'auth',
  initialState: null,
  reducers: {
    setToken: (state, action) => {
        return action.payload;
      },
  },
 
})

export const { setToken } = authSlice.actions;
export default authSlice.reducer;