import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Register = (props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ name, email, password });
    try {
      const { data } = await axios.post('/user', body, config);

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
            <h1>Sign Up</h1>
            <p>Please fill in this form to create an account.</p>

            <label>
              <b>Name : </b>
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Enter Name"
              name="name"
              required
            ></input>
            <br></br>
            <br></br>

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
            <label>Have already account? </label>
            <Link to={'/login'} style={{ textDecoration: 'none' }}>
              Sign In
            </Link>
            <br></br>
            <br></br>
            <button type="Submit">Sign Up</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
