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

export const isDataValida = (dataString) => {
    // Verifica se está no formato dd/mm/aaaa
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(dataString)) return false;

    const [_, dia, mes, ano] = dataString.match(regex).map(Number);

    // Objeto Date do JS interpreta datas inexistentes rolando para o próximo mês
    // Ex: 31/02 vira 02/03. Por isso, checamos se os valores permanecem iguais.
    const data = new Date(ano, mes - 1, dia);
    return (
        data.getFullYear() === ano &&
        data.getMonth() === mes - 1 &&
        data.getDate() === dia
    );
};