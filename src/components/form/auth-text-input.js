// 3rd party components
import { useRef } from "react";
// custom style components
import './auth-text-input.css';
// custom functions components
import Validator from '../../scripts/validator.class';


// text input
const TextInput = (props) => {

  const validator = new Validator();
  
  const clearError = () => {
    const inputError = document.getElementById(props.id + '-error');
    if (inputError.style.display === 'block') inputError.style.display = 'none';
    // wymaga poprawy: zapisanie elementu do zmiennej bez wywoływanie błedu
    if (document.querySelector('.form-error') && document.querySelector('.form-error').style.display === 'block') 
      document.querySelector('.form-error').style.display = 'none';
  };

  const showRequirements = () => {
    if (props.requirements) document.getElementById(props.id + '-requirements').style.display = 'block';
  };
  const hideRequirements = () => {
    if (props.requirements) document.getElementById(props.id + '-requirements').style.display = 'none';
  };

  if (props.inputType === 'text') {

    // username requirements references
    const lengthRule = useRef();
    const alphanumericRule = useRef();

    const usernameValidation = (value) => {
        
      if (validator.length(value, 3, 24)) {
        lengthRule.current.style.color = 'green';
      } else {
        lengthRule.current.style.color = '#7e7e7e';
      }
      
      if (value && validator.alphanumeric(value)) {
        alphanumericRule.current.style.color = 'green';
      } else {
        alphanumericRule.current.style.color = '#7e7e7e';
      }
    };

    return (
      <>
        <div id={props.id + '-input-container'} className="form-input text-input" hidden={props.hidden} 
          onFocus={showRequirements} onBlur={hideRequirements}>     
          {/* input error message */}
          <p id={props.id + "-error"} className="input-error"></p>
          {/* input label */}
          {props.label ? <label htmlFor={props.id}>{props.label}<br /></label> : null}
          {/* text input element */}
          <input type="text" id={props.id} name={props.name} placeholder={props.placeholder} 
                 onInput={event => {
                    clearError();
                    props.onInput && props.onInput(event.target.value);
                    props.requirements && usernameValidation(event.target.value);
                  }} />
        </div>
        {/* username requirements] */}
        {props.requirements && <section id="user-name-requirements" className="input-requirements">
          <strong>Create a user name that:</strong>
            <ul id="user-name-requirements-list">
              <li id="user-name-length" ref={lengthRule}>contains between 3 and 24 characters</li>
              <li id="user-name-alfa-num" ref={alphanumericRule}>does not contain non afpha numeric symbols</li>
              <li id="user-name-uniqueness">is not already in use</li>
            </ul>
        </section>}
      </>
    );
  }

  if (props.inputType === 'password') {

    // password requirements references
    const lengthRule = useRef();
    const caseRule = useRef();
    const symbolRule = useRef();
    const alphanumericRule = useRef();

    const togglePass = (inputId) => {
      const passInput = document.getElementById(inputId);
      const passToggle = document.getElementById(inputId + '-toggle');

      passInput.type = passInput.type == 'password' ? 'text' : 'password';
      passToggle.style.backgroundImage = passInput.type == 'password' ? 'url(/img/auth/hidden.png)' : 'url(/img/auth/view.png)';
    };

    const passValidation = (value) => {
        
      if (value && validator.length(value, 8)) {
        lengthRule.current.style.color = 'green';
      } else {
        lengthRule.current.style.color = '#7e7e7e';
      }
  
      if (value && validator.upperLowerCase(value)) {
        caseRule.current.style.color = 'green';
      } else {
        caseRule.current.style.color = '#7e7e7e';
      }
  
      if (value && validator.numberSymbol(value)) {
        symbolRule.current.style.color = 'green';
      } else {
        symbolRule.current.style.color = '#7e7e7e';
      }
  
      if (value && validator.alphanumeric(value)) {
        alphanumericRule.current.style.color = 'green';
      } else {
        alphanumericRule.current.style.color = '#7e7e7e';
      }
    };

    return (
      <>
        <div className="form-input pass-input" onFocus={showRequirements} onBlur={hideRequirements}>      
          {/* input error message */}
          <p id={props.id + "-error"} className="input-error"></p>
          {/* input label */}
          {props.label ? <label htmlFor={props.id}>{props.label}<br /></label> : null}
          {/* input element */}
          <input type="password" id={props.id} name={props.name} placeholder={props.placeholder} 
                 onInput={event => {
                    clearError();
                    props.onInput && props.onInput(event.target.value);
                    props.requirements && passValidation(event.target.value);
                  }} />
          {/* password input show/hide toggle button */}
          <input type="button" className="show-hide-btn" id={props.id + '-toggle'} onClick={event => togglePass(props.id)} />
        </div>
        {/* password requirements] */}
        {props.requirements && <section id="user-pass-requirements" className="input-requirements">
          <strong><p>Create a password that:</p></strong>
          <ul id="user-pass-requirements-list">
            <li id="password-length" ref={lengthRule}>contains at least 8 characters</li>
            <li id="password-letters" ref={caseRule}>contains both lower (a-z) and upper case letters (A-Z)</li>
            <li id="password-symbols" ref={symbolRule}>contains at least one number (0-9) or underscore symbol</li>          
            <li id="password-alpha-num" ref={alphanumericRule}>does not contain non alphanumeric symbols</li>
          </ul>
        </section>}
      </>
    );
  }

};

export default TextInput;