import { createSlice } from "@reduxjs/toolkit";

const initialState={
    product:{reviews:[]},
    loading:false,
    error:null,
};
const productDetails=createSlice({
    name: "productDetails",
    initialState,
    reducers:{
        fetchProductDetailsRequest(state){
            state.loading=true;
        },
        fetchProductDetailsSuccess(state,action){
            state.loading=false;
            state.product=action.payload;
        },
        fetchProductDetailsFail(state,action){
            state.loading=false;
            state.error=action.payload;
        },
    },
});

export default productDetails.reducer;
export const {fetchProductDetailsRequest,fetchProductDetailsSuccess,fetchProductDetailsFail} =productDetails.actions;