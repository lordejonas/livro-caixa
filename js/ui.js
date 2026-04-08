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
    let value = e.target.value.replace(/\D/g, "");
    value = (value / 100).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    e.target.value = value === "0,00" ? "" : value;
};

export const aplicarMascaraData = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2 && value.length <= 4) {
        value = value.replace(/(\d{2})(\d{1,2})/, "$1/$2");
    } else if (value.length > 4) {
        value = value.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
    }
    e.target.value = value;
};