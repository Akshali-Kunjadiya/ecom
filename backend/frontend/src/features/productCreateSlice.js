import { createSlice } from "@reduxjs/toolkit";

const initialState={

};
const productCreateSlice=createSlice({
    name: "productCreate",
    initialState,
    reducers:{
        productCreateRequest(state){
            state.loading=true;
        },
        productCreateSuccess(state,action){
            state.loading=false;
            state.success=true;
            state.product=action.payload;
        },
        productCreateFail(state,action){
            state.loading=false;
            state.error=action.payload;
        },
        productCreateReset(state,action){
            return {}
        },
    },
});

export default productCreateSlice.reducer;
export const {productCreateRequest,productCreateSuccess,productCreateFail,productCreateReset} =productCreateSlice.actions;