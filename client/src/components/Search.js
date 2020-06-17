import React, { useState } from 'react';
import axios from 'axios';
import './todo.css';

const Search = () => {
  const [tag, setTag] = useState('');
  const [result, setResult] = useState([]);
  const token = localStorage.getItem('token');

  const handleClick = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    };

    try {
      const { data } = await axios.get(`/search/${tag}`, config);

      setResult(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const todos = result.map((todo, index) => (
    <p className="todo" key={index}>
      <span className="todoItem">{todo.title}</span>
    </p>
  ));

  return (
    <div className="container">
      <div>
        <input
          className="searchInput"
          type="text"
          onChange={(e) => {
            setTag(e.target.value);
          }}
        />{' '}
        <button onClick={handleClick}>Search By Tag</button>
      </div>
      {todos}
    </div>
  );
};

export default Search;
