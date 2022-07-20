const connection = require("../connection");

const listCategories = async (req, res) => {
  try {
    const queryGetCategories = "select * from categorias";
    const { rows } = await connection.query(queryGetCategories);

    return res.status(200).json(rows);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  listCategories,
};
