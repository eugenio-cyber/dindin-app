const connection = require("../connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const data = require("../credentials");

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(404).json("Email e senha são obrigatórios.");
  }

  try {
    const queryVerifyEmail = `select * from users where email = $1`;
    const { rows, rowCount } = await connection.query(queryVerifyEmail, [
      email,
    ]);

    if (rowCount === 0) {
      return res.status(404).json("Email ou senha inválido.");
    }

    const user = rows[0];

    const passwordVerified = await bcrypt.compare(password, user.password);

    if (!passwordVerified) {
      return res.status(400).json("Email ou senha inválido.");
    }

    const { password: userPassword, ...userData } = user;

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      data.secretKey,
      { expiresIn: "2d" }
    );

    return res.status(200).json({
      user: userData,
      token,
    });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  login,
};
