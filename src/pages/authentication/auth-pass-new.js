// 3rd party modules
import { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// custom style components
import './auth-pass-new.css';
// custom functions components
import Validator from '../../scripts/validator.class';
// custom layouts components
import AuthLayout from '../../components/layout/auth-layout';
import AuthForm from '../../components/layout/auth-form';
// custom components
import TextInput from '../../components/form/auth-text-input';
import ServerContext from '../../store/server-context';


const NewPasswordPage = () => {

  const validator = new Validator();

  const server = useContext(ServerContext);

  const { token } = useParams();

  const navigate = useNavigate();

  const [userToken, setUserToken] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userPass, setUserPass] = useState();
  const [passConf, setPassConf] = useState();

  // 1. verify that the token is correct 
  useEffect(() => {
    const xhr = new XMLHttpRequest();

    xhr.onerror = () => console.log('URL token verification. Server not responding.');
    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        setUserToken(response.token);
        setUserEmail(response.email);
      } else navigate('/reset-password');
    };
    xhr.open('GET', server.domain + server.authenticationPassReset + '?token=' + token);
    xhr.send();
  }, []);

  // const clearError = () => {
  //   const errorElement = document.getElementById('new-password-form-error');
  //   if (errorElement.style.display === 'block') errorElement.style.display = 'none';
  // };

  const submit = () => {
    
    let isFormValid = true;
    let formData = {};
    
    const userPassError = document.getElementById('user-pass-error');
    const passConfError = document.getElementById('pass-conf-error');

    // user password validation
    try {
      if (!userPass || userPass.length === 0) throw 'Please enter your password.';
      else if (!validator.length(userPass, 8)) throw 'Password does not match requirements.';
      else if (!validator.upperLowerCase(userPass)) throw 'Password does not match requirements.';
      else if (!validator.numberSymbol(userPass)) throw 'Password does not match requirements.';
      else if (!validator.alphanumeric(userPass)) throw 'Password does not match requirements.';
      else formData.userPass = userPass;
    } catch (error) {
      userPassError.textContent = error;
      userPassError.style.display = 'block';
      isFormValid = false;
    }

    // password confirmation validation
    try {
      if (!passConf || passConf.length === 0) throw 'Please confirm your password.';
      else if (userPass !== passConf) throw 'Passwords are not the same.';
      else formData.passConf = passConf;
    } catch (error) {
      passConfError.textContent = error;
      passConfError.style.display = 'block';
      isFormValid = false;
    }

    formData.userToken = userToken;
    formData.userEmail = userEmail;

    return isFormValid ? formData : null;
  };

  return (
    <AuthLayout>
      <AuthForm id="new-password" action={server.userSetPassword} method="PATCH" data={submit}>
          <TextInput inputType="password" requirements={true} id="user-pass" name="userPass" placeholder="Password" onInput={setUserPass} />
          <TextInput inputType="password" id="pass-conf" name="passConf" placeholder="Confirm password" onInput={setPassConf} />
      </AuthForm>
    </AuthLayout>
  );
};

export default NewPasswordPage;