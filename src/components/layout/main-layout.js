// 3rd party components
import { useContext } from 'react';
// custom layouts components
import TopBar from './top-bar';
import FlashMessage from './flash-message';
// custom components
import FlashMessageContext from '../../store/flash-message-context';
// costom style components
import './main-layout.css';


const MainLayout = (props) => {

  const flash = useContext(FlashMessageContext);

  return (
    <>
      {/* <TopBar auth={props.authentication} user={props.user}/> */}
      <TopBar />

      <ul id="flash-messages-list">
        {flash.messages.map((message, index) => <FlashMessage key={index} type={message.type} text={message.text}/>)}
      </ul>
      
      <div id="page-content">
        {props.children}
      </div>
    </>
  );
};

export default MainLayout;