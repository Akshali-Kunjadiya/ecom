import { createSlice } from "@reduxjs/toolkit";

const userInfoFromStorage=localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')):null
const initialState={
    userInfo:userInfoFromStorage
};
const userLoginSlice=createSlice({
    name: "userLogin",
    initialState,
    reducers:{
        userLoginRequest(state){
            state.loading=true;
        },
        userLoginSuccess(state,action){
            state.loading=false;
            state.userInfo=action.payload;
            localStorage.setItem('userInfo',JSON.stringify(action.payload))
        },
        userLoginFail(state,action){
            state.loading=false;
            state.error=action.payload;
        },
        userLogout(state,action){
            localStorage.removeItem("userInfo")
            return{}
        },
    },
});

export default userLoginSlice.reducer;
export const {userLoginRequest,userLoginSuccess,userLoginFail,userLogout} =userLoginSlice.actions;