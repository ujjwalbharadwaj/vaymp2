import axios from "axios";
import { server } from "../../server";

// get all sellers --- admin
export const getAllSellers = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllSellersRequest",
    });

    const { data } = await axios.get(`${server}/shop/admin-all-sellers`, {
      withCredentials: true,
    });

    dispatch({
      type: "getAllSellersSuccess",
      payload: data.sellers,
    });
  } catch (error) {
    dispatch({
      type: "getAllSellerFailed",
    //   payload: error.response.data.message,
    });
  }
};


export const updateNewStockNotification = (shopId, newStock) => async (dispatch) => {
  try {
    dispatch({ type: "updateNewStockNotificationRequest" });

    const response = await axios.patch(
      `${server}/notification/new-stock-notification`,
      { shopId, newStock }, // Send shopId and newStock in the request body
      { withCredentials: true }
    );

    dispatch({
      type: "updateNewStockNotificationSuccess",
      payload: { newStock },
    });
  } catch (error) {
    dispatch({
      type: "updateNewStockNotificationFailed",
      payload: error.response.data.message,
    });
  }
};


export const getNewStockNotification = (shopId, newStock) => async (dispatch) => {
  try {
    dispatch({
      type: "getNewStockNotificationRequest"
    });

    const { data } = await axios.get(
      `${server}/notification/admin-new-stock-notifications`
    );
    dispatch({
      type: "getNewStockNotificationSuccess",
      payload: data.products
    });
  } catch (error) {
    dispatch({
      type: "getNewStockNotificationFailed",
      payload: error.response.data.message
    });
  }
};





export const updateShopStatus = (shopId, shopStatus) => async (dispatch) => {
  try {
    dispatch({ type: "updateShopStatusRequest" });

    const response = await axios.patch(
      `${server}/shopIsActive/shopIsActive`,
      { shopId, shopStatus }, // Send shopId and shopStatus in the request body
      { withCredentials: true }
    );

    dispatch({
      type: "updateShopStatusSuccess",
      payload: { shopStatus },
    });
  } catch (error) {
    dispatch({
      type: "updateShopStatusFailed",
      payload: error.response.data.message,
    });
  }
};


export const getNewShopStatus = (shopId, shopStatus) => async (dispatch) => {
  try {
    dispatch({
      type: "getNewShopStatusRequest"
    });

    const { data } = await axios.get(
      `${server}/shopIsActive/admin-shopIsActives`
    );
    dispatch({
      type: "getNewShopStatusSuccess",
      payload: data.products
    });
  } catch (error) {
    dispatch({
      type: "getNewShopStatusFailed",
      payload: error.response.data.message
    });
  }
};