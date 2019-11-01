module.exports = {
  password: {
    key: "password",
    require: true
  },
  email: {
    key: "email",
    transform: (email) => email ? email.toLowerCase() : undefined,
    require: true
  }
};
