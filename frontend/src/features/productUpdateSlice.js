import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  product: {},
};
const productUpdateSlice = createSlice({
  name: "userUpdateAdmin",
  initialState,
  reducers: {
    productUpdateRequest(state) {
      return {
        loading: true,
      };
    },
    productUpdateSuccess(state, action) {
      state.loading = false;
      state.success = true;
      state.product=action.payload;

    },
    productUpdateFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    productUpdateReset(state, action) {
      return { product: {} };
    },
  },
});

export default productUpdateSlice.reducer;
export const {
  productUpdateRequest,
  productUpdateSuccess,
  productUpdateFail,
  productUpdateReset,
} = productUpdateSlice.actions;
