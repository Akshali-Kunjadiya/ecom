import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
};
const orderListSlice = createSlice({
  name: "orderLists",
  initialState,
  reducers: {
    orderListRequest(state) {
      return {
        ...state,
        loading: true,
      };
    },
    orderListSuccess(state, action) {
      state.loading = false;
      state.orders = action.payload;
     
    },
    orderListFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    orderListReset(state, action) {
      return{
        orders:[]
      }
    },
  },
});

export default orderListSlice.reducer;
export const { orderListRequest, orderListSuccess, orderListFail,orderListReset } =
  orderListSlice.actions;
