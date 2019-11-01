const jwt = require("jsonwebtoken");

exports.handlerRequest = (req, model) => {
  let fail = false;
  var required = Object.values(model).map(att => att.require ? att : undefined);
  required = required.filter(r => r !== undefined);
  var keys = Object.keys(req);
  let message = "Campos requeridos: ";
  required.forEach((element) => {
    let key = keys.find(key => key === element.key);
    if ( !key || (!req[key] && req[key] !== 0)){
      fail = true;
      message += `${element.key}, `;
    }
  });
  return fail ? message.slice(0, (message.length - 2)) : null;
};

exports.createToken = function (user) {
  let token = jwt.sign({
    id: user.id,
    rol: user.rol
  }, process.env.TOKEN_SECRET, {
    expiresIn: "30d"
  });
  return token;
};

exports.decoded = function (authorization){
  let token = authorization.split(" ")[1];
  let decoded = jwt.verify(token, process.env.TOKEN_SECRET);
  return decoded;
};
