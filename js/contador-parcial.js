const valores = [200, 100, 50, 20, 10, 5, 2, 1, 0.50, 0.25, 0.10, 0.05];
const select = document.getElementById('select-moeda');
const container = document.getElementById('lista-parcial');
let selecionados = {}; // Armazena as quantidades temporárias desta página

function init() {
    // Popula o Select
    valores.forEach(val => {
        const opt = document.createElement('option');
        opt.value = val;
        opt.textContent = `R$ ${val.toFixed(2)}`;
        select.appendChild(opt);
    });

    // Evento ao selecionar uma moeda
    select.addEventListener('change', (e) => {
        const val = e.target.value;
        if (!selecionados.hasOwnProperty(val)) {
            selecionados[val] = 0;
            renderizarLinha(val);
        }
        select.value = ""; // Reseta o select
    });
}

function renderizarLinha(val) {
    const v = parseFloat(val);
    const div = document.createElement('div');
    div.className = 'row-contador';
    div.id = `row-parcial-${v}`;
    div.innerHTML = `
        <div class="info-texto">
            <span class="label-cedula">R$ ${v.toFixed(2)}</span>
            <span class="valor-linha" id="sub-parcial-${v}">R$ 0,00</span>
        </div>
        <div class="controles">
            <button class="btn-ctrl btn-minus" onclick="alterarParcial(${v}, -1)">-</button>
            <input type="number" id="qty-parcial-${v}" value="0" class="input-qty" readonly>
            <button class="btn-ctrl btn-plus" onclick="alterarParcial(${v}, 1)">+</button>
        </div>
    `;
    container.appendChild(div);
    
    // Mostra a linha do Total Geral se houver pelo menos um item
    document.getElementById('row-total-parcial').style.display = 'flex';
}

window.alterarParcial = function(val, op) {
    const input = document.getElementById(`qty-parcial-${val}`);
    let res = parseInt(input.value) + op;
    if (res < 0) res = 0;
    input.value = res;
    
    selecionados[val] = res;
    document.getElementById(`sub-parcial-${val}`).innerText = 
        (res * val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    atualizarTotalParcial(); // Chama a soma geral da página
}

function atualizarTotalParcial() {
    let total = 0;
    for (let val in selecionados) {
        total += selecionados[val] * parseFloat(val);
    }
    
    const displayTotal = document.getElementById('total-geral-parcial');
    if (displayTotal) {
        displayTotal.innerText = total.toLocaleString('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
        });
    }
}

window.incrementarValores = function() {
    // 1. Busca o que já está salvo no contador principal
    const dadosPrincipais = JSON.parse(localStorage.getItem('dadosContador')) || {};

    // 2. Incrementa com os valores desta página
    for (let val in selecionados) {
        const qtdAtual = dadosPrincipais[val] || 0;
        dadosPrincipais[val] = qtdAtual + selecionados[val];
    }

    // 3. Salva de volta no LocalStorage do contador principal
    localStorage.setItem('dadosContador', JSON.stringify(dadosPrincipais));

    // 4. Feedback visual (Toast)
    const toast = document.getElementById("toast");
    toast.className = "show";
    setTimeout(() => { 
        toast.className = toast.className.replace("show", "");
        // Opcional: Limpa a página parcial após somar
        location.reload(); 
    }, 2000);
}

// Variável para guardar o valor em dinheiro após somar
let valorDinheiroFinal = 0;

// Máscara para Horário (00:00)
document.getElementById('rel-horario').addEventListener('input', function(e) {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 2) v = v.substring(0,2) + ":" + v.substring(2,4);
    e.target.value = v;
});

// Máscara para Moeda (PIX)
document.getElementById('rel-pix').addEventListener('input', function(e) {
    let v = e.target.value.replace(/\D/g, "");
    v = (v / 100).toFixed(2).replace(".", ",");
    v = v.replace(/\B(?=(\视觉d{3})+(?!\d))/g, ".");
    e.target.value = v;
});

// Altera a função incrementarValores original
const originalIncrementar = window.incrementarValores;
window.incrementarValores = function() {
    // Calcula o total atual antes de resetar a página
    let totalSoma = 0;
    for (let val in selecionados) {
        totalSoma += selecionados[val] * parseFloat(val);
    }
    valorDinheiroFinal = totalSoma;

    // Salva no localStorage para não perder se atualizar
    localStorage.setItem('ultimoValorColeta', valorDinheiroFinal);

    // Chama a lógica original de salvar nos totais
    const dadosPrincipais = JSON.parse(localStorage.getItem('dadosContador')) || {};
    for (let val in selecionados) {
        dadosPrincipais[val] = (dadosPrincipais[val] || 0) + selecionados[val];
    }
    localStorage.setItem('dadosContador', JSON.stringify(dadosPrincipais));

    // Feedback e Troca de Botões
    document.getElementById('btn-somar').style.display = 'none';
    document.getElementById('btn-relatorio').style.display = 'block';
    document.getElementById('rel-dinheiro').value = valorDinheiroFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    // Mostra o Toast
    const toast = document.getElementById("toast");
    toast.innerText = "✅ Valores somados ao Principal!";
    toast.className = "show";
    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 2000);
}

window.gerenciarRelatorio = function() {
    const form = document.getElementById('form-relatorio');
    
    // Se o formulário está escondido, mostra ele
    if (form.style.display === 'none') {
        form.style.display = 'block';
        window.scrollTo(0, document.body.scrollHeight);
    } else {
        // Se já está aberto, valida e envia WhatsApp
        enviarWhatsApp();
    }
}

function enviarWhatsApp() {
    const horario = document.getElementById('rel-horario').value;
    const pixStr = document.getElementById('rel-pix').value || "0,00";
    const pix = parseFloat(pixStr.replace(".", "").replace(",", ".")) || 0;
    const participantes = document.getElementById('rel-participantes').value;
    
    // Captura e formata a data atual
    const dataAtual = new Date().toLocaleDateString('pt-BR');

    const totalGeral = valorDinheiroFinal + pix;
    const totalFormatado = totalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Montagem da mensagem com a nova frase e data
    const mensagem = `⛪ *Resultado da coleta após a missa* das ${horario} do dia ${dataAtual}%0A%0A` +
                     `💰 *Valor total:* ${totalFormatado}%0A%0A` +
                     `🤝 *Participaram:* ${participantes}`;

    // Abre o WhatsApp
    window.open(`https://wa.me/?text=${mensagem}`, '_blank');
}

init();