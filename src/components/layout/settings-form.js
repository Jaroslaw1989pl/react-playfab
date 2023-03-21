// 3rd party components
import { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
// custom style components
import './settings-form.css';
// custom components
import ServerContext from '../../store/server-context';
import TextInput from "../form/auth-text-input";


const SettingsForm = (props) => {

  // const navigate = useNavigate();

  const server = useContext(ServerContext);

  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isCodeConfirmed, setIsCodeConfirmed] = useState(false);
  const [confCode, setConfCode] = useState('');

  const formError = useRef();

  useEffect(() => {
    if (props.user) {
      const xhr = new XMLHttpRequest();
      xhr.onerror = () => console.log('Settings useEfect. Server not responding.');
      xhr.onload = () => {
        console.log(xhr.responseText);
        const response = JSON.parse(xhr.responseText);
        if (response.code === 200 && response.message === 'not confirmed') {
          setIsEmailSent(true);
        } else if (response.code === 200 && response.message === 'confirmed') {
          setIsEmailSent(true);
          setIsCodeConfirmed(true);
        }
      }
      xhr.open('GET', server.domain + '/api/authentication/form-status?userEmail=' + props.user.email + '&db=' + props.id, true);
      xhr.send();
    }
  });

  const sendEmail = (event) => {

    event.preventDefault();
  
    const xhr = new XMLHttpRequest();
  
    xhr.onerror = () => console.log('Settings email form. Server not responding.');
    xhr.onload = () => {
      if (xhr.status === 201) {
        console.log(xhr.responseText);
        setIsEmailSent(true);
      } 
    }
    xhr.open('POST', server.domain + server.authenticationEmailCode);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('userEmail=' + props.user.email + '&db=' + props.id);  
  }

  const confirmCode = (event) => {

    event.preventDefault();
  
    const codeError = document.getElementById('confirmation-code-error');

    try {
      if (confCode.length === 0) throw 'Please enter confirmation code.'; 
      else if (confCode.length !== 5) throw 'Confirmation code must be 5 digit number';
      else if (isNaN(confCode)) throw 'Confirmation code must be 5 digit number';
      else {
        const xhr = new XMLHttpRequest();      
        xhr.onerror = () => console.log('Settings code form. Server not responding.');
        xhr.onload = () => {
          if (xhr.status === 200) setIsCodeConfirmed(true);
          else {
            codeError.textContent = xhr.responseText;
            codeError.style.display = 'block';
          }
        }
        xhr.open('POST', server.domain + server.authenticationConfirmCode);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('userEmail=' + props.user.email + '&code=' + confCode + '&db=' + props.id);  
      }
    } catch (error) {
      codeError.textContent = error;
      codeError.style.display = 'block';
    }
  }

  return (
    <main id={props.id + "-settings"} className="settings-form-content">

      <Link to="/settings" id="back-anchor">&#171; Account Management</Link>

      <header>
        <h1 id="title">{/* content added in css file */}</h1>
      </header>

      <div id={props.id + "-settings-form"} className="settings-form">

        <p id="top-paragraph">{/* content added in css file */}</p>

        {props.authentication &&
          <div id="steps-list">
            <div className="step">
              <div className="step-icon active">
                <img src="/img/settings-icons/dots.png" alt=""></img>
              </div>
              <div className={isEmailSent ? "step-content" : "step-content active"}>
                <div className="step-text">1. Generate code</div>
              </div>
            </div>
            <div className="step">
              <div className={isEmailSent ? "step-icon active" : "step-icon"}>
                <img src="/img/settings-icons/pin.png" alt=""></img>
              </div>
              <div className={isEmailSent && !isCodeConfirmed ? "step-content active" : "step-content"}>
                <div className="step-text">2. Confirm code</div>
              </div>
            </div>
            <div className="step">
              <div className={isCodeConfirmed ? "step-icon active" : "step-icon"}>
                <img src="/img/settings-icons/form.png" alt=""></img>
              </div>
              <div className={isCodeConfirmed ? "step-content active" : "step-content"}>
                <div className="step-text">3. Complete form</div>
              </div>
            </div>
            <div style={{clear: 'both'}}></div>
          </div> 
        }
        {
          (props.authentication && !isEmailSent) 
          // FORM 1 - email with confirmation code
          ?
            <form name="email-form" method="POST">
              <header>
                <p id="email-form-top-paragraph"></p>
                <p><b>The confirmation code will be sent to your email address.</b></p>
              </header>
              <input type="submit" id="email-submit-btn" className="settings-form-submit-btn" name="emailSubmitBtn" value="Send email"
                    onClick={event => sendEmail(event)} />
            </form>
          :(props.authentication && isEmailSent && !isCodeConfirmed)
          ?
            <>
              {/* FORM 2 - Confirm code from email */}
              <header>
                {/* wymaga poprawy: ukrycie adresu email pod gwiazdkami */}
                <p>Confirmation code was sent to email: <b>{props.user.email}</b></p>
              </header>
              <form name="code-form" method="POST">
                <header>
                  <p id="code-form-top-paragraph"></p>
                  <p><b>To continue, enter the confirmation code. The code is valid for 1 hour.</b></p>
                </header>
                <TextInput inputType="text" id="confirmation-code" name="confirmationCode" placeholder="Confirmation code" 
                          onInput={setConfCode} />
                <input type="submit" id="code-submit-btn" className="settings-form-submit-btn" name="codeSubmitBtn" value="Confirm code"
                      onClick={(event) => confirmCode(event)} />
              </form>
            </>
          :(props.authentication && isEmailSent && isCodeConfirmed)
          ?
            <>
              {/* FORM 3 */}
              <header>
                <p>Confirmation code was accepted.</p>
              </header>
              <form name="custom-form" method="POST">                
                <header>
                  <p id="custom-form-top-paragraph"></p>
                  <p><b></b></p>
                </header>
                {props.children}
                {/* <input type="submit" id="custom-submit-btn" className="settings-form-submit-btn" name="customSubmitBtn" value="Send form" 
                       onClick={(event) => submit(event)} /> */}
              </form>
            </>
          :
            <></>
        }

        {!props.authentication && <>{props.children}</>}
        
      </div>

    </main>
  );
};

export default SettingsForm;