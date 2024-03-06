import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  order: { orderItems: [], shippingAddress: {} },
  loading: true,
};
const orderDetailsSlice = createSlice({
  name: "orderDetails",
  initialState,
  reducers: {
    orderDetailsRequest(state) {
      return {
        ...state,
        loading: true,
      };
    },
    orderDetailsSuccess(state, action) {
      state.loading = false;
      state.order = action.payload;
      state.success = true;
    },
    orderDetailsFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export default orderDetailsSlice.reducer;
export const { orderDetailsRequest, orderDetailsSuccess, orderDetailsFail } =
  orderDetailsSlice.actions;
