import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  
};
const userUpdateSlice = createSlice({
  name: "userUpdate",
  initialState,
  reducers: {
    userUpdateRequest(state) {
      return {
        loading: true,
      };
    },
    userUpdateSuccess(state, action) {
      state.loading = false;
      state.userInfo = action.payload;
      state.success=true
      localStorage.setItem('userInfo',JSON.stringify(action.payload))
    },
    userUpdateFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    userUpdateReset(state,action){
        return {}
    }
  },
});

export default userUpdateSlice.reducer;
export const { userUpdateRequest, userUpdateSuccess, userUpdateFail,userUpdateReset } =
  userUpdateSlice.actions;
