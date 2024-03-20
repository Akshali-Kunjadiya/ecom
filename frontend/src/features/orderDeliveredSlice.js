import { createSlice } from "@reduxjs/toolkit";

const initialState = {
};
const orderDeliveredSlice = createSlice({
  name: "orderDelivered",
  initialState,
  reducers: {
    orderDeliveredRequest(state) {
      return {
        ...state,
        loading: true,
      };
    },
    orderDeliveredSuccess(state, action) {
      state.loading = false;
      state.success = true;
    },
    orderDeliveredFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    orderDeliveredReset(state, action) {
      return{}
    },
  },
});

export default orderDeliveredSlice.reducer;
export const { orderDeliveredRequest, orderDeliveredSuccess, orderDeliveredFail,orderDeliveredReset } =
orderDeliveredSlice.actions;
