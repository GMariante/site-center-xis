let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

/**
 * Salva o carrinho no localStorage
 */
function salvarCarrinho() {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

/**
 * Adiciona um item ao carrinho.
 * Se o item já existir, incrementa a quantidade.
 * @param {string} nome - Nome do produto
 * @param {number} preco - Preço do produto
 */
function adicionarCarrinho(nome, preco, exibirAlerta = true) {
  const itemExistente = carrinho.find(item => item.nome === nome);
  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({ nome, preco, quantidade: 1 });
  }
  salvarCarrinho();
  if (exibirAlerta) {
    alert(`${nome} adicionado ao carrinho!`);
  }
  atualizarContadorCarrinho();
  
  // Removemos o redirecionamento automático para o carrinho!
  // Antes aqui tinha: if (!exibirAlerta) { window.location.href = 'carrinho.html'; }
}

/**
 * Atualiza o contador de itens do carrinho na interface (se existir).
 */
function atualizarContadorCarrinho() {
  const contador = document.getElementById('contadorCarrinho');
  if (contador) {
    const totalQuantidade = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    contador.textContent = totalQuantidade;
  }
}

/**
 * Limpa o carrinho, salva e renderiza.
 */
function limparCarrinho() {
  carrinho = [];
  salvarCarrinho();
  renderizarCarrinho();
  atualizarContadorCarrinho();
}

/**
 * Remove um item do carrinho pelo nome.
 * @param {string} nome - Nome do produto
 */
function removerItem(nome) {
  carrinho = carrinho.filter(item => item.nome !== nome);
  salvarCarrinho();
  renderizarCarrinho();
  atualizarContadorCarrinho();
}

/**
 * Renderiza o carrinho na página.
 * Deve haver um elemento com id "carrinho" para exibir.
 */
function renderizarCarrinho() {
  const carrinhoDiv = document.getElementById('carrinho');
  if (!carrinhoDiv) return;

  carrinhoDiv.innerHTML = '';

  if (carrinho.length === 0) {
    carrinhoDiv.innerHTML = '<p>Seu carrinho está vazio.</p>';
    return;
  }

  const tabela = document.createElement('table');
  tabela.innerHTML = `
    <thead>
      <tr>
        <th>Produto</th>
        <th>Preço</th>
        <th>Qtd</th>
        <th>Subtotal</th>
        <th>Remover</th>
      </tr>
    </thead>
  `;

  let total = 0;

  carrinho.forEach(item => {
    const subtotal = item.preco * item.quantidade;
    total += subtotal;

    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td>${item.nome}</td>
      <td>R$ ${item.preco.toFixed(2).replace('.', ',')}</td>
      <td>${item.quantidade}</td>
      <td>R$ ${subtotal.toFixed(2).replace('.', ',')}</td>
      <td><button onclick="removerItem('${item.nome}')">❌</button></td>
    `;
    tabela.appendChild(linha);
  });

  const rodape = document.createElement('tfoot');
  rodape.innerHTML = `
    <tr>
      <td colspan="3" style="text-align:right; font-weight:bold;">Total:</td>
      <td colspan="2" style="font-weight:bold;">R$ ${total.toFixed(2).replace('.', ',')}</td>
    </tr>
  `;

  tabela.appendChild(rodape);
  carrinhoDiv.appendChild(tabela);
}

function finalizarPedido() {
  if (carrinho.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }

  const observacoes = document.getElementById('observacoes') ? document.getElementById('observacoes').value.trim() : '';
  let mensagem = `*Pedido - Center Xis*\n\n*Itens:*\n`;

  let total = 0;
  carrinho.forEach(item => {
    const subtotal = item.preco * item.quantidade;
    total += subtotal;
    mensagem += `- ${item.nome} x${item.quantidade} = R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
  });

  mensagem += `\n*Total:* R$ ${total.toFixed(2).replace('.', ',')}\n`;
  if (observacoes) {
    mensagem += `\n*Observações:* ${observacoes}\n`;
  }

  const telefone = '5551998678618'; // substituir pelo número correto com DDD
  const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');

  limparCarrinho();
  window.location.href = 'index.html';
}

// Renderiza o carrinho ao carregar a página se o elemento existir
document.addEventListener('DOMContentLoaded', () => {
  renderizarCarrinho();
  atualizarContadorCarrinho();
});


