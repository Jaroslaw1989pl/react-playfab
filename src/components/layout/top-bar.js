// 3rd party components
import { useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// custom context components
import UserContext from '../../store/user-context';
// custom style components
import './top-bar.css';



const TopBar = (props) => {

  const userContext = useContext(UserContext);

  const menu = useRef();

  const navigate = useNavigate();


  userContext.set();

  const toggleDropdownMenu = event => {
    event.preventDefault();
  
    if (menu.current.style.display == '') menu.current.style.display = 'block';
    else if (menu.current.style.display == 'block') menu.current.style.display = '';
  };

  const logout = (event) => {
    event.preventDefault();
    userContext.clear();
    navigate(window.location.pathname === '/' ? '/login' : '/');
  };

  return (
    <header id="top-bar">
  
      <div id="top-bar-left">
        <Link to="/" className="img-home-link"><img src="/img/favicon.png" alt="flavico" /></Link>
        <Link to="/" className="home-link">Playfab</Link>
      </div>
  
      <div id="top-bar-right">
      { userContext.id && userContext.id.length > 0
        ? <div id="user-navigation">
 
            <img src={'/img/profile-avatars/' + userContext.avatar + '.jpg'} alt="profile avatar" className="profile-avatar"></img>
     
            <a href="" id="dropdown-toggle" onClick={event => toggleDropdownMenu(event)}>{userContext.name} &#x21B4;</a>
      
            <div id="user-menu" className="dropdown-menu" ref={menu}>
              <div className="dropdown-menu-group">
                <div className="menu-item">
                  <Link to="/settings">Settings</Link>
                </div>
              </div>
              <div className="dropdown-menu-group">
                <div className="menu-item">
                  <form action="/logout" method="POST">
                    <button type="submit" id="logout-btn" onClick={event => logout(event)}>Sign out</button>
                  </form>
                </div>
              </div>
            </div>
      
          </div>
        : <div id="sign-buttons">
            <Link to="/login"><button id="sign-in-btn" className="sign-btn">Sign in</button></Link>
            <Link to="/registration"><button id="sign-up-btn" className="sign-btn">Sign up</button></Link>
          </div>
      }
      </div>
  
    </header>
  );
}

export default TopBar;
