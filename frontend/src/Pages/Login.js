import '../Styles/login.css';
import * as yup from 'yup';
import { ErrorMessage, Formik, Form, Field } from 'formik';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { ApiService } from '../Service/api';
// require('../module/t.js')
let notify = null;

const Login = ({ logado = false }) => {

  const [isActive, setIsActive] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: ""
  })

  const handleLogin = (values) => {
    notify = toast.loading('Loading...');
    const data = {
      email: values.email.toLowerCase(),
      password: values.password
    }

    ApiService.login(data).then((res) => {
      notify = null;
      if (res.data.code === 201) {
        setValues({
          email: "",
          password: "",
          user: {}
        })
      }

      if (res.status === 200) {
        localStorage.setItem("@user", JSON.stringify(res.data.user.email));
        window.location.reload();
        toast(res.data.msg, {
          position: 'bottom-right',
          id: notify, // Custom Icon
          icon: '👏',
        });
      } else {
        toast(res.data.msg, { position: 'bottom-right' });
      }
    }).catch(err => {
      notify = null;
      console.log(err);
    });
  }

  const validationsLogin = yup.object().shape({
    email: yup.string().min(5, 'invalid email').required('Email is required'),
    password: yup.string().min(8, 'The password must be at least 8 characters long').required('The password is required'),
  });

  const show_hide_password = (target) => {
    var input = document.getElementById('password-input');
    if (input.getAttribute('type') === 'password') {
      setIsActive((current) => !current);
      input.setAttribute('type', 'text');
    } else {
      setIsActive((current) => !current);
      input.setAttribute('type', 'password');
    }
    return false;
  };

  return (
    <section>
      <div className="box">
        <div className="square" />
        <div className="square" />
        <div className="square" />
        <div className="square" />
        <div className="square" />
        <div className="square" />
        <div className="container">
          <div className="form">
            <h2>LOGIN</h2>
            <Formik initialValues={values} onSubmit={handleLogin} validationSchema={validationsLogin}>
              <Form className="LoginForm">
                <div className="inputBx">
                  <span className="spanInput">Email</span>
                  <Field name="email" type="username" className="inputBox" autoComplete="username" />
                  <ErrorMessage component="span" name="email" className="form-error" />
                </div>
                <div className="inputBx password">
                  <span className="spanInput">Password</span>
                  <Field name="password" type="password" className="inputBox" id="password-input" />
                  <a href="#"
                    className={isActive ? 'password-control view' : 'password-control'}
                    onClick={(event) => show_hide_password(event, 100)}></a>
                  <ErrorMessage component="span" name="password" className="form-error" />
                </div>
                <div className="inputBx">
                  <input type="submit" value="Login" />
                </div>
              </Form>
            </Formik>
            <p>Don't have an account {!logado && <Link to="/register">Sign up</Link>}</p>
          </div>
        </div>
      </div>
      <Toaster />
    </section>
  );
};

export default Login;
