// 1. Registro do Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .catch(err => console.error('Erro ao registrar SW:', err));
    });
}

// 2. Importações de Módulos
import * as math from './math.js';
import * as ui from './ui.js';
import { enviarWhatsApp } from './export.js';

// 3. Inicialização e Eventos
document.addEventListener('DOMContentLoaded', () => {
    // Preencher data atual
    const inputData = document.getElementById('vf41');
    if (inputData && !inputData.value) {
        inputData.value = new Date().toLocaleDateString('pt-BR');
    }

    // Configurar Máscaras de Input
    document.querySelectorAll('.input-mask').forEach(input => {
        input.addEventListener('input', ui.aplicarMascaraMoeda);
    });
    if (inputData) inputData.addEventListener('input', ui.aplicarMascaraData);

    // Botões Principais
    document.getElementById('btn-consolidar').addEventListener('click', consolidar);
    document.getElementById('btn-whatsapp').addEventListener('click', enviarWhatsApp);
    document.getElementById('btn-limpar-todos').addEventListener('click', () => {
        if (confirm("Deseja realmente limpar todos os dados?")) window.location.reload();
    });

    // Seletor de Lançamentos (Lógica de Menu)
    document.getElementById('cbx-fields').addEventListener('change', function() {
        const selectedId = this.value;
        if (selectedId === "field-0") return;

        const initialState = document.getElementById("initial-state").value === '1';
        const valF37 = document.getElementById("vf37").value;
        const valData = document.getElementById("vf41").value; // Data da reunião

        // 1. Validação de Saldo Inicial
        if (initialState && !valF37) {
            ui.exibirMensagem("Para começar, insira o valor do campo:\n'Valores Reunião Passada'");
            this.value = "field-0";
            return;
        }

        // 2. Validação de Data Existente
        if (initialState && !math.isDataValida(valData)) {
            ui.exibirMensagem(`A data "${valData}" não existe.\nPor favor, informe uma data válida.`);
            document.getElementById("vf41").focus();
            this.value = "field-0";
            return;
        }

        ui.limparMensagem();
        ui.limparInterfaceParaNovoLancamento();

        if (initialState) {
            // Migra saldo da reunião passada para o fluxo atual
            document.getElementById("vf14").value = valF37;
            document.getElementById("initial-state").value = '0';
            document.getElementById("reuniao-passada-table").style.display = 'none';
            document.getElementById("btn-limpar-todos").style.display = 'block';
        }

        const fieldNumber = parseInt(selectedId.split('-')[1]);
        const targetTable = (fieldNumber <= 15) ? "receita-table" : "despesa-table";
        document.getElementById(targetTable).style.display = 'block';

        const row = document.getElementById(selectedId);
        if (row) {
            row.style.display = 'flex';
            document.getElementById('btn-consolidar').style.display = 'block';
            row.querySelector('input').focus();
        }
        this.value = "field-0";
    });
});

// 4. Função Principal de Consolidação
function consolidar() {
    // --- PARTE A: RECEITAS ---
    const r1 = math.toInt(document.getElementById('vf1').value);
    const r2 = math.toInt(document.getElementById('vf2').value);
    const r3 = math.toInt(document.getElementById('vf3').value);
    const r4 = math.toInt(document.getElementById('vf4').value);
    const r5 = math.toInt(document.getElementById('vf5').value);
    
    // Subtotal Base Décima (Campos 01 a 05)
    const r6 = r1 + r2 + r3 + r4 + r5;
    ui.mostrarLinha('vf6', math.toReal(r6));

    // Receitas Extras e Totais
    const r7 = math.toInt(document.getElementById('vf7').value);
    const r8 = math.toInt(document.getElementById('vf8').value);
    const r9 = math.toInt(document.getElementById('vf9').value);
    const r10 = math.toInt(document.getElementById('vf10').value);
    const r11 = math.toInt(document.getElementById('vf11').value);
    const r12 = math.toInt(document.getElementById('vf12').value);

    const r13 = r6 + r7 + r8 + r9 + r10 + r11 + r12; // Soma Receita Semana
    ui.mostrarLinha('vf13', math.toReal(r13));

    const r14 = math.toInt(document.getElementById('vf14').value); // Saldo Anterior
    const r15 = r13 + r14; // Balanço Total
    ui.mostrarLinha('vf15', math.toReal(r15));

    // --- PARTE B: DESPESAS E REPASSES ---
    const d24 = math.calcularDecima(r6); // 10% do r6
    ui.mostrarLinha('vf24', math.toReal(d24));

    const d26 = r8; // Repasse Solidariedade/Ozanam (Espelha o Campo 08)
    ui.mostrarLinha('vf26', math.toReal(d26));

    const d27 = r12; // Repasse referente à linha 12
    ui.mostrarLinha('vf27', math.toReal(d27));

    // Soma todas as despesas (16 a 27, pulando as que não existem ou são labels)
    const dDespesasFixas = 
        math.toInt(document.getElementById('vf16').value) + 
        math.toInt(document.getElementById('vf17').value) + 
        math.toInt(document.getElementById('vf18').value) + 
        math.toInt(document.getElementById('vf19').value) + 
        math.toInt(document.getElementById('vf20').value) + 
        math.toInt(document.getElementById('vf21').value) + 
        math.toInt(document.getElementById('vf22').value) + 
        math.toInt(document.getElementById('vf23').value) + 
        math.toInt(document.getElementById('vf25').value);

    const d28 = dDespesasFixas + d24 + d26 + d27; // Soma Total Despesas
    ui.mostrarLinha('vf28', math.toReal(d28));

    // Saldos Finais
    const r29 = r15 - d28; // Saldo Final Semana Atual
    ui.mostrarLinha('vf29', math.toReal(r29));
    
    ui.mostrarLinha('vf30', math.toReal(d28 + r29)); // Verificação (deve ser igual ao r15)

    // --- PARTE C: RESUMO SITUAÇÃO CAIXA (TESOURARIA) ---
    const pastTenth = math.toInt(document.getElementById('vf38').value);
    const totalTenth = d24 + pastTenth; // Décimas acumuladas (Hoje + Passado)
    ui.mostrarLinha('vf34', math.toReal(totalTenth));

    const pastContributions = math.toInt(document.getElementById('vf39').value);
    const totalOthers = pastContributions + d26 + d27; // Outros repasses
    ui.mostrarLinha('vf35', math.toReal(totalOthers));

    // Recursos em Tesouraria (Saldo Livre + o que deve ser repassado ao CP)
    const totalResources = r29 + totalTenth + pastContributions; 
    ui.mostrarLinha('vf36', math.toReal(totalResources));

    // Finalização Visual
    document.getElementById('resumo-table').style.display = 'block';
    document.getElementById("btn-whatsapp").style.display = 'block';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}