import React, { useState } from 'react';
import axios from 'axios';

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ email, password });
    try {
      const { data } = await axios.post('/login', body, config);
      localStorage.setItem('token', data.token);
      if (data.token) {
        props.history.push('/todo');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="container">
            <h1>Sign In</h1>
            <label>
              <b>Email : </b>
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Enter Email"
              name="email"
              required
            ></input>
            <br></br>
            <br></br>

            <label>
              <b>Password : </b>
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter Password"
              name="password"
              required
            ></input>
            <br></br>
            <br></br>
            <button type="Submit">Sign In</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
