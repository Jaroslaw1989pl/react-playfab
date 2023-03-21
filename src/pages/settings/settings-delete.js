// 3rd party components
import { useContext, useState, useEffect, useRef } from 'react';
import { useLink, useNavigate } from 'react-router-dom';
// custom style components
import './settings-delete.css';
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


const SettingsDeleteUserPage = () => {
  // objects based on custom functions components
  const validator = new Validator();
  // useContext constans
  const serverContext = useContext(ServerContext);
  const userContext = useContext(UserContext)
  const flashContext = useContext(FlashMessageContext);
  // useNavigate constans
  const navigate = useNavigate();
  // useState constans for user authentication on page
  // const [isUserAuthenticated, setUserAuthenticationStatus] = useState(false);
  // const [user, setUser] = useState({});
  // useState constans for user actions on page
  const [userPass, setUserPass] = useState('');

  // useEffect(() => {
    
  //   const session = JSON.parse(localStorage.getItem('session'));

  //   const token = session ? session.token : '';
   
  //   const xhr = new XMLHttpRequest();      
        
  //   xhr.onerror = () => console.log('SettingsDeleteUserPage: POST Server not responding.');
  //   xhr.onload = () => {
  //     if (xhr.status === 200) {
  //       setUserAuthenticationStatus(true);
  //       setUser(JSON.parse(xhr.responseText));
  //     } else {
  //       setUserAuthenticationStatus(false);
  //       localStorage.removeItem('session');
  //       flash.add('error', 'Your session expired');
  //       navigate('/login');
  //     }
  //   }
  //   xhr.open('POST', server.domain + server.userGet);
  //   xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  //   xhr.setRequestHeader('Authorization', 'Bearer ' + token);
  //   xhr.send();
  // }, []);

  const submit = (event) => {
    
    event.preventDefault();

    const userPassError = document.getElementById('user-pass-error');

    let isFormValid = true;

    // user password validation
    try {
      if (!userPass || userPass.length === 0) throw 'Please confirm your password.';
      else if (!validator.length(userPass, 8)) throw 'Incorrect password.';
      else if (!validator.upperLowerCase(userPass)) throw 'Incorrect password.';
      else if (!validator.numberSymbol(userPass)) throw 'Incorrect password.';
      else if (!validator.alphanumeric(userPass)) throw 'Incorrect password.';
    } catch (error) {
      userPassError.textContent = error;
      userPassError.style.display = 'block';
      isFormValid = false;
    }

    if (isFormValid) {
      const xhr = new XMLHttpRequest();   
      xhr.onerror = () => console.log('SettingsDeleteUserPage: PATCH: ' + serverContext.userDelete + ' not responding.');
      xhr.onload = () => {
        console.log(xhr.responseText);
        const response = JSON.parse(xhr.responseText);
        if (response.code === 200) {
          userContext.clear();
          flashContext.add('success', 'Your user profile removed successfully.');
          navigate('/');
        } else {
          userPassError.textContent = response;
          userPassError.style.display = 'block';
        }
      }
      xhr.open('PATCH', serverContext.domain + serverContext.userDelete);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.send(`userEmail=${userContext.email}&userPass=${userPass}`);
    }    
  };
  
  return (
    <MainLayout>
      <SettingsForm id="delete" authentication={userContext.id.length > 0} user={userContext} customData={submit}>
        {/* custom form */}
        <TextInput inputType="password" id="user-pass" name="userPass" placeholder="Confirm password" onInput={setUserPass} />
        <input type="submit" className="settings-form-submit-btn" value="Send form" onClick={event => submit(event)} />
      </SettingsForm>
    </MainLayout>
  );
};

export default SettingsDeleteUserPage;