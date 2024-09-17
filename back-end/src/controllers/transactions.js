const connection = require("../connection");

const readTransactions = async (req, res) => {
  const { user } = req;

  try {
    const queryTransactions = `select transactions.*, categories.description as category_description
                               from transactions
                               inner join categories on transactions.category_id = categories.id
                               where user_id = $1`;
    const { rows } = await connection.query(queryTransactions, [user.id]);

    return res.status(200).json(rows);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const findTransaction = async (req, res) => {
  const { id: idTransaction } = req.params;

  const { user } = req;

  try {
    const queryTransactions =
      "select * from transactions where user_id = $1 and id = $2";
    const { rows, rowCount } = await connection.query(queryTransactions, [
      user.id,
      idTransaction,
    ]);

    if (rowCount === 0) {
      return res.status(404).json({
        mensagem: "Transação não encontrada.",
      });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const createTransaction = async (req, res) => {
  const { description, value, transaction_date, category_id, type } = req.body;
  const { user } = req;

  if (!description) {
    return res
      .status(400)
      .json({ message: "O campo descrição é obrigatório." });
  }
  if (!value) {
    return res.status(400).json({ message: "O campo valor é obrigatório." });
  }
  if (!transaction_date) {
    return res.status(400).json({ message: "O campo data é obrigatório." });
  }
  if (!category_id) {
    return res
      .status(400)
      .json({ message: "O campo category_id é obrigatório." });
  }
  if (!type) {
    return res.status(400).json({ message: "O campo tipo é obrigatório." });
  }
  if (type != "income" && type != "expense") {
    return res.status(400).json({ message: "Tipo de transação inválida." });
  }

  try {
    const queryAddTransaction =
      "insert into transactions(description, value, transaction_date, category_id, user_id, type) values($1, $2, $3, $4, $5, $6)";
    const { rowCount } = await connection.query(queryAddTransaction, [
      description,
      value,
      transaction_date,
      category_id,
      user.id,
      type,
    ]);

    if (rowCount === 0) {
      return res.status(400).json("Não foi possível cadastrar a transação.");
    }

    const queryGetTransaction = `SELECT * FROM transactions where user_id = $1 order by id DESC LIMIT 1`;
    const resultTransaction = await connection.query(queryGetTransaction, [
      user.id,
    ]);

    const queryGetCategory = "select * from categories where id = $1";
    const resultCategory = await connection.query(queryGetCategory, [
      resultTransaction.rows[0].category_id,
    ]);

    const transaction = {
      ...resultTransaction.rows[0],
      category_nome: resultCategory.rows[0].description,
    };

    return res.status(200).json(transaction);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const updateTransaction = async (req, res) => {
  const { user } = req;
  const { id: transaction_id } = req.params;
  const { description, value, transaction_date, category_id, type } = req.body;

  if (!description || !value || !transaction_date || !category_id || !type) {
    return res.status(400).json({
      mensagem: "Todos os campos obrigatórios devem ser informados.",
    });
  }

  try {
    const queryUpdateTransaction = `UPDATE transactions SET description = $1, value = $2, transaction_date = $3, category_id = $4, type = $5 WHERE id = $6 and user_id = $7;`;
    const { rowCount } = await connection.query(queryUpdateTransaction, [
      description,
      value,
      transaction_date,
      category_id,
      type,
      transaction_id,
      user.id,
    ]);

    if (rowCount === 0) {
      return res.status(400).json("Não foi possível atualizar a transação.");
    }

    return res.status(204).json();
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const deleteTransaction = async (req, res) => {
  const { user } = req;
  const { id: transaction_id } = req.params;

  if (!transaction_id) {
    return res.status(400).json("Por favor informe o id da transação.");
  }

  try {
    const queryGetTransactions =
      "select * from transactions where user_id = $1 and id = $2";
    const { rowCount: transaction } = await connection.query(
      queryGetTransactions,
      [user.id, transaction_id]
    );

    if (transaction === 0) {
      return res.status(404).json({ mensagem: "Transação não encontrada." });
    }

    const queryDeleteTransaction = `delete from transactions where id = $1 and user_id = $2`;
    const { rowCount } = await connection.query(queryDeleteTransaction, [
      transaction_id,
      user.id,
    ]);

    if (rowCount === 0) {
      return res.status(400).json("Não foi possivel excluir a transação.");
    }

    return res.status(204).json();
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const transactionsSummary = async (req, res) => {
  const { user } = req;
  const resume = {
    incomes: 0,
    expenses: 0,
    balance: 0,
  };

  try {
    const queryGetTransactions =
      "select * from transactions where user_id = $1";
    const { rows, rowCount } = await connection.query(queryGetTransactions, [
      user.id,
    ]);

    if (rowCount === 0) {
      return res.status(200).json(resume);
    }

    for (let item of rows) {
      if (item.type == "income") {
        resume.incomes += Number(item.value);
      }
    }

    for (let item of rows) {
      if (item.type == "expense") {
        resume.expenses += Number(item.value);
      }
    }

    return res.status(200).json(resume);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  readTransactions,
  findTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  transactionsSummary,
};
