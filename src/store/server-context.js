// 3rd party modules
import { createContext } from "react";


const ServerContext = createContext();

export const ServerContextProvider = (props) => {

  const server = {
    // domain: 'http://playfab-game-php-server',
    domain: 'http://localhost:8080',
    authenticationFindUser: '/api/authentication/user-find',
    authenticationRegisterUser: '/api/authentication/user-add',
    authenticationLoginUser: '/api/authentication/user-login',
    authenticationLogout: '/api/authentication/user-logout',
    authenticationPassReset: '/api/authentication/pass-reset',
    authenticationEmailCode: '/api/authentication/email-code',
    authenticationConfirmCode: '/api/authentication/confirm-code',

    userGet: '/api/user/get-user',
    userSetPassword: '/api/user/set-password',
    userUpdatePassword: '/api/user/update-password',
    userSetAvatar: '/api/user/set-avatar',
    userSetUsername: '/api/user/set-username',
    userSetEmail: '/api/user/set-email',
    userDelete: '/api/user/delete'
  };

  return <ServerContext.Provider value={server}>{props.children}</ServerContext.Provider>;
};

export default ServerContext;