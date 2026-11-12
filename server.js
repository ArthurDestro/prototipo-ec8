const express = require('express');
const os = require('os');
const path = require('path');

const app = express();
const PORTA = process.env.PORT || 3000;

// Lista simples de usuários, guardada na memória.
// Quem se cadastrar some quando o servidor é desligado (só para teste).
const usuarios = [
  { nome: 'Usuário Teste', email: 'teste@cafe.com', senha: '123456' },
];

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function limparEmail(email) {
  return String(email || '').trim().toLowerCase();
}

app.post('/api/login', (req, res) => {
  const email = limparEmail(req.body.email);
  const usuario = usuarios.find((u) => u.email === email && u.senha === req.body.senha);

  if (!usuario) {
    return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
  }
  res.json({ nome: usuario.nome });
});

app.post('/api/cadastro', (req, res) => {
  const nome = String(req.body.nome || '').trim();
  const email = limparEmail(req.body.email);
  const senha = String(req.body.senha || '');

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Preencha todos os campos.' });
  }
  if (usuarios.some((u) => u.email === email)) {
    return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
  }

  usuarios.push({ nome, email, senha });
  res.status(201).json({ nome });
});

// Procura o endereço do computador na rede, para abrir o app no celular.
function enderecoNaRede() {
  const redes = Object.values(os.networkInterfaces()).flat();
  const rede = redes.find((r) => r.family === 'IPv4' && !r.internal);
  return rede ? rede.address : null;
}

app.listen(PORTA, () => {
  console.log(`No computador: http://localhost:${PORTA}`);
  const endereco = enderecoNaRede();
  if (endereco) {
    console.log(`No celular (mesmo Wi-Fi): http://${endereco}:${PORTA}`);
  }
});
