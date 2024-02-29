import { createSlice } from "@reduxjs/toolkit";

const initialState={
    productList:[],
    loading:false,
    error:null,
};
const productSlice=createSlice({
    name: "productList",
    initialState,
    reducers:{
        fetchProductRequest(state){
            state.loading=true;
            state.error=null;
        },
        fetchProductSuccess(state,action){
            state.loading=false;
            state.productList=action.payload;
        },
        fetchProductFail(state,action){
            state.loading=false;
            state.error=action.payload;
        },
    },
});

export default productSlice.reducer;
export const {fetchProductFail,fetchProductRequest,fetchProductSuccess} =productSlice.actions;