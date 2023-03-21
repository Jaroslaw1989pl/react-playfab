// 3rd party components
import { useContext, useState, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
// custom style components
import './auth-form.css';
// custom context components
import ServerContext from '../../store/server-context';


// text input
const AuthForm = (props) => {

  const navigate = useNavigate();
  
  const server = useContext(ServerContext);

  const formError = useRef();
  const [isRegistrationSuccess, setRegistrationStatus] = useState(false);
  const [isRecoveryEmailSent, setRecoveryEmailStatus] = useState(false);
  const [isPasswordChanged, setPasswordStatus] = useState(false);

  const submitValue = (formId) => {
    let value;
    switch (formId) {
      case 'login':
        value = 'Sign in';
        break;
      case 'registration':
        value = 'Sign up';
        break;
      case 'reset-password':
        value = 'Send email';
        break;
    }
    return value;
  };

  const submit = (event) => {

    event.preventDefault();

    let data = props.data();

    if (data) {

      let postData = '';
      
      for (const property in data) {
        postData += property + '=' + data[property] + '&';
      }
      
      postData = postData.substring(0, postData.length - 1);
  
      const xhr = new XMLHttpRequest();
      xhr.onerror = () => console.log('Authentication form. Server not responding.');
      xhr.onload = () => {
        console.log('auth-form.js', xhr.responseText);
        // wymaga poprawy: sprawdzenie czy użytkownik zapisał się w bazie danych
        if (props.id === 'registration' && xhr.status === 201) {
          setRegistrationStatus(true);
        } else if (props.id === 'registration' && xhr.status !== 201) {
          // wymaga poprawy: dodanie odpowiedzi w przypadku błędu tworzenia użytkownika
        }

        if (props.id === 'login' && xhr.status === 200) {
          localStorage.removeItem('session');
          localStorage.setItem('session', xhr.responseText);
          navigate(window.location.pathname === '/registration' ? '/' : -1);
        } else if (props.id === 'login' && xhr.status !== 200) {
          formError.current.textContent = JSON.parse(xhr.responseText).error;
          formError.current.style.display = 'block';
        }

        if (props.id === 'reset-password' && xhr.status === 201) {
          setRecoveryEmailStatus(true);
        } else if (props.id === 'reset-password' && xhr.status !== 201) {
          formError.current.textContent = JSON.parse(xhr.responseText).error;
          formError.current.style.display = 'block';
        }

        if (props.id === 'new-password' && xhr.status === 200) {
          setPasswordStatus(true);
        } else if (props.id === 'new-password' && xhr.status !== 200) {
          formError.current.textContent = JSON.parse(xhr.responseText).error;
          formError.current.style.display = 'block';
        }
      }
      xhr.open(props.method, server.domain + props.action);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.send(JSON.stringify(data));
    }
  }

  return (
    <main id="auth">

      <div id="content-left">

        <Link to="/" id="home-link">Playfab</Link>
        <p>Sign in or create an account</p>

      </div>

      <div id="content-right">

        <div id={props.id + '-panel'} className="auth-panel">

          {
            isRegistrationSuccess && <>
              <h3>FORM WAS SUBMITED</h3>
              <Link to="/login"><button>Sign in</button></Link><p> or <Link to="/">Return to homepage</Link>.</p>
            </>
          }

          {
            isRecoveryEmailSent && <>
              <h3>Reset your password</h3>
              <p>Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.</p>
              <Link to="/login"><button>Sign in</button></Link><p> or <Link to="/">Return to homepage</Link>.</p>
            </>
          }

          {
            isPasswordChanged && <>
              <h3>Password changed successfully</h3>
              <p>Now you can login using new password.</p>
              <Link to="/login"><button>Sign in</button></Link><p> or <Link to="/">Return to homepage</Link>.</p>
            </>
          }

          {
            (!isRegistrationSuccess && !isRecoveryEmailSent && !isPasswordChanged) && <>
              <header id={props.id + '-panel-header'} className="auth-panel-header">
                <h1></h1>
                <p><Link to={props.id === 'login' ? '/registration' : '/login'}></Link></p>
              </header>

              <p id={props.id + '-form-error'} className="form-error" ref={formError}></p>

              <form action={props.action} method={props.method}>

                {props.children}

                <input 
                  type="submit" id={props.id + '-form-submit-btn'} className="form-submit-btn" 
                  value={submitValue(props.id)} onClick={event => submit(event)}
                />

              </form>

              {props.id === 'login' && <p>Forgot password? <Link to="/reset-password">Reset password</Link></p>}
              {props.id === 'reset-password' && <p>Try to <Link to="/login">sign in to a different account</Link>?</p>}
            </>
          }

        </div>

      </div>

    </main>
  );
};

export default AuthForm;