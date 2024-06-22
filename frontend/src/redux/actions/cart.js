 // add to cart
export const addTocart = (data) => async (dispatch, getState) => {
  //console.log("llll",data)
  dispatch({
    type: "addToCart",
    payload:data,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
  //console.log("klj",getState().cart.cart)
  return data;
};

// remove from cart
export const removeFromCart = (data) => async (dispatch, getState) => {
  dispatch({
    type: "removeFromCart",
    payload: data._id,
  });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
  return data;
};
//update to cart
export const updateTocart = (data) => async (dispatch, getState) => {
  console.log("updateTocart action",data)

  dispatch({
    type: "updateToCart",
    payload:data,
  });

   localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
   return data;
};


