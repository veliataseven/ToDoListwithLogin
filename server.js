const express = require('express');
const connectDB = require('./config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const User = require('./models/User');
const Todo = require('./models/Todo');
const auth = require('./authMiddleware');
const path = require('path');

const app = express();

connectDB();

app.use(express.json({ extended: false })); // bodyParser to use req.body

const { check, validationResult } = require('express-validator');

// Register user and send a token
app.post(
  '/user',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter password with 6 or more characters',
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // bad request
    }
    console.log(req.body);

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exist' }] });
      }

      user = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await (await user).save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        },
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  },
);

// Login
app.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // bad request
    }
    console.log('req.body: ', req.body);

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        console.log('No user');
        return res.json({ error: { msg: 'Invalid Credentials' } });
        // return res
        //   .status(400)
        //   .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        },
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  },
);

// Protected Route, get user
// app.get('/auth', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     res.json(user);
//   } catch (error) {
//     res.status(500).send({ msg: 'Server error' });
//   }
// });

// Create and Update todo
app.put(
  '/todo',
  [
    auth,
    [
      check('tag', 'Please include a tag').not().isEmpty(),
      check('title', 'Please include a title').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // bad request
    }
    // console.log(req.body);

    const { tag, title } = req.body;
    const user = req.user.id;
    const listItem = { tag, title };

    try {
      //update todo

      let todo = await Todo.findOne({ user: req.user.id });

      if (todo) {
        todo.list.push(listItem);
        const list = todo.list;
        const newTodo = { user, list };

        todo = await Todo.findOneAndUpdate(
          { user: req.user.id },
          {
            $set: newTodo,
          },
          { new: true, useFindAndModify: false },
        );

        return res.json(todo);
      }

      // create todo
      let list = [];
      list.push(listItem);
      const newTodo = { user, list };
      todo = new Todo(newTodo);
      await todo.save();
      res.json(todo);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  },
);

// get todoList
app.get('/todo', auth, async (req, res) => {
  // console.log('user.id', req.user.id);

  try {
    let todo = await Todo.findOne({ user: req.user.id });

    if (!todo) {
      return res.status(400).json({ errors: [{ msg: 'There is no todo ' }] });
    }

    res.json(todo);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// search
app.get('/search/:tag', auth, async (req, res) => {
  // console.log('user.id', req.user.id);
  const { tag } = req.params;

  try {
    let todo = await Todo.findOne({ user: req.user.id });
    const result = todo.list.filter((todo) => {
      if (todo.tag === tag) {
        return todo;
      }
    });

    if (!result) {
      return res.status(400).json({ errors: [{ msg: 'No found!' }] });
    }
    // console.log('result', result);
    res.json(result);
  } catch (error) {
    console.error(error.message);
    // res.status(500).send('Server Error');
  }
});

if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
