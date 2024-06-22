import axios from "axios";
import { server } from "../../server";

export const createProduct =
  (
    name,
    description,
    category,
    subCategory,
    sleeveType,
    neckType,
    brand,
    color,
    fabric,
    occasion,
    fit,
    listing,
    startDate,
    endDate,
    gender,
    tags,
    ShopPrice,
    originalPrice,
    discountPrice,
    adminCreated,
    stock,
    size,
    quantity,
    shopId,
    images
  ) =>
  async (dispatch) => {
    try {
      dispatch({
        type: "productCreateRequest",
      });
      // Create an object with the data you want to send
      const { data } = await axios.post(
        `${server}/product/create-product`,
        name,
        description,
        tags,
        ShopPrice,
        originalPrice,
        discountPrice,
        stock,
        size,
        quantity,
        category,
        subCategory,
        neckType,
        sleeveType,
        brand,
        color,
        
        adminCreated,
        fabric,
        occasion,
        fit,
        listing,
        startDate,
        endDate,
        gender,
        shopId,
        images,
        // {
        //   withCredentials: true
        // }
      );
      dispatch({
        type: "productCreateSuccess",
        payload: data.product
      });
    } catch (error) {
      dispatch({
        type: "productCreateFail",
        payload: error.response.data.message
      });
    }
  };

// get All Products of a shop
export const getAllProductsShop = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsShopRequest"
    });

    const { data } = await axios.get(
      `${server}/product/get-all-products-shop/${id}`,
      
    );
    dispatch({
      type: "getAllProductsShopSuccess",
      payload: data.products
    });
  } catch (error) {
    dispatch({
      type: "getAllProductsShopFailed",
      payload: error.response.data.message
    });
  }
};

// delete product of a shop
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteProductRequest"
    });

    const { data } = await axios.delete(
      `${server}/product/delete-shop-product/${id}`,
      {
        withCredentials: true
      }
    );

    dispatch({
      type: "deleteProductSuccess",
      payload: data.message
    });
  } catch (error) {
    dispatch({
      type: "deleteProductFailed",
      payload: error.response.data.message
    });
  }
};

// get all products

export const getAllProducts = (queryParams) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsRequest"
    });

    const queryString = new URLSearchParams(queryParams).toString();
    const { data } = await axios.get(`${server}/product/get-all-products?${queryString}`);
    
    console.log("API Response:", data); // Add this line for debugging

    dispatch({
      type: "getAllProductsSuccess",
      payload: data.products
    });
  } catch (error) {
    console.log("API Error:", error); // Add this line for debugging

    dispatch({
      type: "getAllProductsFailed",
      payload: error.response.data.message
    });
  }
};

export const updateProductStock =
  (productId, size, quantity) => async (dispatch) => {
    try {
      dispatch({
        type: "updateProductStockRequest"
      });

      const { data } = await axios.patch(
        `${server}/product/seller-update-stock/${productId}`,
        {
          size,
          quantity
        },
        {
          withCredentials: true
        }
      );

      dispatch({
        type: "updateProductStockSuccess",
        payload: data.product
      });
    } catch (error) {
      dispatch({
        type: "updateProductStockFailed",
        payload: error.response.data.message
      });
    }
  };


  