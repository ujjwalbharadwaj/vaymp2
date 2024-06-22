import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  cart: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
};

export const cartReducer = createReducer(initialState, {
  addToCart: (state, action) => {
    const item = action.payload;
    return {
      ...state,
      cart: [...state.cart, item],
    };
    
  },

  removeFromCart: (state, action) => {
    return {
      ...state,
      cart: state.cart.filter((i) => i._id !== action.payload),
    };
  },
  updateToCart: (state, action) => {
    const item = action.payload;
    console.log("reducer update",item)
    return {
      ...state,
      cart: item
    };
  },
});