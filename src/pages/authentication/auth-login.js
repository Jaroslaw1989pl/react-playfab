// 3rd party components
import { useContext, useState, useEffect } from 'react';
// custom style components
import './auth-login.css';
// custom functions components
import Validator from '../../scripts/validator.class';
// custom layouts components
import AuthLayout from '../../components/layout/auth-layout';
// custom context components
import ServerContext from '../../store/server-context';
// custom components
import AuthForm from "../../components/layout/auth-form";
import TextInput from '../../components/form/auth-text-input';


const LoginPage = () => {

  const serverContext = useContext(ServerContext);

  // clear all existing sessions
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('session'));
    if (session) localStorage.clear();
  }, []);

  const submit = () => {

    let isFormValid = true;
    let formData = {};

    // form inputs
    const emailInput = document.getElementById('user-email');
    const passInput = document.getElementById('user-pass');
    // form elements
    const errorElement = document.getElementById('login-form-error');

    const validator = new Validator();

    // try {
    //   if (emailInput.value === '' && passInput.value === '') throw 'Please enter your\'s credentials.';
    //   else if (emailInput.value === '' || passInput.value === '') throw 'Incorrect user email or password.';
    //   else if (!validator.email(emailInput.value)) throw 'Incorrect user email or password.';
    //   else {
        formData.userEmail = emailInput.value;
        formData.userPass = passInput.value;
    //   }
    // } catch (error) {
    //   errorElement.textContent = error;
    //   errorElement.style.display = 'block';
    //   isFormValid = false;
    // }

    return isFormValid ? formData : null;
  };
  
  return (
    <AuthLayout>
      <AuthForm id="login" action={serverContext.authenticationLoginUser} method="POST" data={submit}>
        <TextInput inputType="text" id="user-email" name="userEmail" placeholder="Email address" />
        <TextInput inputType="password" id="user-pass" name="userPass" placeholder="Password" />
      </AuthForm>
    </AuthLayout>
  );
};

export default LoginPage;