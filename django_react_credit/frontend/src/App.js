import './App.css';

function App() {
  return (

    <div className="App">
      <div className="background-blur"></div>  {/* Blurred background layer */}

      <header className="navbar">
        <img src="/navbarCitLogo.png" alt="CIT Logo" className="logo" />
        <div className="user-section">
          <img src="/user-logo.png" alt="User" className="user-icon" />
          <button className="sign-link">Sign In/Register</button>
        </div>
      </header>

      

      <main className="main-content">
        <h1>Welcome to <span className="highlight">CRED-IT</span></h1>
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
          <strong>Sign In or Register</strong> to begin <br /> using the software
        </p>
      </main>
    </div>
  );
}

export default App;
