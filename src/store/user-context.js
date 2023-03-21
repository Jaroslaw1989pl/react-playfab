// 3rd party modules
import { createContext, useContext, useEffect, useState } from 'react';
// custom context components
import FlashMessageContext from './flash-message-context';


const UserContext = createContext({
  id: '',
  name: '',
  nameUpdate: 0,
  email: '',
  emailUpdate: 0,
  passUpdate: 0,
  avatar: '',
  gold: 0,

  set: () => {},
  getUserData: () => {},
  clear: () => {}
});

export const UserContextProvider = (props) => {

  const userBlueprint = {
    id: '',
    name: '',
    nameUpdate: 0,
    email: '',
    emailUpdate: 0,
    passUpdate: 0,
    avatar: '',
    gold: 0
  }

  const flashContext = useContext(FlashMessageContext);

  const [userDataState, setUserDataState] = useState(userBlueprint);

  const setUserData = () => {
    const session = JSON.parse(localStorage.getItem('session'));

    if (session && userDataState.id.length === 0) {
      console.log('user context set');
      const xhr = new XMLHttpRequest();      

      xhr.onerror = () => console.log('UserContextProvider: POST: /api/user/get-user not responding.');
      xhr.onload = () => {
        if (xhr.status === 200) {
          setUserDataState(JSON.parse(xhr.responseText));
        } else {
          localStorage.removeItem('session');
          flashContext.add('error', 'Your session expired');
        }
      }
      xhr.open('POST', 'http://192.168.100.39/api/user/get-user');
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.setRequestHeader('Authorization', 'Bearer ' + session.token);
      xhr.send();
    }
  };

  const getUserData = () => {
    return new Promise((resolve, reject) => {
      const session = JSON.parse(localStorage.getItem('session'));

      if (session) {
        const xhr = new XMLHttpRequest();      
  
        xhr.onerror = () => console.log('UserContextProvider: POST: /api/user/get-user not responding.');
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          }
        }
        xhr.open('POST', 'http://192.168.100.39/api/user/get-user');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('Authorization', 'Bearer ' + session.token);
        xhr.send();
      }
    });
  };

  const clearUserData = () => {
    if (localStorage.getItem('session')) {
      localStorage.clear();
    }
    setUserDataState(userBlueprint);
  };

  const user = {
    id: userDataState.id,
    name: userDataState.name,
    nameUpdate: +userDataState.nameUpdate,
    email: userDataState.email,
    emailUpdate: +userDataState.emailUpdate,
    passUpdate: +userDataState.passUpdate,
    avatar: userDataState.avatar,
    gold: +userDataState.gold,
  
    set: setUserData,
    getUserData,
    clear: clearUserData
  };

  return <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
};

export default UserContext;