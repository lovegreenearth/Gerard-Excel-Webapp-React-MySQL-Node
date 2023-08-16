import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Login from '../Pages/Auth/Login';
import Dashboard from '../Pages/Dashboard';
import Register from '../Pages/Auth/Register';
import AddProduct from '../Pages/Product/AddProduct';

const Rotas = () => {
  const [loggedUser, setLoggedUser] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("@user");
    setLoggedUser(user);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {
          loggedUser ?
            <>
              <Route path="/" exact element={<Dashboard />} />
              <Route path="/product/add" element={<AddProduct />} />
              <Route path="/product/edit/:id" element={<AddProduct />} />
              <Route path="/product/view/:id" element={<AddProduct />} />
            </> :
            <>
              <Route path="/" exact element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </>
        }
      </Routes>
    </BrowserRouter>
  );
};

export default Rotas;