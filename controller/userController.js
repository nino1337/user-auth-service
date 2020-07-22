const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, validateRegistration, validateLogin } = require('../model/user');

exports.registration = async (req, res) => {
  // validate the inputs of the user
  const { error } = validateRegistration(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // check if user with email already exists
    if (await User.exists({ email: req.body.email })) {
      return res.sendStatus(409);
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({ ...req.body, password: hashedPassword });
    await user.save();
    return res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.sendStatus(404);
    }
    await user.deleteOne();
    res.sendStatus(204);
  } catch (e) {
    res.sendStatus(500);
  }
};

exports.login = async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.sendStatus(400);
    }

    // check if password is valid
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );
    if (!validPassword) {
      return res.sendStatus(400);
    }

    // generate token
    const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '8h',
    });
    // redirect to main page
    res.status(200).send(token);
  } catch (e) {
    res.sendStatus(500);
  }
};

exports.currentUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.sendStatus(404);
    }

    res.status(200).send({ username: user.username, email: user.email });
  } catch (e) {
    res.sendStatus(500);
  }
};

exports.logout = (req, res) => {
  res.sendStatus(200);
};
