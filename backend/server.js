// 📁 backend/server.js
const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Banco "fake" na memória
let users = [
  { id: 1, usuario: "Admin", senha: "Admin", acesso: "admin" },
  { id: 2, usuario: "Marcos", senha: "123", acesso: "colaborador" },
];

// ------------------------------
// ROTA DE LOGIN
// ------------------------------
app.post("/login", (req, res) => {
  try {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
      return res.status(400).json({ error: "Usuário e senha são obrigatórios" });
    }

    const user = users.find((u) => u.usuario === usuario && u.senha === senha);

    if (!user) {
      return res.status(401).json({ error: "Usuário ou senha incorretos" });
    }

    // Retorna somente dados necessários
    return res.json({
      id: user.id,
      usuario: user.usuario,
      acesso: user.acesso,
    });

  } catch (err) {
    console.error("Erro no login:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// ------------------------------
// LISTAR USUÁRIOS
// ------------------------------
app.get("/usuarios", (req, res) => {
  res.json(users);
});

// ------------------------------
// ADICIONAR USUÁRIO
// ------------------------------
app.post("/usuarios", (req, res) => {
  try {
    const { usuario, senha, acesso } = req.body;

    if (!usuario || !senha || !acesso) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    const newUser = {
      id: users.length + 1,
      usuario,
      senha,
      acesso,
    };

    users.push(newUser);
    res.json(newUser);

  } catch (err) {
    console.error("Erro ao adicionar usuário:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// ------------------------------
// EDITAR USUÁRIO
// ------------------------------
app.put("/usuarios/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { usuario, senha, acesso } = req.body;

    const idx = users.findIndex((u) => u.id == id);
    if (idx === -1) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    users[idx] = { ...users[idx], usuario, senha, acesso };
    res.json(users[idx]);

  } catch (err) {
    console.error("Erro ao editar usuário:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// ------------------------------
// EXCLUIR USUÁRIO
// ------------------------------
app.delete("/usuarios/:id", (req, res) => {
  try {
    const { id } = req.params;

    const idx = users.findIndex((u) => u.id == id);

    if (idx === -1) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    users.splice(idx, 1);

    res.json({ message: "Usuário removido com sucesso" });

  } catch (err) {
    console.error("Erro ao excluir usuário:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// ------------------------------
// INICIAR SERVIDOR
// ------------------------------
app.listen(8081, () => {
  console.log("🚀 API rodando em: http://192.168.0.9:8081");
});