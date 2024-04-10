import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
};
const orderListAdminSlice = createSlice({
  name: "orderListsAdmin",
  initialState,
  reducers: {
    orderListAdminRequest(state) {
      return {
        ...state,
        loading: true,
      };
    },
    orderListAdminSuccess(state, action) {
      state.loading = false;
      state.orders = action.payload;
     
    },
    orderListAdminFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    
  },
});

export default orderListAdminSlice.reducer;
export const { orderListAdminRequest, orderListAdminSuccess, orderListAdminFail } =
  orderListAdminSlice.actions;
