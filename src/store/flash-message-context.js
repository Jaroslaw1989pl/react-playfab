// 3rd party modules
import { createContext, useState } from "react";


const FlashMessageContext = createContext({
  messages: [],
  totalMessages: 0,
  add: (type, text) => {},
  remove: () => {}
});

export const FlashMessageContextProvider = (props) => {

  const [messages, setMessages] = useState([]);

  const addMessageHendler = (type, text) => {
    setMessages(previousMessages => previousMessages.concat({type, text}));
  };

  const removeMessageHendler = (messages) => {
    setMessages(previousMessages => {
      return previousMessages.filter((message, index) => index > 0);
    });
  };

  const flash = {
    messages: messages,
    totalMessages: messages.length,
    add: addMessageHendler,
    remove: removeMessageHendler
  };

  return <FlashMessageContext.Provider value={flash}>{props.children}</FlashMessageContext.Provider>;
};

export default FlashMessageContext;