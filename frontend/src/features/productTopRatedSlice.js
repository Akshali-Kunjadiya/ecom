import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products:[],
};
const productTopRatedSlice = createSlice({
  name: "productTopRatedSlice",
  initialState,
  reducers: {
    productTopRatedRequest(state) {
      return {
        loading: true,
        products:[]
      };
    },
    productTopRatedSuccess(state, action) {
      state.loading = false;
      state.products = action.payload;

    },
    productTopRatedFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    }
  },
});

export default productTopRatedSlice.reducer;
export const {
    productTopRatedRequest,
  productTopRatedSuccess,
  productTopRatedFail,
} = productTopRatedSlice.actions;
