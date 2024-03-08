import { createSlice } from "@reduxjs/toolkit";

const initialState={
    
};
const userDeleteSlice=createSlice({
    name: "userDelete",
    initialState,
    reducers:{
        userDeleteRequest(state){
            state.loading=true;
        },
        userDeleteSuccess(state,action){
            state.loading=false;
            state.success=true;
        },
        userDeleteFail(state,action){
            state.loading=false;
            state.error=action.payload;
        },
    },
});

export default userDeleteSlice.reducer;
export const {userDeleteRequest,userDeleteSuccess,userDeleteFail} =userDeleteSlice.actions;