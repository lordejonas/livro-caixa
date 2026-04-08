import { toInt, toReal } from './math.js';

export function enviarWhatsApp() {
    const numeroAta = document.getElementById('vf40').value || "---";
    const dataReuniao = document.getElementById('vf41').value || new Date().toLocaleDateString('pt-BR');

    const vf1 = toInt(document.getElementById('vf1').value);
    const vf13 = toInt(document.getElementById('vf13').value);
    const demaisReceitas = vf13 - vf1;

    const vf24 = toInt(document.getElementById('vf24').value);
    const vf28 = toInt(document.getElementById('vf28').value);
    const subTotalDespesas = vf28 - vf24;
    const vf29 = document.getElementById('vf29').value;

    let mensagem = `*LIVRO CAIXA - ATA Nº ${numeroAta}*\n`;
    mensagem += `*DATA DA REUNIÃO: ${dataReuniao}*\n`;
    mensagem += "--------------------------\n\n";

    mensagem += "*RECEITAS*\n";
    if (vf1 > 0) mensagem += `Coleta na reunião: R$ ${toReal(vf1)}\n`;
    if (demaisReceitas > 0) mensagem += `Demais Receitas: R$ ${toReal(demaisReceitas)}\n`;
    mensagem += `Total: R$ ${toReal(vf13)}\n\n`;

    mensagem += "*DESPESAS*\n";
    if (vf24 > 0) mensagem += `Décimas pagas ao C.P.: R$ ${toReal(vf24)}\n`;
    if (subTotalDespesas > 0) mensagem += `Sub total despesas: R$ ${toReal(subTotalDespesas)}\n`;
    mensagem += `Total: R$ ${toReal(vf28)}\n\n`;

    mensagem += "*TOTAIS*\n";
    mensagem += `Saldo final: R$ ${vf29}\n\n`;
    mensagem += "--------------------------\n";
    mensagem += "_Relatório gerado pelo App Livro Caixa_";

    window.open("https://wa.me/?text=" + encodeURIComponent(mensagem), '_blank');
}
/*
function enviarWhatsApp() {
    // 1. Funções auxiliares para conversão (conforme você já usa no script)
    const toInt = (val) => {
        if (!val) return 0;
        return parseInt(val.replace(/\./g, '').replace(',', '')) || 0;
    };

    const toReal = (intVal) => {
        return (intVal / 100).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // 2. Coleta e Cálculo dos Valores
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    
    // Receitas
    const vf1 = toInt(document.getElementById('vf1').value); // Coleta
    const vf13 = toInt(document.getElementById('vf13').value); // Soma Receita Semana
    const demaisReceitas = vf13 - vf1;
    const totalReceitas = vf1 + demaisReceitas; // ou simplesmente vf13

    // Despesas
    const vf24 = toInt(document.getElementById('vf24').value); // Décimas
    const vf28 = toInt(document.getElementById('vf28').value); // Soma Despesas
    const subTotalDespesas = vf28 - vf24;
    const totalDespesas = vf28;

    // Totais
    const vf29 = document.getElementById('vf29').value; // Saldo Final

    const numeroAta = document.getElementById('vf40').value || "Não inf.";
    const dataReuniao = document.getElementById('vf41').value || dataAtual;

    // 3. Montagem da Mensagem (Template solicitado)
    let mensagem = `*POSIÇÃO DO CAIXA DIA ${dataReuniao}*\n`;

    mensagem += `*ATA Nº ${numeroAta}*\n`;
    mensagem += "--------------------------\n\n";

    mensagem += "*RECEITAS*\n";

    if (vf1 > 0) {// SÓ mostra a Coleta se for maior que zero
        mensagem += `Coleta na reunião: R$ ${toReal(vf1)}\n`;
    }

    mensagem += `Demais Receitas: R$ ${toReal(demaisReceitas)}\n`;
    mensagem += `Total: R$ ${toReal(totalReceitas)}\n\n`;

    mensagem += "*DESPESAS*\n";

    if (vf24 > 0) {// SÓ mostra as Décimas se houver valor
        mensagem += `Décimas recolhida: R$ ${toReal(vf24)}\n`;
    }

    mensagem += `Sub total despesas: R$ ${toReal(subTotalDespesas)}\n`;
    mensagem += `Total: R$ ${toReal(totalDespesas)}\n\n`;

    mensagem += "*TOTAIS*\n";
    mensagem += `Saldo final: R$ ${vf29}\n\n`;

    mensagem += "--------------------------\n";
    mensagem += "_Relatório gerado pelo App Livro Caixa_";

    // 4. Envio
    const uri = "https://wa.me/?text=" + encodeURIComponent(mensagem);
    window.open(uri, '_blank');
}
*/
/*
function enviarWhatsApp() {
    let mensagem = "*LIVRO CAIXA SSVP*\n";
    mensagem += "--------------------------\n";

    // Pega as tabelas que estão visíveis
    const secoes = [
        { id: 'receita-table', titulo: "*RECEITAS*" },
        { id: 'despesa-table', titulo: "*DESPESAS*" },
        { id: 'resumo-table', titulo: "*RESUMO FINAL*" }
    ];

    secoes.forEach(secao => {
        const tabela = document.getElementById(secao.id);
        if (tabela && tabela.style.display !== 'none') {
            mensagem += `\n${secao.titulo}\n`;
            
            tabela.querySelectorAll('.table-row').forEach(row => {
                // Só inclui na mensagem se a linha estiver visível (ou seja, tem valor)
                if (row.style.display !== 'none') {
                    const desc = row.querySelector('.table-item-desc').innerText;
                    const val = row.querySelector('input').value;
                    mensagem += `${desc}: R$ ${val}\n`;
                }
            });
        }
    });

    mensagem += "\n--------------------------\n";
    mensagem += "_Relatório gerado pelo App Caixa SSVP_";

    // Codifica para URL e abre o WhatsApp
    const uri = "https://wa.me/?text=" + encodeURIComponent(mensagem);
    window.open(uri, '_blank');
}*/