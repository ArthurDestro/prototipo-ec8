const telas = document.querySelectorAll('.tela');
const inputFoto = document.getElementById('foto');
const previa = document.getElementById('previa');
const escolherTexto = document.getElementById('escolher-texto');
const enviarFoto = document.getElementById('enviar-foto');
const fotoEnviada = document.getElementById('foto-enviada');
const listaHistorico = document.getElementById('lista-historico');
const historicoVazio = document.getElementById('historico-vazio');

function mostrarTela(nome) {
  telas.forEach((tela) => {
    tela.hidden = tela.id !== `tela-${nome}`;
  });
  fotoEnviada.hidden = true;
  window.scrollTo(0, 0);
}

// Qualquer botão com data-ir leva para a tela indicada
document.querySelectorAll('[data-ir]').forEach((botao) => {
  botao.addEventListener('click', () => mostrarTela(botao.dataset.ir));
});

async function enviarFormulario(endereco, form, campoErro) {
  campoErro.textContent = '';
  const dados = Object.fromEntries(new FormData(form));

  try {
    const resposta = await fetch(endereco, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
    const resultado = await resposta.json();

    if (!resposta.ok) {
      campoErro.textContent = resultado.erro;
      return;
    }
    form.reset();
    entrar(resultado.nome);
  } catch {
    campoErro.textContent = 'Não foi possível conectar. Tente novamente.';
  }
}

function entrar(nome) {
  document.getElementById('saudacao').textContent = `Olá, ${nome}!`;
  mostrarTela('menu');
}

document.getElementById('form-login').addEventListener('submit', (evento) => {
  evento.preventDefault();
  enviarFormulario('/api/login', evento.target, document.getElementById('erro-login'));
});

document.getElementById('form-cadastro').addEventListener('submit', (evento) => {
  evento.preventDefault();
  enviarFormulario('/api/cadastro', evento.target, document.getElementById('erro-cadastro'));
});

document.getElementById('sair').addEventListener('click', () => {
  listaHistorico.replaceChildren();
  historicoVazio.hidden = false;
  mostrarTela('login');
});

inputFoto.addEventListener('change', () => {
  const foto = inputFoto.files[0];
  if (!foto) return;

  previa.src = URL.createObjectURL(foto);
  previa.hidden = false;
  escolherTexto.textContent = 'Toque para trocar a foto';
  enviarFoto.disabled = false;
  fotoEnviada.hidden = true;
});

// Por enquanto a foto fica só no aparelho. A ligação com o modelo entra aqui depois.
enviarFoto.addEventListener('click', () => {
  const item = document.createElement('li');
  const imagem = document.createElement('img');
  const texto = document.createElement('div');
  const data = document.createElement('small');

  imagem.src = previa.src;
  imagem.alt = 'Foto enviada';
  texto.textContent = 'Aguardando análise';
  data.textContent = new Date().toLocaleString('pt-BR');

  texto.append(data);
  item.append(imagem, texto);
  listaHistorico.prepend(item);
  historicoVazio.hidden = true;

  inputFoto.value = '';
  previa.hidden = true;
  escolherTexto.textContent = 'Toque para escolher uma foto';
  enviarFoto.disabled = true;
  fotoEnviada.hidden = false;
});
