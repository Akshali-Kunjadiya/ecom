import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
};
const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    userDetailsRequest(state) {
      return {
        ...state,
        loading: true,
      };
    },
    userDetailsSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
    },
    userDetailsFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    userDetailsReset(state, action) {
      return{
        user:{}
      }
    },
  },
});

export default userDetailsSlice.reducer;
export const { userDetailsRequest, userDetailsSuccess, userDetailsFail,userDetailsReset } =
  userDetailsSlice.actions;
