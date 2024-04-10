import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
};
const userUpdateAdminSlice = createSlice({
  name: "userUpdateAdmin",
  initialState,
  reducers: {
    userUpdateAdminRequest(state) {
      return {
        loading: true,
      };
    },
    userUpdateAdminSuccess(state, action) {
      state.loading = false;
      state.success = true;
    },
    userUpdateAdminFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    userUpdateAdminReset(state, action) {
      return { user: {} };
    },
  },
});

export default userUpdateAdminSlice.reducer;
export const {
  userUpdateAdminRequest,
  userUpdateAdminSuccess,
  userUpdateAdminFail,
  userUpdateAdminReset,
} = userUpdateAdminSlice.actions;
