import { createSlice } from "@reduxjs/toolkit";

const initialState={
    order:{},
    success:false,
    
};
const orderSlice=createSlice({
    name: "order",
    initialState,
    reducers:{
        orderCreateRequest(state){
            state.loading=true;
        },
        orderCreateSuccess(state,action){
            state.loading=false;
            state.order=action.payload;
            state.success=true
        },
        orderCreateFail(state,action){
            state.loading=false;
            state.error=action.payload;
        },
        orderCreateReset(state,action){
            return{}
        },
    },
});

export default orderSlice.reducer;
export const {orderCreateRequest,orderCreateSuccess,orderCreateFail,orderCreateReset} =orderSlice.actions;