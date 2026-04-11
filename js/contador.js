const valores = [200, 100, 50, 20, 10, 5, 2, 1, 0.50, 0.25, 0.10, 0.05];
const container = document.getElementById('lista-dinheiro');

// 1. Inicia a página
function init() {
    // Recupera dados salvos (se existirem)
    const dadosSalvos = JSON.parse(localStorage.getItem('dadosContador')) || {};

    valores.forEach(val => {
        const qtySalva = dadosSalvos[val] || 0; // Pega a quantidade salva ou 0
        const div = document.createElement('div');
        div.className = 'row-contador';
        div.innerHTML = `
            <div class="info-texto">
                <span class="label-cedula">R$ ${val.toFixed(2)}</span>
                <span class="valor-linha" id="total-${val}">R$ ${(qtySalva * val).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
            </div>
            <div class="controles">
                <button class="btn-ctrl btn-minus" onclick="alterar(${val}, -1)">-</button>
                <input type="number" id="qty-${val}" value="${qtySalva}" class="input-qty" readonly>
                <button class="btn-ctrl btn-plus" onclick="alterar(${val}, 1)">+</button>
            </div>
        `;
        container.appendChild(div);
    });
    atualizarTotal();
}

// 2. Altera as quantidades
window.alterar = function(val, op) {
    const input = document.getElementById(`qty-${val}`);
    let res = parseInt(input.value) + op;
    if (res < 0) res = 0;
    input.value = res;
    
    document.getElementById(`total-${val}`).innerText = 
        (res * val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    atualizarTotal();
}

// 3. Soma tudo na tela
function atualizarTotal() {
    let total = 0;
    valores.forEach(v => {
        const input = document.getElementById(`qty-${v}`);
        if (input) {
            total += parseInt(input.value) * v;
        }
    });
    document.getElementById('total-geral').innerText = 
        total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// 4. FUNÇÃO NOVA: Salva no LocalStorage
window.salvarValores = function() {
    const dadosParaSalvar = {};
    valores.forEach(v => {
        const q = document.getElementById(`qty-${v}`).value;
        dadosParaSalvar[v] = parseInt(q);
    });

    localStorage.setItem('dadosContador', JSON.stringify(dadosParaSalvar));

    // Exibe o Toast em vez do alert
    const toast = document.getElementById("toast");
    toast.className = "show";
    
    // Remove a classe 'show' após 3 segundos para ele sumir
    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
}

init();