// 3rd party modules
import { useContext } from 'react';
// custom style components
import './auth-pass-reset.css';
// custom functions components
import Validator from '../../scripts/validator.class';
// custom layouts components
import AuthLayout from '../../components/layout/auth-layout';
import AuthForm from '../../components/layout/auth-form';
// custom components
import TextInput from '../../components/form/auth-text-input';
import ServerContext from '../../store/server-context';


const ResetPasswordPage = () => {

  const server = useContext(ServerContext);

  const clearError = () => {
    const errorElement = document.getElementById('reset-password-form-error');
    if (errorElement.style.display === 'block') errorElement.style.display = 'none';
  };

  const submit = () => {
    // form inputs
    const inputElement = document.getElementById('user-email');
    // form elements
    const errorElement = document.getElementById('reset-password-form-error');

    const validator = new Validator();

    try {
      if (inputElement.value === '') throw 'Please enter your email address.';
      else if (!validator.email(inputElement.value)) throw 'That\'s an invalid email.';
      else return {userEmail: inputElement.value};
    } catch (error) {
      errorElement.textContent = error;
      errorElement.style.display = 'block';
    }
  };

  return (
    <AuthForm>
      <AuthForm id="reset-password" action={server.authenticationPassReset} method="POST" data={submit}>
        <TextInput inputType="text" id="user-email" name="userEmail" placeholder="Email address" onInput={clearError}/>
      </AuthForm>
    </AuthForm>
  );
};

export default ResetPasswordPage;