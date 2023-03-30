// 3rd party components
import { useContext, useState, useEffect } from 'react';
// custom style components
import './auth-registration.css';
// custom functions components
import Validator from '../../scripts/validator.class';
// custom layouts components
import AuthLayout from '../../components/layout/auth-layout';
import AuthForm from "../../components/layout/auth-form";
// custom components
import TextInput from '../../components/form/auth-text-input';
import AvatarCheckbox from '../../components/form/auth-checkbox-input';
import ServerContext from '../../store/server-context';


const RegistrationPage = () => {

  // clear all existing sessions
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('session'));
    if (session) localStorage.clear();
  }, []);

  const validator = new Validator();
  
  const server = useContext(ServerContext);
  
  const [avatar, setAvatar] = useState();
  const [username, setUsername] = useState();
  const [isUsernameUnique, setIsUsernameUnique] = useState(true);
  const [userEmail, setUserEmail] = useState();
  const [isUserEmailUnique, setIsUserEmailUnique] = useState(true);
  const [userPass, setUserPass] = useState();
  const [passConf, setPassConf] = useState();

  const usernameValidation = (value) => {

    const uniquenessRequirement = document.getElementById('user-name-uniqueness');

    setUsername(value);

    validator.uniqueness(server.domain + server.authenticationFindUser + '?name=' + value)
    .then(result => {
      if (value && JSON.parse(result).userExists) {
        uniquenessRequirement.style.color = '#7e7e7e';
        setIsUsernameUnique(false);
      } else {
        uniquenessRequirement.style.color = 'green';
        setIsUsernameUnique(true);
      }
    })
    .catch(error => console.log(error));
  };

  const emailValidation = (value) => {

    const userEmailError = document.getElementById('user-email-error');

    setUserEmail(value);

    validator.uniqueness(server.domain + server.authenticationFindUser + '?email=' + value)
    .then(result => {
      if (JSON.parse(result).userExists) {
        userEmailError.textContent = 'Email address already in use.';
        userEmailError.style.display = 'block';
        setIsUserEmailUnique(false);
      } else setIsUserEmailUnique(true);
    })
    .catch(error => console.log(error));
  };

  const submit = () => {
    
    let isFormValid = true;
    let formData = {};
    
    const avatarError = document.getElementById('user-avatar-error');
    const usernameError = document.getElementById('user-name-error');
    const userEmailError = document.getElementById('user-email-error');
    const userPassError = document.getElementById('user-pass-error');
    const passConfError = document.getElementById('pass-conf-error');

    // avatar validation
    if (!avatar) {
      avatarError.style.display = 'block';
      isFormValid = false;
    } else {
      formData.avatar = avatar;
    }

    // username validation
    try {
      if (!username || username.length === 0) throw 'Please enter your username.';
      else if (!validator.length(username, 3, 24)) throw 'The username should contains between 3 and 24 characters.';
      else if (!validator.alphanumeric(username)) throw 'The username can only contain Latin letters, numbers and underscore.';
      else if (isUsernameUnique === false) throw 'Username already in use.';
      else formData.username = username;
    } catch (error) {
      usernameError.textContent = error;
      usernameError.style.display = 'block';
      isFormValid = false;
    }

    // email address validation
    try {
      if (!userEmail || userEmail.length === 0) throw 'Please enter your email.';
      else if (!validator.email(userEmail)) throw 'Incorrect email address.';
      else if (isUserEmailUnique === false) throw 'Email address already in use.';
      else formData.userEmail = userEmail;
    } catch (error) {
      userEmailError.textContent = error;
      userEmailError.style.display = 'block';
      isFormValid = false;
    }

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

    return isFormValid ? formData : null;
  };

  return (
    <AuthLayout>
      <AuthForm id="registration" action={server.authenticationRegisterUser} method="POST" data={submit}>
        <div className="form-left">
          <AvatarCheckbox isInputHidden={false} registration={true} onClick={setAvatar}/>
        </div>
        <div className="form-right">
          <TextInput inputType="text" requirements={true} id="user-name" name="username" placeholder="Username" onInput={usernameValidation} />
          <TextInput inputType="text" id="user-email" name="userEmail" placeholder="Email address" onInput={emailValidation} />
          <TextInput inputType="password" requirements={true} id="user-pass" name="userPass" placeholder="Password" onInput={setUserPass} />
          <TextInput inputType="password" id="pass-conf" name="passConf" placeholder="Confirm password" onInput={setPassConf} />
        </div>
      </AuthForm>
    </AuthLayout>
  );
};

export default RegistrationPage;