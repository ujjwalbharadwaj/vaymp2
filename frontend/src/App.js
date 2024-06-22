import React, { useEffect, useState } from "react";
import "./App.css";
import SearchResults from "./pages/SearchResults.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  LoginPage,
  SignupPage,
  ActivationPage,
  HomePage,
  ProductsPage,
  BestSellingPage,
  EventsPage,
  FAQPage,
  CheckoutPage,
  PaymentPage,
  OrderSuccessPage,
  ProductDetailsPage,
  ProfilePage,
  ShopCreatePage,
  SellerActivationPage,
  ShopLoginPage,
  OrderDetailsPage,
  TrackOrderPage,
  UserInbox,
  AllOrders,
  Address,
  AllRefundOrders,
  TrackOrderr,
  AllCoupons,
  ForgotPassword,
  PasswordReset
} from "./routes/Routes.js";
import {
  ShopDashboardPage,
  ShopCreateProduct,
  ShopAllProducts,
  ShopCreateEvents,
  ShopAllEvents,
  ShopAllCoupouns,
  ShopPreviewPage,
  ShopPreviewPageForShop,
  ShopAllOrders,
  ShopOrderDetails,
  ShopAllRefunds,
  ShopSettingsPage,
  ShopWithDrawMoneyPage,
  ShopInboxPage,
} from "./routes/ShopRoutes";
import {
  AdminDashboardPage,
  AdminDashboardUsers,
  AdminDashboardSellers,
  AdminDashboardOrders,
  AdminDashboardProducts,
  AdminDashboardEvents,
  AdminDashboardWithdraw,
  AdminDashboardAllOrders,
  AdminDashboardRefund,
  AdminDashboardAllReturn,
  AdminDashboardUndeliveredItems,
  AdminDashboardStockNotification,
  AdminDashboardShopIsActive
} from "./routes/AdminRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Store from "./redux/store";
import { loadSeller, loadUser } from "./redux/actions/user";
import ProtectedRoute from "./routes/ProtectedRoute";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";
import { ShopHomePage } from "./ShopRoutes.js";
import SellerProtectedRoute from "./routes/SellerProtectedRoute";
import { getAllProducts } from "./redux/actions/product";
import { getAllEvents } from "./redux/actions/event";
import axios from "axios";
import { server } from "./server";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ShopsPage from "./pages/Shop/ShopsPage.jsx";
import TrackOrder from "./components/Profile/TrackOrder.jsx";
import ShopResetPassword from "./components/Shop/ShopResetPassword.jsx";
import ShopForgotPassword from "./components/Shop/ShopForgotPassword.jsx";
// import AllOrders from "./pages/AllOrders.jsx";

const App = () => {
  const [stripeApikey, setStripeApiKey] = useState("");

  async function getStripeApikey() {
    const { data } = await axios.get(`${server}/payment/stripeapikey`);
    setStripeApiKey(data.stripeApikey);
  }
  useEffect(() => {
    Store.dispatch(loadUser());
    Store.dispatch(loadSeller());
    Store.dispatch(getAllProducts());
    Store.dispatch(getAllEvents());
    getStripeApikey();
  }, []);

  return (
    <BrowserRouter>
      {stripeApikey && (
        <Elements stripe={loadStripe(stripeApikey)}>
          <Routes>
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Elements>
      )}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<PasswordReset />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route
          path="/activation/:activation_token"
          element={<ActivationPage />}
        />
        <Route
          path="/seller/activation/:activation_token"
          element={<SellerActivationPage />}
        />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/best-selling" element={<BestSellingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/shop" element={<ShopsPage />} />

          <Route 
          path="/search/:query" 
          element={<SearchResults />}
          />
          
          <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route path="/order/success" element={<OrderSuccessPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inbox"
          element={
            <ProtectedRoute>
              <UserInbox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <AllOrders />
            </ProtectedRoute>
          }
          />
         <Route
          path="/Address"
          element={
            <ProtectedRoute>
              <Address />
            </ProtectedRoute>
          }
        />
         <Route
          path="/Refund"
          element={
            <ProtectedRoute>
              <AllRefundOrders />
            </ProtectedRoute>
          }
        />
         <Route
          path="/Track"
          element={
            <ProtectedRoute>
              <TrackOrderr/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/order/:id"
          element={
            <ProtectedRoute>
              <OrderDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/track/order/:id"
          element={
            <ProtectedRoute>
              <TrackOrderPage />
            </ProtectedRoute>
          }
        />
        <Route path="/shop/preview/:id" element={<ShopPreviewPage />} />
        <Route path="/shop/detail/:id" element={<ShopPreviewPageForShop />} />

        {/* shop Routes */}
        <Route path="/shop-create" element={<ShopCreatePage />} />
        <Route path="/shop-login" element={<ShopLoginPage />} />
        <Route 
              path="/shop-password/reset/:token"
              element={<ShopResetPassword />}
            />
        <Route 
              path="/shop-forgot-password"
              element={<ShopForgotPassword />}
            />
        <Route
          path="/shop/:id"
          element={
            <SellerProtectedRoute>
              <ShopHomePage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <SellerProtectedRoute>
              <ShopSettingsPage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <SellerProtectedRoute>
              <ShopDashboardPage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-create-product/:id"
          element={
            <ProtectedAdminRoute>
              <ShopCreateProduct />
             </ProtectedAdminRoute>
          }
        />
        <Route
          path="/dashboard-orders"
          element={
            <SellerProtectedRoute>
              <ShopAllOrders />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-refunds"
          element={
            <SellerProtectedRoute>
              <ShopAllRefunds />
            </SellerProtectedRoute>
          }
        />

        <Route
          path="/order/:id"
          element={
            <SellerProtectedRoute>
              <ShopOrderDetails />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-products"
          element={
            <SellerProtectedRoute>
              <ShopAllProducts />
              </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-create-event/:id"
          element={
            <ProtectedAdminRoute>
              <ShopCreateEvents />
            </ProtectedAdminRoute>
          }
          />
         <Route
          path="/dashboard-create-coupan/:id"
          element={
            <ProtectedAdminRoute>
            <AllCoupons/>
              {/* <ShopCreateEvents /> */}
            </ProtectedAdminRoute>
            // <AllCoupons/>

          }
        />
        <Route
          path="/dashboard-events"
          element={
            <SellerProtectedRoute>
              <ShopAllEvents />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-coupouns"
          element={
            <SellerProtectedRoute>
              <ShopAllCoupouns />
            </SellerProtectedRoute>
          }
        />
         <Route
          path="/admin-dashboard-coupouns"
          element={
<ProtectedAdminRoute>
              <ShopAllCoupouns />
</ProtectedAdminRoute>

          }
        />
        <Route
          path="/dashboard-withdraw-money"
          element={
            <SellerProtectedRoute>
              <ShopWithDrawMoneyPage />
            </SellerProtectedRoute>
          }
        />
        
        <Route
          path="/dashboard-messages"
          element={
            <ProtectedAdminRoute>
              <UserInbox />
            </ProtectedAdminRoute>
          }
        />
        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/dashboard-new-stock-notification"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardStockNotification />
            </ProtectedAdminRoute>
          }
          />
          <Route
          path="/dashboard-shop-not-active"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardShopIsActive />
            </ProtectedAdminRoute>
          }
          />
        <Route
          path="/admin-users"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardUsers />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin-sellers"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardSellers />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin-orders"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardOrders />
            </ProtectedAdminRoute>
          }
        />
         <Route
          path="/admin-products"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardProducts />
            </ProtectedAdminRoute>
          }
        />
         <Route
          path="/admin-events"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardEvents />
            </ProtectedAdminRoute>
          }
        />
         <Route
          path="/admin-withdraw-request"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardWithdraw />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin-all-orders"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardAllOrders />
            </ProtectedAdminRoute>
          }
        />
         <Route
          path="/return-all-orders"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardAllReturn />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/undelivered-order"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardUndeliveredItems />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin-refund-request"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardRefund />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
};

export default App;
