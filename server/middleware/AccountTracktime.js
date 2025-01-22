const Account = require('../models/Account');

const trackLogin = async (req, res, next) => {
  const userId = req.user._id; // Assuming you have authentication and user ID in req.user
  const user = await Account.findById(userId);

  if (user) {
    user.lastLogin = Date.now();
    user.sessions.push({ startTime: Date.now() }); // Add a new session
    await user.save();
    next();
  } else {
    res.status(404).send('User not found');
  }
};

module.exports = trackLogin;
