// 3rd party components
import { useContext } from 'react';
// custom layouts components
import FlashMessage from './flash-message';
// custom components
import FlashMessageContext from '../../store/flash-message-context';


const AuthLayout = (props) => {

  const flash = useContext(FlashMessageContext);

  return (
    <>
      <ul id="flash-messages-list" className="auth-flash-messages">
        {flash.messages.map((message, index) => <FlashMessage key={index} type={message.type} text={message.text}/>)}
      </ul>

      {props.children}
    </>
  );
};

export default AuthLayout;