import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  allProducts: [],
  error: null,

};
export const productReducer = createReducer(initialState, {
  productCreateRequest: (state) => {
    state.isLoading = true;
  },
  productCreateSuccess: (state, action) => {
    state.isLoading = false;
    state.product = action.payload;
    state.success = true;
  },
  productCreateFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
    state.success = false;
  },

  // get all products of shop
  getAllProductsShopRequest: (state) => {
    state.isLoading = true;
  },
  getAllProductsShopSuccess: (state, action) => {
    state.isLoading = false;
    state.products = action.payload;
  },
  getAllProductsShopFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  // delete product of a shop
  deleteProductRequest: (state) => {
    state.isLoading = true;
  },

  deleteProductSuccess: (state, action) => {
    state.isLoading = false;
    state.message = action.payload;
  },
  deleteProductFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  // get all products
  getAllProductsRequest: (state) => {
    state.isLoading = true;
  },
  getAllProductsSuccess: (state, action) => {
    state.isLoading = false;
    state.allProducts = action.payload;
  },
  getAllProductsFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },
  
  clearErrors: (state) => {
    state.error = null;
  },

  updateProductStockRequest: (state) => {
    state.isLoading = true;
  },
  updateProductStockSuccess: (state, action) => {
    state.isLoading = false;
    const updatedProduct = action.payload;
    const updatedProducts = state.products.map((product) =>
      product._id === updatedProduct._id ? updatedProduct : product
    );
    state.products = updatedProducts;
  },
  
  updateProductStockFailed: (state, action) => {
    state.isLoading = false;
    state.products = action.payload;
  }
});


