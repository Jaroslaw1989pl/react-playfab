// 3rd party components
import { useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
// custom style components
import './settings.css';
// custom layouts components
import MainLayout from '../../components/layout/main-layout';
import AvatarCheckbox from '../../components/form/auth-checkbox-input';
// custom context components
import ServerContext from '../../store/server-context';
import UserContext from '../../store/user-context';
import FlashMessageContext from '../../store/flash-message-context';


const SettingsPage = (props) => {
  // useContext constans
  const serverContext = useContext(ServerContext);
  const userContext = useContext(UserContext);
  const flashContext = useContext(FlashMessageContext);
  // useRef constans
  const menu = useRef();

  const timestamp = Math.floor(new Date().getTime() / 1000);

  return (
    <MainLayout>

      <section className="content" ref={menu}>

        <h1>ACCOUNT MENAGEMENT</h1>

        <div className="left-content">
          {/* user personal avatar */}
          <div className="info-personal-avatar">
            <img src={'img/profile-avatars/' + userContext.avatar + '.jpg'} alt="profile avatar"></img>
          </div>
          <AvatarCheckbox className="settings-avatar" isInputHidden={true} />
        </div>

        <div className="right-content">

          <div className="info-personal">
            <div className="info-personal-user">
              {/* Username section */}
              <div className="info-personal-wrapper username">
                <div className="info-cell-icon">
                  <img src="img/settings-icons/id-card.png" alt="info-cell-icon"></img>
                </div>
                <div className="info-cell-value">
                  <h3>{userContext.name}</h3>
                </div>
                {
                  /*timestamp > parseInt(userContext.nameUpdate) + 60 * 60 * 24 * 14*/true
                  ? <div className="info-cell-edit">
                      <Link to="/settings/username"><p>Change</p></Link>
                    </div>
                  : <><div className="info-cell-edit">
                      <Link to="/settings/username" className="disabled"><p>Change</p></Link>
                    </div>
                    <p className="info-personal-wrapper-message">
                      Next update will be available on {new Date(userContext.nameUpdate * 1000 + 3600000 * 24 * 14).toDateString()}.
                    </p></>
                }
                <div style={{clear: 'both'}}></div>
              </div>
              {/* User location section */}
              <div className="info-personal-wrapper location">
                <div className="info-cell-icon">
                  <img src="img/settings-icons/globe.png" alt="info-cell-icon"></img>
                </div>
                <div className="info-cell-value">
                  <p id="user-location">Place of residance: </p><p id="user-location-info"></p>
                </div>
                <div className="info-cell-edit">
                </div>
                <div style={{clear: 'both'}}></div>
              </div>
            </div>

            <div className="info-personal-security">
              <h3>Account Security Settings</h3>
              {/* User email section */}
              <div className="info-personal-wrapper email">
                <div className="info-cell-icon">
                  <img src="img/settings-icons/email.png" alt="info-cell-icon"></img>
                </div>
                <div className="info-cell-value">
                  <p id="p-email"><b>{userContext.email}</b></p>
                  <p id="p-date">Email address added: {new Date(userContext.emailUpdate * 1000).toDateString()}</p>
                </div>
                {
                  timestamp > parseInt(userContext.emailUpdate) + 60 * 60 * 24 * 14
                  ? <div className="info-cell-edit">
                      <Link to="/settings/email"><p>Change</p></Link>
                    </div>
                  : <><div className="info-cell-edit">
                      <Link to="/settings/email" className="disabled"><p>Change</p></Link>
                    </div>
                    <p className="info-personal-wrapper-message">
                      Next update will be available on {new Date(userContext.emailUpdate * 1000 + 3600000 * 24 * 14).toDateString()}.
                    </p></>
                }
                <div style={{clear: 'both'}}></div>
              </div>
              {/* User password section */}
              <div className="info-personal-wrapper">
                <div className="info-cell-icon">
                  <img src="img/settings-icons/lock.png" alt="info-cell-icon"></img>
                </div>
                <div className="info-cell-value">
                  <p>Password added: {new Date(userContext.passUpdate * 1000).toDateString()}</p>
                </div>
                <div className="info-cell-edit">
                  <Link to="/settings/password"><p>Change</p></Link>
                </div>
                <div style={{clear: 'both'}}></div>
              </div>
            </div>

            <div className="info-personal-data">
              <h3>Data Protection</h3>
              {/* User delete section */}
              <div className="info-personal-wrapper data">
                <div className="info-cell-icon">
                  <img src="img/settings-icons/user.png" alt="info-cell-icon"></img>
                </div>
                <div className="info-cell-value">
                  <p>Delete <b>{userContext.name}</b> user account</p>
                </div>
                <div className="info-cell-edit">
                  <Link to="/settings/user-delete"><button>Delete account</button></Link>
                </div>
                <div style={{clear: 'both'}}></div>
              </div>
            </div>
          </div>
        </div>

        <div style={{clear: 'both'}}></div>

      </section>

    </MainLayout>
  );
};

export default SettingsPage;