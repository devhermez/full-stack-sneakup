import "./App.scss";
import { Routes, Route } from "react-router-dom";

import Homepage from "./publicRoutes/Homepage";
import VisualSearch from "./publicRoutes/VisualSearch";
import Products from "./publicRoutes/Products";
import ProductId from "./publicRoutes/ProductId";
import Cart from "./publicRoutes/Cart";
import Profile from "./publicRoutes/Profile";
import Register from "./publicRoutes/Register";
import Login from "./publicRoutes/Login";
import Checkout from "./publicRoutes/Checkout";
import PrivateRoute from "./PrivateRoute";
import OrderSuccess from "./publicRoutes/OrderSuccess";

import UsersEditScreen from "./adminRoutes/UsersEditScreen";
import UsersListScreen from "./adminRoutes/UsersListScreen";
import AdminRoute from "./adminRoutes/AdminRoute";
import OrdersListScreen from "./adminRoutes/OrdersListScreen";
import OrdersEditScreen from "./adminRoutes/OrdersEditScreen";
import ProductsListScreen from "./adminRoutes/ProductsListScreen";
import ProductsEditScreen from "./adminRoutes/ProductsEditScreen";
import Men from "./publicRoutes/Men";
import Women from "./publicRoutes/Women";
import AdminDashboard from "./adminRoutes/AdminDashboard";

const App = () => {
  return (
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
  );
};

export default App;