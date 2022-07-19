const connection = require("../connection");

const readTransactions = async (req, res) => {
    const { user } = req;

    try {
        const queryTransactions =
            `select transacoes.*, categorias.descricao as categoria_descricao
            from transacoes
        inner join categorias on transacoes.categoria_id = categorias.id 
        where usuario_id = $1`;
        const { rows } = await connection.query(queryTransactions, [user.id]);

        return res.status(200).json(rows)

    } catch (error) {
        return res.status(400).json(error.message)
    }

}

const findTransaction = async (req, res) => {
    const { id: idTransaction } = req.params;

    const { user } = req;

    try {
        const queryTransactions = "select * from transacoes where usuario_id = $1 and id = $2";
        const { rows, rowCount } = await connection.query(queryTransactions, [user.id, idTransaction]);

        if (rowCount === 0) {
            return res.status(404).json({
                "mensagem": "Transação não encontrada."
            })
        }

        return res.status(200).json(rows[0])

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const createTransaction = async (req, res) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body;
    const { user } = req;
    const tipos = ["entrada", "saida"];
    let tipoEntrada = false;

    if (!descricao) {
        return res.status(400).json({ "message": "O campo descrição é obrigatório." })
    }
    if (!valor) {
        return res.status(400).json({ "message": "O campo valor é obrigatório." })
    }
    if (!data) {
        return res.status(400).json({ "message": "O campo data é obrigatório." })
    }
    if (!categoria_id) {
        return res.status(400).json({ "message": "O campo categoria_id é obrigatório." })
    }
    if (!tipo) {
        return res.status(400).json({ "message": "O campo descrição é obrigatório." })
    }
    if (tipo != "entrada" && tipo != "saida") {
        return res.status(400).json({ "message": "Tipo de transação inválida." })
    }

    try {

        const queryAddTransaction = "insert into transacoes(descricao, valor, data, categoria_id, usuario_id, tipo) values($1, $2, $3, $4, $5, $6)";
        const { rowCount } = await connection.query(queryAddTransaction, [descricao, valor, data, categoria_id, user.id, tipo]);

        if (rowCount === 0) {
            return res.status(400).json("Não foi possível cadastrar a trasação.");
        }

        const queryGetTransaction = `SELECT * FROM transacoes where usuario_id = $1 order by id DESC LIMIT 1`;
        const resultTransaction = await connection.query(queryGetTransaction, [user.id]);

        const queryGetCategory = "select * from categorias where id = $1";
        const resultCategory = await connection.query(queryGetCategory, [resultTransaction.rows[0].categoria_id]);

        const transaction = {
            ...resultTransaction.rows[0],
            categoria_nome: resultCategory.rows[0].descricao
        }

        return res.status(200).json(transaction);

    } catch (error) {
        return res.status(400).json(error.message);
    }

}

const updateTransaction = async (req, res) => {
    const { user } = req;
    const { id: transaction_id } = req.params;
    const { descricao, valor, data, categoria_id, tipo } = req.body;

    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(400).json({
            "mensagem": "Todos os campos obrigatórios devem ser informados."
        });
    }

    try {

        const queryUpdateTransaction = `UPDATE transacoes SET descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 WHERE id = $6 and usuario_id = $7;`;
        const { rowCount } = await connection.query(queryUpdateTransaction, [descricao, valor, data, categoria_id, tipo, transaction_id, user.id]);

        if (rowCount === 0) {
            return res.status(400).json("Não foi possível atualizar a transação.");
        }

        return res.status(204).json();

    } catch (error) {
        return res.status(400).json(error.message);
    }

}

const deleteTransaction = async (req, res) => {
    const { user } = req;
    const { id: transaction_id } = req.params;

    if (!transaction_id) {
        return res.status(400).json("Por favor informe o id da transação.")
    }

    try {

        const queryGetTransactions = "select * from transacoes where usuario_id = $1 and id = $2";
        const { rowCount: transaction } = await connection.query(queryGetTransactions, [user.id, transaction_id]);

        if (transaction === 0) {
            return res.status(404).json({ "mensagem": "Transação não encontrada." });
        }

        const queryDeleteTransaction = `delete from transacoes where id = $1 and usuario_id = $2`;
        const { rowCount } = await connection.query(queryDeleteTransaction, [transaction_id, user.id]);

        if (rowCount === 0) {
            return res.status(400).json("Não foi possivel excluir a transação.");
        }

        return res.status(204).json();

    } catch (error) {
        return res.status(400).json(error.message);
    }

}

const resumeTransactions = async (req, res) => {
    const { user } = req;
    const resume = {
        entrada: 0,
        saida: 0
    }

    try {
        const queryGetTransactions = "select * from transacoes where usuario_id = $1";
        const { rows, rowCount } = await connection.query(queryGetTransactions, [user.id]);

        if (rowCount === 0) {
            return res.status(200).json(resume);
        }

        for (let item of rows) {
            if (item.tipo == 'entrada') {
                resume.entrada += item.valor;
            }
        }

        for (let item of rows) {
            if (item.tipo == 'saida') {
                resume.saida += item.valor;
            }
        }


        return res.status(200).json(resume)

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    readTransactions,
    findTransaction,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    resumeTransactions
}