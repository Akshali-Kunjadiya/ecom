import { createSlice } from "@reduxjs/toolkit";

const initialState = {
};
const orderPaySlice = createSlice({
  name: "orderPay",
  initialState,
  reducers: {
    orderPayRequest(state) {
      return {
        ...state,
        loading: true,
      };
    },
    orderPaySuccess(state, action) {
      state.loading = false;
      state.success = true;
    },
    orderPayFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    orderPayReset(state, action) {
      return{}
    },
  },
});

export default orderPaySlice.reducer;
export const { orderPayRequest, orderPaySuccess, orderPayFail,orderPayReset } =
orderPaySlice.actions;
