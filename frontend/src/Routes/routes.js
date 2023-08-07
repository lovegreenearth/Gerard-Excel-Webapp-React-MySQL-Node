import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Login from '../Pages/Login';
import Dashboard from '../Pages/Dashboard';
import Register from '../Pages/Register';
import PageNotFound from '../Pages/PageNotFound';

const Rotas = () => {
  const [loggedUser, setLoggedUser] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("@user");
    setLoggedUser(user);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {loggedUser && <Route path="/" exact element={<Dashboard />} />}
        <Route path="*" element={<PageNotFound />} />
        {!loggedUser && <Route path="/" element={<Login />} />}
        {!loggedUser && <Route path="/register" element={<Register />} />}
      </Routes>
    </BrowserRouter>
  );
};

export default Rotas;