const jwt = require("jsonwebtoken");
const Services = require("../../db/services");

exports.createToken = (user) => {
  let token = jwt.sign({
    id: user.id,
    rol: user.rol
  }, process.env.TOKEN_SECRET, {
    expiresIn: "30d"
  });
  return token;
};

exports.decoded = (authorization) => {
  let token = authorization.split(" ")[1];
  let decoded = jwt.verify(token, process.env.TOKEN_SECRET);
  return decoded;
};


exports.validatePassword = (password) => {
  if (password.length <= 7 || password.length >= 60) {
    return "La contraseña debe tener una longitud minima de 8 caracteres";
  } else if (!/(?=.*\d)/.test(password)) {
    return "La contraseña debe contener al menos un número";
  } else if (!/(?=.*[a-z])/.test(password)) {
    return "La contraseña debe contener al menos una letra minúscula";
  } else if (!/(?=.*[A-Z])/.test(password)) {
    return "La contraseña debe contener al menos una letra mayúscula";
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!.%*?&])[A-Za-z\d$@$!%*?&]{8,60}/.test(password)) {
    return "La contraseña debe contener al menos un caracter especial";
  } else {
    return;
  }
};

exports.handlerRequest = async (body, req, model) => {
  let fail = false;
  let validateMessage = null;
  let message = "Campos requeridos: ";
  // All the attributes that are required are obtained
  var required = Object.values(model).map(att => att.require ? att : undefined);
  required = required.filter(r => r !== undefined);
  // The attributes that are sent in the request are obtained
  var keys = Object.keys(body);
  // Attributes entered are compared with those required
  required.forEach((element) => {
    let key = keys.find(key => key === element.key);
    if ( !key || (!body[key] && body[key] !== 0)){
      fail = true;
      message += `${element.key}, `;
    }
  });

  if (!fail) {
    // If there are no errors and some attribute requires validation, it is done
    var validate = Object.values(model).map(att => att.validate ? att : undefined);
    validate = validate.filter(v => v !== undefined);
    validate.forEach((element) => {
      let key = keys.find(key => key === element.key);
      validateMessage = element.validate(req[key]);
      if (validateMessage) return;
    });

    if (!validateMessage) {
      var uniques = Object.values(model).map(att => att.unique ? att : undefined);
      uniques = uniques.filter(v => v !== undefined);
      if (uniques.length) {
        if (model.serviceName) {
          validateMessage = uniques.map(async (element) => {
            let found = await Services[model.serviceName]
              .findOne({ where: { [element.key]: req[element.key] }, attributes: ["id"]});
            if (found) {
              if (element.spanish) return `Este ${element.spanish.toLowerCase()} ya existe`;
              else return "Spanish property is required in the model";
            }
          })[0];
        } else {
          validateMessage = "ServiceName is required in the model";
        }
      }
    }
  }
  return fail ? message.slice(0, (message.length - 2)) : validateMessage || null;
};
