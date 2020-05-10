import React, { useState, useEffect } from 'react';
import fire from './fire';

function App() {
  const [loginInp, setLoginInp] = useState('');
  const [passInp, setPassInp] = useState('');
  const [logined, setLogined] = useState(null);
  const ref = fire.database().ref();

  useEffect(() => {
    ref.once('value').then(function (snapshot) {
      if (snapshot.val().logined) {
        setLogined(true);
      } else {
        setLogined(false);
      }
    });
  }, []);

  const handleChange = (event) => {
    if (event.target.name) {
      setLoginInp(event.target.value);
      return;
    }
    setPassInp(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    ref.once('value').then(
      function (snapshot) {
        if (
          snapshot.val().login === loginInp &&
          snapshot.val().pass === Number(passInp) &&
          logined === false
        ) {
          ref.update({
            logined: true,
          });
          logIn();
        }
      },
      function (error) {
        console.log('Error: ' + error.code);
      }
    );
  };

  const logIn = () => {
    ref.on(
      'value',
      function (snapshot) {
        if (snapshot.val().logined) {
          setLogined(true);
        }
      },
      function (error) {
        console.log('Error: ' + error.code);
      }
    );
    setLoginInp('');
    setPassInp('');
  };

  const logOut = () => {
    ref.update({
      logined: false,
    });
    ref.on(
      'value',
      function (snapshot) {
        if (!snapshot.val().logined) {
          setLogined(false);
        }
      },
      function (error) {
        console.log('Error: ' + error.code);
      }
    );
  };

  return (
    <div className="App">
      {logined ? (
        <h1
          onDoubleClick={() => {
            logOut();
          }}
          id="text"
        >
          Welcome!
        </h1>
      ) : (
        <>
          {logined === null ? (
            <img
              src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
              alt="loading..."
            ></img>
          ) : (
            <div className="loginField">
              <form onSubmit={handleSubmit}>
                <b id="login">
                  Login:
                  <input
                    value={loginInp}
                    onChange={handleChange}
                    autoComplete="off"
                    name="login"
                  ></input>
                </b>
                <br></br>
                <b id="pass">
                  Password:
                  <input
                    value={passInp}
                    onChange={handleChange}
                    autoComplete="off"
                    type="password"
                  ></input>
                </b>
                <br></br>
                <input type="submit" id="btn" value="Войти"></input>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
