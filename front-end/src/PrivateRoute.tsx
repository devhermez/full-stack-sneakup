import { useContext, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

type PrivateRouteProps = {
  children: ReactNode;
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user } = useContext(AuthContext) as { user: any };

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;