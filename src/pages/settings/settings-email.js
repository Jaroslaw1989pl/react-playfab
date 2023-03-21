// 3rd party components
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// custom style components
import './settings-email.css';
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


const SettingsEmailPage = () => {
  // objects based on custom functions components
  const validator = new Validator();
  // useContext constans
  const serverContext = useContext(ServerContext);
  const userContext = useContext(UserContext)
  const flash = useContext(FlashMessageContext);
  // useNavigate constans
  const navigate = useNavigate();
  // useState constans for user authentication on page
  // const [isUserAuthenticated, setUserAuthenticationStatus] = useState(false);
  // const [user, setUser] = useState({});
  // useState constans for user actions on page
  const [newEmail, setNewEmail] = useState('');
  const [userPass, setUserPass] = useState('');

  // useEffect(() => {
    
  //   const session = JSON.parse(localStorage.getItem('session'));

  //   const token = session ? session.token : '';
   
  //   const xhr = new XMLHttpRequest();      
        
  //   xhr.onerror = () => console.log('SettingsEmailPage: POST Server not responding.');
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

    const newEmailError = document.getElementById('new-email-error');
    const userPassError = document.getElementById('user-pass-error');
    
    if (newEmail.length === 0) {
      newEmailError.textContent = 'Please enter new email address.';
      newEmailError.style.display = 'block';
    } else if (!validator.email(newEmail)) {
      newEmailError.textContent = 'Incorrect email address.';
      newEmailError.style.display = 'block';
    } else {
      if (userPass.length === 0) {
        userPassError.textContent = 'Please confirm your password.';
        userPassError.style.display = 'block';
      } else {
        validator.uniqueness(serverContext.domain + serverContext.authenticationFindUser + '?email=' + newEmail)
        .then(result => {
          if (JSON.parse(result).userExists) {
            newEmailError.textContent = 'Email address already in use.';
            newEmailError.style.display = 'block';
          } else {
            const xhr = new XMLHttpRequest();   
            xhr.onerror = () => console.log('SettingsNewEmailPage: PATCH ' + serverContext.userSetEmail + ' not responding.');
            xhr.onload = () => {
              const response = JSON.parse(xhr.responseText);
              if (response.code === 200) {
                userContext.email = newEmail;
                // dodać:
                // userContext.emailUpdate = 
                flash.add('success', 'Username updated successfully.');
                navigate('/settings');
              } else {

              }
            }
            xhr.open('PATCH', serverContext.domain + serverContext.userSetEmail);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(`userEmail=${userContext.email}&newEmail=${newEmail}&userPass=${userPass}`);
          }
        })
        .catch(error => console.log(error));
      }
    }
  };
  
  return (
    <MainLayout>
      <SettingsForm id="email" authentication={userContext.id.length > 0} user={userContext} customData={submit}>
        {/* custom form */}
        <TextInput inputType="text" id="new-email" name="newEmail" placeholder="Email address" onInput={setNewEmail} />
        <TextInput inputType="password" id="user-pass" name="userPass" placeholder="Confirm password" onInput={setUserPass} />
        <input type="submit" className="settings-form-submit-btn" value="Send form" onClick={event => submit(event)} />
      </SettingsForm>
    </MainLayout>      
  );
};

export default SettingsEmailPage;