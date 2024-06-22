import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  newStockNotification: false, // Add this field
  newShopStatus:true,
  

};

export const sellerReducer = createReducer(initialState, {
  LoadSellerRequest: (state) => {
    state.isLoading = true;
  },
  LoadSellerSuccess: (state, action) => {
    state.isSeller = true;
    state.isLoading = false;
    state.seller = action.payload;
  },
  LoadSellerFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
    state.isSeller = false;
  },

  // get all sellers ---admin
  getAllSellersRequest: (state) => {
    state.isLoading = true;
  },
  getAllSellersSuccess: (state, action) => {
    state.isLoading = false;
    state.sellers = action.payload;
  },
  getAllSellerFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },
  clearErrors: (state) => {
    state.error = null;
  },
  // get all products of shop
  getNewStockNotificationRequest: (state) => {
    state.isLoading = true;
  },
  getNewStockNotificationSuccess: (state, action) => {
    state.isLoading = false;
    state.products = action.payload;
  },
  getNewStockNotificationFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },
  updateNewStockNotificationRequest: (state) => {
    state.isLoading = true;
  },
  updateNewStockNotificationSuccess: (state, action) => {
    state.isLoading = false;
    state.newStockNotification = action.payload.newStock; // Access the correct property
  },
  updateNewStockNotificationFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },


  getNewShopStatusRequest: (state) => {
    state.isLoading = true;
  },
  getNewShopStatusSuccess: (state, action) => {
    state.isLoading = false;
    state.products = action.payload;
  },
  getNewShopStatusFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },
  updateShopStatusRequest: (state) => {
    state.isLoading = true;
  },
  updateShopStatusSuccess: (state, action) => {
    state.isLoading = false;
    state.newShopStatus = action.payload.shopStatus; // Access the correct property
  },
  updateShopStatusFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },
});
