import { toInt, toReal } from './math.js';

export function enviarWhatsApp_old() {
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

    console.log(mensagem);

    //window.open("https://wa.me/?text=" + encodeURIComponent(mensagem), '_blank');
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

export function enviarWhatsApp() {
    // 1. Mapeamento de nomes resumidos (Dicionário)
    const nomesCampos = {
        'vf1': 'Coleta Reunião',
        'vf2': 'Benfeitores',
        'vf3': 'Doações',
        'vf4': 'Eventos/Bazar etc',
        'vf5': 'Outras Rec. suj.(Décima)',
        'vf7': 'Subv. Pública',
        'vf8': 'Solidariedade/Ozanam',
        'vf9': 'União Fraternal (E)',
        'vf10': 'Outros 1', // Será sobrescrito se houver descrição manual
        'vf11': 'Outros 2', // Será sobrescrito se houver descrição manual
        'vf12': 'Rec. p/ Repasse',
        
        'vf16': 'Básicas, Cestas, etc',
        'vf17': 'Moradia Assistidos',
        'vf18': 'Pagamento Conta Assist.',
        'vf19': 'Obras Especiais',
        'vf20': 'União Fraternal (S)',
        'vf21': 'Outros 1', // Será sobrescrito se houver descrição manual
        'vf22': 'Outros 2', // Será sobrescrito se houver descrição manual
        'vf23': 'Desp. Admin',
        'vf24': 'Décimas C.P.',
        'vf25': 'Outros 3', // Será sobrescrito se houver descrição manual
        'vf26': 'Repasse Ozanam/Solid.',
        'vf27': 'Repasse Linha 12'
    };

    // 2. Função auxiliar para capturar valores e nomes
    const obterLinha = (id) => {
        const campo = document.getElementById(id);
        if (!campo) return "";
        
        const valor = campo.value;
        if (!valor || valor === "0,00" || valor === "0") return "";

        let nome = nomesCampos[id] || "Campo " + id;

        // Se for um dos campos "Outros", tenta pegar a descrição manual
        const inputDescManual = document.getElementById(`desc-${id}`);
        if (inputDescManual && inputDescManual.value.trim() !== "") {
            nome = inputDescManual.value.trim();
        }

        return `🔹 ${nome}: R$ ${valor}\n`;
    };

    // 3. Captura de Totais
    const numeroAta = document.getElementById('vf40').value || "----";
    const dataReuniao = document.getElementById('vf41').value || new Date().toLocaleDateString('pt-BR');
    const saldoAnterior = document.getElementById('vf14').value || "0,00";
    const totalReceitas = document.getElementById('vf13').value || "0,00";
    const totalDespesas = document.getElementById('vf28').value || "0,00";
    const saldoFinal = document.getElementById('vf29').value || "0,00";

    // 4. Construção das seções
    let secaoReceitas = "";
    // Percorre campos 1 a 12 (pulando o 6)
    [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12].forEach(num => {
        secaoReceitas += obterLinha(`vf${num}`);
    });

    let secaoDespesas = "";
    // Percorre campos 16 a 27
    for (let i = 16; i <= 27; i++) {
        secaoDespesas += obterLinha(`vf${i}`);
    }

    // 5. Montagem da Mensagem
    //let msg = `📊 *RELATÓRIO DE CAIXA SSVP*\n\n`;
    let msg = `*POSIÇÃO CAIXA DA CONFERÊNCIA*\n`;
    msg += `*Dia ${dataReuniao} - Ata Nº ${numeroAta}*\n`;
    msg += "--------------------------\n\n";
    msg += `💰 *Saldo anterior:* R$ ${saldoAnterior}\n\n`;

    msg += `📈 *RECEITAS*\n`;
    msg += secaoReceitas;
    msg += `*Total receitas: R$ ${totalReceitas}*\n\n`;

    msg += `📉 *DESPESAS*\n`;
    msg += secaoDespesas;
    msg += `*Total despesas: R$ ${totalDespesas}*\n\n`;

    msg += `✅ *TOTAIS*\n`;
    msg += `*Saldo final em caixa: R$ ${saldoFinal}*\n\n`;
    msg += `_Gerado pelo App Tesouraria_`;

    // 6. Envio
    //console.log(msg);
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
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