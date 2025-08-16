import "./App.scss";
import Homepage from "./Homepage.jsx";
import { Routes, Route } from "react-router-dom";
import VisualSearch from "./VisualSearch.jsx";
import Products from "./Products.jsx";
import ProductId from "./ProductId.jsx";
import Cart from "./Cart.jsx";
import Profile from "./Profile.jsx";
import Register from "./Register.jsx";
import Login from "./Login.jsx";
import Checkout from "./Checkout.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import OrderSuccess from "./OrderSuccess.jsx";
import UsersEditScreen from "./adminRoutes/UsersEditScreen.jsx";
import UsersListScreen from "./adminRoutes/UsersListScreen.jsx";
import AdminRoute from "./adminRoutes/AdminRoute.jsx";
import OrdersListScreen from "./adminRoutes/OrdersListScreen.jsx";
import OrdersEditScreen from "./adminRoutes/OrdersEditScreen.jsx";
import ProductsListScreen from "./adminRoutes/ProductsListScreen.jsx";
import ProductsEditScreen from "./adminRoutes/ProductsEditScreen.jsx";
import Men from "./publicRoutes/Men.jsx";
import Women from "./publicRoutes/Women.jsx";
import AdminDashboard from "./adminRoutes/AdminDashboard.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/visual-search" element={<VisualSearch />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/men" element={<Men />} />
        <Route path="/products/women" element={<Women />} />
        <Route path="/products/:id" element={<ProductId />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />
        <Route path="/order/:id" element={<OrderSuccess />} />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UsersListScreen />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users/:id"
          element={
            <AdminRoute>
              <UsersEditScreen />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders/:id"
          element={
            <AdminRoute>
              <OrdersEditScreen />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <OrdersListScreen />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <ProductsListScreen />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/product/:id/edit"
          element={
            <AdminRoute>
              <ProductsEditScreen />
            </AdminRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
