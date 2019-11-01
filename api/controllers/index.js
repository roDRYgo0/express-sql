module.exports = {
  ProfileController: new (require("./core/profile.controller"))(),
  UsersController: new (require("./users.controller"))()
};
