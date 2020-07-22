const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers['auth-token'] || req.body.token;
  if (!token) return res.status(401).send('No access token provided.');

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send('Access token is not valid.');
  }
};
