import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './todo.css';

const Todo = (props) => {
  const [todo, setTodo] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [tag, setTag] = useState('');
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchData = async () => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      };
      const URL = '/todo';
      const { data } = await axios.get(URL, config);

      setTodo(data.list);
    };
    fetchData();
  }, []);

  const todos = todo.map((todo, index) => (
    <p className="todo" key={index}>
      <span> {todo.tag + ' -- '}</span> <span>{todo.title}</span>
    </p>
  ));

  const handleClick = async () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    };
    const title = newTodo;
    const body = JSON.stringify({ tag, title });

    try {
      const { data } = await axios.put('/todo', body, config);
      setTodo(data.list);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="container">
      <Link
        to={'/login'}
        style={{ textDecoration: 'none' }}
        onClick={() => {
          localStorage.removeItem('token');
        }}
      >
        <b>Log Out</b>
        <br />
        <br />
      </Link>
      <Link to={'/search'} style={{ textDecoration: 'none' }}>
        <b>SEARCH BY TAG NAME</b>
        <br />
        <br />
      </Link>
      <div>
        <span>Tag: </span>
        <input
          onChange={(e) => setTag(e.target.value)}
          type="text"
          name="tag"
          placeholder="Entry Tag Name"
        ></input>{' '}
        <input
          className="addTodoItem"
          type="text"
          placeholder="Entry ToDo Title"
          onChange={(e) => {
            setNewTodo(e.target.value);
          }}
        />{' '}
        <button onClick={handleClick}>Add todo</button>
      </div>

      {todos}
    </div>
  );
};

export default Todo;
