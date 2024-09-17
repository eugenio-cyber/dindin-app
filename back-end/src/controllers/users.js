const connection = require("../connection");
const bcrypt = require("bcrypt");
const salt = 10;

const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const registerUser = async (req, res) => {
  let { name, email, password } = req.body;

  if (!name || name === "") {
    return res.status(400).json({ message: "O campo nome é obrigatório." });
  }
  if (!email || email === "") {
    return res.status(400).json({ message: "O campo email é obrigatório." });
  }
  if (!password || password === "") {
    return res.status(400).json({ message: "O campo senha é obrigatório." });
  }

  email = email.toLowerCase();

  const isEmail = validateEmail(email);

  if (!isEmail) {
    return res.status(400).json({ message: "E-mail inválido." });
  }

  try {
    const queryVerifyUsers = `select * from users where email = $1`;
    const user = await connection.query(queryVerifyUsers, [email]);

    if (user.rowCount > 0) {
      return res.status(400).json({ message: "Usuário já cadastrado." });
    }

    const passwordEncrypted = await bcrypt.hash(password, salt);

    const queryRegisterUser = `insert into users(name, email, password) values($1,$2,$3)`;
    const userRegistered = await connection.query(queryRegisterUser, [
      name,
      email,
      passwordEncrypted,
    ]);

    if (userRegistered.rowCount === 0) {
      return res.status(400).json("Não foi possível cadastrar o usuário.");
    }

    return res.status(200).json("Usuário cadastrado com sucesso.");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const detailUser = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(404).json({
      mensagem:
        "Para acessar este recurso um token de autenticação válido deve ser enviado.",
    });
  }

  return res.status(200).json(user);
};

const updateUser = async (req, res) => {
  const user = req.user;
  const { name, email, password } = req.body;

  if (!user) {
    return res.status(404).json({
      mensagem:
        "Para acessar este recurso um token de autenticação válido deve ser enviado.",
    });
  }

  if (!name || name === "") {
    return res.status(400).json("O campo nome deve ser preenchido.");
  }
  if (!email || email === "") {
    return res.status(400).json("O campo email deve ser preenchido.");
  }
  if (!password || password === "") {
    return res.status(400).json("O campo senha deve ser preenchido.");
  }

  let isSameEmail = false;
  const validEmail = validateEmail(email);

  if (!validEmail) {
    return res.status(400).json({
      mensagem: "O e-mail informado deve ser válido.",
    });
  }

  if (email == user.email) {
    isSameEmail = true;
  }

  try {
    const queryEmailVerify = "select * from users where email = $1";
    const { rows, rowCount } = await connection.query(queryEmailVerify, [
      user.email,
    ]);

    if (isSameEmail && email === rows[0].email) {
      const passwordEncrypted = await bcrypt.hash(password, salt);
      const queryRegisterUser = `update users set name = $1, email = $2, password = $3 where id = $4`;
      const userRegistered = await connection.query(queryRegisterUser, [
        name,
        email.toLowerCase(),
        passwordEncrypted,
        rows[0].id,
      ]);

      if (userRegistered.rowCount === 0) {
        return res.status(400).json("Não foi possível atualizar o usuário.");
      }

      return res.status(201).json();
    } else if (!isSameEmail && rowCount === 1) {
      const passwordEncrypted = await bcrypt.hash(password, salt);
      const queryRegisterUser = `update users set name = $1, email = $2, password = $3 where id = $4`;
      const userRegistered = await connection.query(queryRegisterUser, [
        name,
        email.toLowerCase(),
        passwordEncrypted,
        rows[0].id,
      ]);

      if (userRegistered.rowCount === 0) {
        return res.status(400).json("Não foi possível atualizar o usuário.");
      }

      return res.status(201).json();
    } else if (rowCount != 0 && !isSameEmail) {
      return res.status(400).json({
        mensagem:
          "O e-mail informado já está sendo utilizado por outro usuário.",
      });
    }

    return res.status(404).json("Não foi possível atualizar o usuário.");
  } catch (error) {
    return res.status(400).json(error.menssage);
  }
};

module.exports = {
  registerUser,
  detailUser,
  updateUser,
};
