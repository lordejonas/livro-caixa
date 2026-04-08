import { toInt } from './math.js';

export const mostrarLinha = (id, valorFormatado) => {
    const campo = document.getElementById(id);
    if (campo) {
        campo.value = valorFormatado;
        const row = campo.closest('.table-row');
        if (row) row.style.display = 'flex';
    }
};

export const limparInterfaceParaNovoLancamento = () => {
    // Esconde campos desabilitados e o resumo
    document.querySelectorAll('input:disabled').forEach(input => {
        const row = input.closest('.table-row');
        if (row) row.style.display = 'none';
    });
    document.getElementById("resumo-table").style.display = 'none';
    document.getElementById("btn-whatsapp").style.display = 'none';
};

export const aplicarMascaraMoeda = (e) => {
    let input = e.target;
    let value = input.value.replace(/\D/g, "");

    // Evita processar se estiver vazio para não travar o backspace
    if (value === "") {
        input.value = "";
        return;
    }

    // Converte para número e formata
    const options = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
    const result = new Intl.NumberFormat('pt-BR', options).format(
        parseFloat(value) / 100
    );

    input.value = result;

    // Força o cursor a ficar sempre no final do input (comum em máscaras de moeda)
    // Isso evita que o usuário tente editar o meio do número, o que quebra a lógica
    setTimeout(() => {
        input.setSelectionRange(input.value.length, input.value.length);
    }, 0);
};

export const aplicarMascaraData = (e) => {
    let input = e.target;
    let value = input.value.replace(/\D/g, ""); // Remove tudo que não é dígito
    
    if (value.length > 8) value = value.slice(0, 8); // Limita a 8 dígitos (DDMMYYYY)

    let formatted = "";
    if (value.length > 0) {
        formatted = value.substring(0, 2);
        if (value.length > 2) {
            formatted += "/" + value.substring(2, 4);
            if (value.length > 4) {
                formatted += "/" + value.substring(4, 8);
            }
        }
    }

    input.value = formatted;

    // Ajuste de cursor para iOS
    if (input.setSelectionRange) {
        setTimeout(() => {
            input.setSelectionRange(input.value.length, input.value.length);
        }, 0);
    }
};

let messageTimer;

export const exibirMensagem = (texto, duracao = 5000) => {
    const msgDiv = document.getElementById("message");
    if (!msgDiv) return;

    // Limpa qualquer timer que já esteja rodando (caso o usuário clique várias vezes)
    clearTimeout(messageTimer);

    msgDiv.textContent = texto;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Define o timer para sumir com a mensagem
    messageTimer = setTimeout(() => {
        msgDiv.textContent = "";
    }, duracao);
};

export const limparMensagem = () => {
    clearTimeout(messageTimer);
    const msgDiv = document.getElementById("message");
    if (msgDiv) msgDiv.textContent = "";
};

export const toggleModal = (show) => {
    const modal = document.getElementById('modal-confirm');
    if (modal) {
        modal.style.display = show ? 'flex' : 'none';
    }
};