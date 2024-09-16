import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import { getItem } from "./utils/storage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";

const ProtectRoutes = ({ redirectTo }) => {
  const isAuthenticated = getItem("token");
  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />;
};

const ProjectRoutes = () => {
  return (
    <Routes>
      <Route path='/'>
        <Route path='/' element={<Login />}></Route>
        <Route path='/login' element={<Login />}></Route>
      </Route>

      <Route path='/sign-up' element={<SignUp />}></Route>

      <Route element={<ProtectRoutes redirectTo='/' />}>
        <Route path='/home' element={<Home />}></Route>
      </Route>

      <Route path='*' element={<h1>404 - Not Found</h1>} />
    </Routes>
  );
};

export default ProjectRoutes;
