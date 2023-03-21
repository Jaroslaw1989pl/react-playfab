// 3rd party components
import { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// custom style components
import './settings-password.css';
// custom functions components
import Validator from '../../scripts/validator.class';
// custom layouts components
import MainLayout from '../../components/layout/main-layout';
import SettingsForm from '../../components/layout/settings-form';
import TextInput from '../../components/form/auth-text-input';
// custom context components
import ServerContext from '../../store/server-context';
import UserContext from '../../store/user-context';
import FlashMessageContext from '../../store/flash-message-context';


const SettingsEmailPassword = () => {
  // objects based on custom functions components
  const validator = new Validator();
  // useContext constans
  const serverContext = useContext(ServerContext);
  const userContext = useContext(UserContext);
  const flash = useContext(FlashMessageContext);
  // useNavigate constans
  const navigate = useNavigate();
  // useRef constans
  const formError = useRef();
  // useState constans for user actions on page
  const [newUserPass, setNewUserPass] = useState('');
  const [newUserPass2, setNewUserPass2] = useState('');
  const [oldUserPass, setOldUserPass] = useState('');

  const submit = (event) => {
    
    event.preventDefault();

    const newUserPassError = document.getElementById('user-pass-error');
    const newUserPass2Error = document.getElementById('user-pass-2-error');
    const oldUserPassError = document.getElementById('old-user-pass-error');
    const newPassFormError = document.getElementById('new-password-form-error');

    let isFormValid = true;

    // new user password validation
    try {
      if (!newUserPass || newUserPass.length === 0) throw 'Please enter your password.';
      else if (!validator.length(newUserPass, 8)) throw 'Password does not match requirements.';
      else if (!validator.upperLowerCase(newUserPass)) throw 'Password does not match requirements.';
      else if (!validator.numberSymbol(newUserPass)) throw 'Password does not match requirements.';
      else if (!validator.alphanumeric(newUserPass)) throw 'Password does not match requirements.';
    } catch (error) {
      newUserPassError.textContent = error;
      newUserPassError.style.display = 'block';
      isFormValid = false;
    }

    // new password confirmation
    try {
      if (!newUserPass2 || newUserPass2.length === 0) throw 'Please confirm your password.';
      else if (newUserPass !== newUserPass2) throw 'Passwords are not the same.';
    } catch (error) {
      newUserPass2Error.textContent = error;
      newUserPass2Error.style.display = 'block';
      isFormValid = false;
    }

    // old user password validation
    try {
      if (!oldUserPass || oldUserPass.length === 0) throw 'Incorrect password.';
      else if (!validator.length(oldUserPass, 8)) throw 'Incorrect password.';
      else if (!validator.upperLowerCase(oldUserPass)) throw 'Incorrect password.';
      else if (!validator.numberSymbol(oldUserPass)) throw 'Incorrect password.';
      else if (!validator.alphanumeric(oldUserPass)) throw 'Incorrect password.';
    } catch (error) {
      oldUserPassError.textContent = error;
      oldUserPassError.style.display = 'block';
      isFormValid = false;
    }

    if (isFormValid) {
      const xhr = new XMLHttpRequest();   
      xhr.onerror = () => console.log('SettingsNewPasswordPage: POST Server not responding.');
      xhr.onload = () => {
        console.log(xhr.responseText);
        const response = JSON.parse(xhr.responseText);
        if (response.code === 200) {
          // dodać:
          // userContext.passUpdate = 
          flash.add('success', 'Password updated successfully.');
          navigate('/settings');
        } else {
          newPassFormError.textContent = response.message;
          newPassFormError.style.display = 'block';
        }
      }
      xhr.open('PATCH', serverContext.domain + serverContext.userUpdatePassword);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.send(`userEmail=${userContext.email}&newPass=${newUserPass}&newPass2=${newUserPass2}&oldPass=${oldUserPass}`);
    }
  };
  
  return (
    <MainLayout>
      <SettingsForm id="password" authentication={userContext.id.length > 0} user={userContext} customData={submit}>
        {/* custom form */}
        <p id={'new-password-form-error'} className="form-error" ref={formError}></p>
        <TextInput inputType="password" requirements={true} id="user-pass" name="newUserPass" placeholder="New password" onInput={setNewUserPass} />
        <TextInput inputType="password" id="user-pass-2" name="newUserPass2" placeholder="Confirm new password" onInput={setNewUserPass2} />
        <TextInput inputType="password" id="old-user-pass" name="oldUserPass" placeholder="Confirm password" onInput={setOldUserPass} />
        <input type="submit" className="settings-form-submit-btn" value="Send form" onClick={event => submit(event)} />
      </SettingsForm>
    </MainLayout>
  );
};

export default SettingsEmailPassword;