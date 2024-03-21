import { configureStore } from '@reduxjs/toolkit'
import productSlice from '../features/productSlice'
import productDetailSlice from '../features/productDetailSlice'
import cartSlice from '../features/cartSlice'
import userLoginSlice from '../features/userLoginSlice'
import userRegisterSlice from '../features/userRegisterSlice'
import userDetailsSlice from '../features/userDetailsSlice'
import userUpdateSlice from '../features/userUpdateSlice'
import orderSlice from '../features/orderSlice'
import orderDetailsSlice from '../features/orderDetailsSlice'
import orderPaySlice from '../features/orderPaySlice'
import orderListSlice from '../features/orderListSlice'
import userListSlice from '../features/userListSlice'
import userDeleteSlice from '../features/userDeleteSlice'
import userUpdateAdminSlice from '../features/userUpdateAdminSlice'
import productDeleteSlice from '../features/productDeleteSlice'
import productCreateSlice from '../features/productCreateSlice'
import productUpdateSlice from '../features/productUpdateSlice'
import orderlistAdminSlice from '../features/orderlistAdminSlice'
import orderDeliveredSlice from '../features/orderDeliveredSlice'
import productReviewCreateSlice from '../features/productReviewCreateSlice'
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
        userRegister:userRegisterSlice,
        userDetails:userDetailsSlice,
        userUpdateProfile:userUpdateSlice,
        orderCreate:orderSlice,
        orderDetails:orderDetailsSlice,
        orderPay:orderPaySlice,
        orderList:orderListSlice,
        userList:userListSlice,
        userDelete:userDeleteSlice,
        userUpdateAdmin:userUpdateAdminSlice,
        productDelete:productDeleteSlice,
        productCreate:productCreateSlice,
        productUpdate:productUpdateSlice,
        orderListAdmin:orderlistAdminSlice,
        orderDelivered:orderDeliveredSlice,
        productReviewCreate:productReviewCreateSlice
    },
    // preloadedState:{ 
    //     cart:initialcartState,   

    // },
    middleware:(getDefaultMiddleware)=>[...getDefaultMiddleware(), thunk],

});

export default store;

