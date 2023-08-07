import '../Styles/login.css';
import * as yup from 'yup';
import { ErrorMessage, Formik, Form, Field } from 'formik';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { ApiService } from '../Service/api';

let notify = null;

const Register = ({ logado = false }) => {
  const [isActive, setIsActive] = useState(false);
  const [values, setValues] = useState({
    name: "",
    company: "",
    email: "",
    password: "",
    confirmation: "",
  })

  const handleRegister = async (values) => {
    notify = toast.loading('Loading...');
    const data = {
      name: values.name,
      company: values.company,
      email: values.email.toLowerCase(),
      password: values.password
    }

    ApiService.register(data).then((res) => {
      notify = null;
      if (res.data.code === 106) {
        window.location.href = '/';
      }
      if (res.status === 200) {
        toast(res.data.msg, {
          position: 'bottom-right',
          id: notify, // Custom Icon
          icon: '👏',
        });
        setTimeout(() => {
          window.location.href = "/"
        }, 3000)
      }
    }).catch(err => {
      notify = null;
      console.log(err);
    });
  };

  const validationsRegister = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(8, 'The password must be at least 8 characters long').required('The password is mandatory'),
    confirmation: yup.string().oneOf([yup.ref('password'), null], 'Passwords are different').required('Password confirmation is required'),
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
      <Toaster />
      <div className="box">
        <div className="square" />
        <div className="square" />
        <div className="square" />
        <div className="square" />
        <div className="square" />
        <div className="square" />
        <div className="container">
          <div className="form">
            <h2>Register</h2>
            <Formik initialValues={values} onSubmit={handleRegister} validationSchema={validationsRegister}
              values={values}>
              <Form className="login-form">
                <div className="inputBx">
                  <span className="spanInput">Name</span>
                  <Field name="name" type="name" className="inputBox" />
                  <ErrorMessage component="span" name="name" className="form-error" />
                </div>
                <div className="inputBx">
                  <span className="spanInput">Email</span>
                  <Field name="email" type="email" className="inputBox" />
                  <ErrorMessage component="span" name="email" className="form-error" />
                </div>
                <div className="inputBx">
                  <span className="spanInput">Company</span>
                  <Field name="company" type="company" className="inputBox" />
                  <ErrorMessage component="span" name="company" className="form-error" />
                </div>
                <div className="inputBx password">
                  <span className="spanInput" form="email">
                    Password
                  </span>
                  <Field name="password" type="password" className="inputBox" id="password-input" />
                  <a href='#' className={isActive ? 'password-control view' : 'password-control'} onClick={(event) => show_hide_password(event, 100)}>
                  </a>
                  <ErrorMessage component="span" name="password" className="form-error" />
                </div>
                <div className="inputBx password">
                  <span className="spanInput">Confirm Password</span>
                  <Field name="confirmation" type="password" className="inputBox" id="password-input" />
                  <ErrorMessage component="span" name="confirmation" className="form-error" />
                </div>
                <div className="inputBx">
                  <input type="submit" value="Sign up" />
                </div>
              </Form>
            </Formik>
            <p>Do have an account {!logado && <Link to="/">Sign in</Link>}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
