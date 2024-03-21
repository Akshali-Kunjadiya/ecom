import { createSlice } from "@reduxjs/toolkit";

const initialState = {
};
const productReviewCreateSlice = createSlice({
  name: "productReviewCreate",
  initialState,
  reducers: {
    productReviewCreateRequest(state) {
      return {
        loading: true,
      };
    },
    productReviewCreateSuccess(state, action) {
      state.loading = false;
      state.success = true;

    },
    productReviewCreateFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    productReviewCreateReset(state, action) {
      return {};
    },
  },
});

export default productReviewCreateSlice.reducer;
export const {
  productReviewCreateRequest,
  productReviewCreateSuccess,
  productReviewCreateFail,
  productReviewCreateReset,
} = productReviewCreateSlice.actions;
