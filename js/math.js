export const toInt = (val) => {
    if (!val) return 0;
    // Remove pontos de milhar e troca vírgula por vazio para tratar como centavos
    return parseInt(val.replace(/\./g, '').replace(',', '')) || 0;
};

export const toReal = (intVal) => {
    return (intVal / 100).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

export const calcularDecima = (baseCentavos) => {
    return Math.floor(baseCentavos * 0.10);
};