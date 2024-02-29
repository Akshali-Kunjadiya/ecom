import { configureStore } from '@reduxjs/toolkit'
import productSlice from '../features/productSlice'
import productDetailSlice from '../features/productDetailSlice'
import cartSlice from '../features/cartSlice'
import userLoginSlice from '../features/userLoginSlice'

import {thunk} from 'redux-thunk';

// const cartItemsFromStorage=localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')): []
// const initialcartState={
//     cartItems:cartItemsFromStorage
// }
const store= configureStore({
    reducer:{
        productList:productSlice,
        productDetails:productDetailSlice,
        cart:cartSlice,
        userlogin:userLoginSlice,
    },
    // preloadedState:{ 
    //     cart:initialcartState,   

    // },
    middleware:(getDefaultMiddleware)=>[...getDefaultMiddleware(), thunk],

});

export default store;

