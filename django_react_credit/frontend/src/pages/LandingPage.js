import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import './css_files/LandingPage.css';

// Import images from src folder
import CitLogo from '../pictures/LandingPagePics/navbarCitLogo.png';
import UserLogo from '../pictures/LandingPagePics/user-logo.png';
import citBackground from '../pictures/LandingPagePics/citBackground.png';
import usericon from '../pictures/LandingPagePics/username.png';
import passicon from '../pictures/LandingPagePics/password.png';

function LandingPage() {
  const [modalType, setModalType] = useState(null); // null | 'signIn' | 'register'
  const navigate = useNavigate();
  return (
    <div className="App">
      {/* Background blur layer */}
      <div
        className="background-blur"
        style={{ backgroundImage: `url(${citBackground})` }}
      ></div>
         
      {/* Navigation Bar */}
      <header className="navbar">
        <img src={CitLogo} alt="CIT Logo" className="logo" />
        <div className="user-section">
          <img src={UserLogo} alt="User Icon" className="user-icon" />
          <button className="sign-link" onClick={() => setModalType('signIn')}>
            Sign In/Register
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <h1>
          Welcome to <span className="highlight">CRED-IT</span>
        </h1>
        <p className="description">
          A software that aims to ease the administrative burden <br />
          on department staff, improve decision-making accuracy, and <br />
          provide transferee students with faster and clearer results.
        </p>
        <p className="description">
          Our system simplifies and standardizes course comparison and credit accreditation between <br />
          institutions — improving efficiency, transparency, and academic advising. <br />
          Say goodbye to manual evaluations and hello to faster, smarter decisions for students and schools alike.
        </p>
        <p className="description bold">
          <strong>Sign In or Register</strong> to begin <br /> using the software.
        </p>
      </main>

      {/* Modal Overlay */}
      {modalType && (
        <div className="modal-overlay">
          <div className="modal">
            
            {modalType === 'signIn' ? (
              <>
                <h2>Student Portal</h2>
                <p>Sign in to access your account</p>

                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-icon">
                    <img src={usericon} alt="user icon"/>
                    <input type="text" placeholder="Username" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <div className="input-icon">
                    <img src={passicon} alt="password icon"/>
                    <input type="password" placeholder="Enter your password" />
                  </div>
                </div>

                <div className="options">
                  <label>
                    <input type="checkbox" /> Remember me
                  </label>
                  <a href="#">Forgot password?</a>
                </div>

                <button className="modal-signin" onClick={() => navigate('/home')}>
                    Sign In
                </button>
                <p>
                  Don't have an account?{' '}
                  <a href="#" onClick={() => setModalType('register')}>
                    Register here
                  </a>
                </p>
              </>
            ) : (
              <>
                <h2>Register an account</h2>

                <div className="form-group">
                  <div className="input-icon">
                    <img src={usericon} alt="user icon"/>
                    <input type="text" placeholder="Add a username" />
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-icon">
                    <img src={passicon} alt="pass icon"/>
                    <input type="password" placeholder="Add a password" />
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-icon">
                    <img src={passicon} alt="pass icon"/>
                    <input type="password" placeholder="Confirm password" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Register as:</label>
                  <select defaultValue="">
                    <option value="" disabled>
                      Please choose a role
                    </option>
                    <option value="Student">Student</option>
                    <option value="Dept. Dean">Dept. Dean</option>
                    <option value="Secretary/Dept. Chair">Secretary/Dept. Chair</option>
                  </select>
                </div>

                <button className="modal-signin">Register</button>
              </>
            )}

            <button className="modal-close" onClick={() => setModalType(null)}>
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;