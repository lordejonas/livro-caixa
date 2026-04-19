import { toInt, toReal } from './math.js';

export function enviarWhatsApp() {
    const numeroAta = document.getElementById('vf40').value || "----";
    const dataReuniao = document.getElementById('vf41').value || new Date().toLocaleDateString('pt-BR');

    /*Coletar valores receitas*/
    const vf1 = toInt(document.getElementById('vf1').value);
    const vf6 = toInt(document.getElementById('vf6').value);
    const vf13 = toInt(document.getElementById('vf13').value);
    const vf14 = document.getElementById('vf14').value;

    /*Coletar valores despesas*/
    const vf24 = toInt(document.getElementById('vf24').value);
    const vf26 = toInt(document.getElementById('vf26').value);
    const vf27 = toInt(document.getElementById('vf27').value);
    const totRepasses = vf26 + vf27;
    const vf28 = toInt(document.getElementById('vf28').value);
    const vf29 = document.getElementById('vf29').value;

    let mensagem = `*POSIÇÃO CAIXA DA CONFERÊNCIA*\n`;
    mensagem += `*Dia ${dataReuniao} - Ata Nº ${numeroAta}*\n`;
    mensagem += "--------------------------\n\n";
    mensagem += `Saldo anterior: R$ ${vf14}\n\n`;
    mensagem += "*RECEITAS*\n";
    mensagem += receitas(vf1, vf6, vf13);
    mensagem += "*DESPESAS*\n";
    mensagem += despesas(vf24, vf28, totRepasses);
    mensagem += "*TOTAIS*\n";
    mensagem += `Saldo final: R$ ${vf29}\n\n`;
    mensagem += "--------------------------\n";
    mensagem += "_Relatório gerado pelo App Livro Caixa_";

    //console.log(mensagem);

    window.open("https://wa.me/?text=" + encodeURIComponent(mensagem), '_blank');
}

function receitas(vf1, vf6, vf13) {
    
    let linhas = [];

    const temColeta = vf1 > 0;
    const temExtraDecima = vf13 > vf6;
    const temDiferencaDemais = vf6 > vf1;

    // 1. Sempre mostra se existir
    if (temColeta) {
        linhas.push(`Coleta na reunião: R$ ${toReal(vf1)}`);
    }

    // 2. REGRA ESPECIAL: "Demais receitas" só aparece se houver Coleta OU Extra Décima
    if (temDiferencaDemais && (temColeta || temExtraDecima)) {
        linhas.push(`Demais receitas: R$ ${toReal(vf6 - vf1)}`);
    }

    // 3. Sempre mostra se existir
    if (temExtraDecima) {
        linhas.push(`Receitas não sujeitas décima: R$ ${toReal(vf13 - vf6)}`);
    }

    // 4. Total sempre aparece
    linhas.push(`Total receitas: R$ ${toReal(vf13)}`);

    return linhas.join('\n') + '\n\n';
}

function despesas(vf24, vf28, totalRepasses){
    let linhas = [];
    const temDecima = vf24 > 0;
    const temAlemDecimaErepasse = (vf28 != (vf24 + totalRepasses));
    const temRepasses = totalRepasses > 0;
    
    if(temDecima)
        linhas.push(`Recolhimento décima: R$ ${toReal(vf24)}`);

    if(temAlemDecimaErepasse)
        linhas.push(`Demais despesas: R$ ${toReal(vf28 - vf24 - totalRepasses)}`)

    if(temRepasses)
        linhas.push(`Repasses ao C.P.: R$ ${toReal(totalRepasses)}`)

    linhas.push(`Total despesas: R$ ${toReal(vf28)}`);
    return linhas.join('\n') + '\n\n';;
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