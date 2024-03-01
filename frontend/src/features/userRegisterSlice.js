import { createSlice } from "@reduxjs/toolkit";

const userInfoFromStorage=localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')):null
const initialState={
    userInfo:userInfoFromStorage
};
const userRegisterSlice=createSlice({
    name: "userRegister",
    initialState,
    reducers:{
        userRegisterRequest(state){
            state.loading=true;
        },
        userRegisterSuccess(state,action){
            state.loading=false;
            state.userInfo=action.payload;
            localStorage.setItem('userInfo',JSON.stringify(action.payload))
        },
        userRegisterFail(state,action){
            state.loading=false;
            state.error=action.payload;
        },
        userLogout(state,action){
            localStorage.removeItem("userInfo")
            return{}
        },
    },
});

export default userRegisterSlice.reducer;
export const {userRegisterRequest,userRegisterSuccess,userRegisterFail,userloo} =userRegisterSlice.actions;