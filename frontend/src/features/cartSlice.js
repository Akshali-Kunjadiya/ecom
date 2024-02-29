import { createSlice } from "@reduxjs/toolkit";
const cartItemsFromStorage=localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')): []

const initialState = {
  cartItems: cartItemsFromStorage,
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    cartAddItem(state, action) {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product);
      if (existItem) {
        const updateCartItems = state.cartItems.map((x) =>
          x.product === existItem.product ? item : x
        );
        localStorage.setItem("cartItems", JSON.stringify(updateCartItems));
        return{
            ...state,
            cartItems:updateCartItems
        }
      } else {
        const newItems=[...state.cartItems,item]
        localStorage.setItem("cartItems",JSON.stringify(newItems))
        return {
          ...state,
          cartItems: newItems,
        };
      }
    },
    cartRemoveItem(state, action) {
      const filterdItems=state.cartItems.filter(x=>x.product!==action.payload)
      localStorage.setItem("cartItems",JSON.stringify(filterdItems))
      return{
        ...state,
        cartItems:filterdItems
      }
    },
  },
});

export default cartSlice.reducer;
export const { cartAddItem, cartRemoveItem } = cartSlice.actions;
