import { createSlice } from "@reduxjs/toolkit";

const initialState={

};
const productDeleteSlice=createSlice({
    name: "productDelete",
    initialState,
    reducers:{
        ProductDeleteRequest(state){
            state.loading=true;
        },
        ProductDeleteSuccess(state,action){
            state.loading=false;
            state.success=true;
        },
        ProductDeleteFail(state,action){
            state.loading=false;
            state.error=action.payload;
        },
    },
});

export default productDeleteSlice.reducer;
export const {ProductDeleteRequest,ProductDeleteSuccess,ProductDeleteFail} =productDeleteSlice.actions;