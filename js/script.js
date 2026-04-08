// Registro do Service Worker para PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

document.getElementById('btn-whatsapp').addEventListener('click', enviarWhatsApp);

document.addEventListener('focusin', (event) => {
    const campo = event.target;
    const isInitialState = document.getElementById("initial-state").value === '1';

    // SÓ executa a limpeza se:
    // 1. O clique for em um campo de valor que NÃO está desabilitado
    // 2. NÃO estivermos mais no estado inicial (ou seja, o usuário já passou da 'reuniao-passada')
    if (campo.classList.contains('valor') && !campo.disabled && !isInitialState) {
        
        // Esconde apenas os campos 'disabled' (resultados/subtotais)
        document.querySelectorAll('input:disabled').forEach(input => {
            const row = input.closest('.table-row');
            if (row) row.style.display = 'none';
        });

        // NOTA: Não forçamos o display:block das sections aqui.
        // Se o campo já está visível para o usuário clicar, a section dele já está aberta.
        document.getElementById("resumo-table").style.display = 'none';
        document.getElementById("btn-whatsapp").style.display = 'none';
    }

});

document.addEventListener('DOMContentLoaded', () => {
    preencherDataAtual();
    
    const cbxFields = document.getElementById('cbx-fields');
    const btnConsolidar = document.getElementById('btn-consolidar');
    const btnLimpar = document.getElementById('btn-limpar-todos');

    // Listener para o Select dinâmico
    cbxFields.addEventListener('change', handleFieldSelection);

    // Listener para formatação de moeda em tempo real (Substitui o formatValue antigo)
    document.querySelectorAll('.input-mask').forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, "");
            value = (value / 100).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            e.target.value = value === "0,00" ? "" : value;
        });
    });

    const inputData = document.getElementById('vf41');
    
    // 1. Preenche com a data atual ao carregar
    const hoje = new Date();
    inputData.value = hoje.toLocaleDateString('pt-BR');

    // 2. Máscara de auto-completar para a Data (dd/mm/aaaa)
    inputData.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não é número
        
        if (value.length > 2 && value.length <= 4) {
            value = value.replace(/(\d{2})(\d{1,2})/, "$1/$2");
        } else if (value.length > 4) {
            value = value.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
        }
        e.target.value = value;
    });

    btnConsolidar.addEventListener('click', consolidate);
    btnLimpar.addEventListener('click', clearAll);
});

function handleFieldSelection() {
    const initialState = document.getElementById("initial-state").value === '1';
    const valF37 = document.getElementById("vf37").value;
    const selectedId = this.value; // Ex: "field-1" ou "field-16"

    if (selectedId === "field-0") return;

    // Validação de segurança: exige saldo inicial antes de começar
    if (initialState && !valF37) {
        document.getElementById("message").textContent = "Insira o saldo anterior antes de prosseguir.";
        this.value = "field-0";
        return;
    }

    document.getElementById("message").textContent = "";

    //limpar os resultados da tela para o usuário focar na nova inserção
    document.querySelectorAll('input:disabled').forEach(input => {
        const row = input.closest('.table-row');
        if (row) row.style.display = 'none';
    });
    
    // Se for o primeiro lançamento, configura o estado inicial
    if (initialState) {
        document.getElementById("vf14").value = valF37;
        document.getElementById("initial-state").value = '0';
        document.getElementById("reuniao-passada-table").style.display = 'none';
        document.getElementById("btn-limpar-todos").style.display = 'block';
    }

    // Extrai o número do campo (ex: de "field-16" extrai 16)
    const fieldNumber = parseInt(selectedId.split('-')[1]);

    // Mostra a tabela correspondente
    if (fieldNumber >= 1 && fieldNumber <= 15) {
        document.getElementById("receita-table").style.display = 'block';
    } else {
        document.getElementById("despesa-table").style.display = 'block';
    }

    // Exibe a linha para digitação
    const targetRow = document.getElementById(selectedId);
    if (targetRow) {
        targetRow.style.display = 'flex';
        document.getElementById('btn-consolidar').style.display = 'block';
        const input = targetRow.querySelector('input');
        if (input) input.focus();
    }

    this.value = "field-0";
}

function consolidate() {
    validatePresentFieldsInForm();
    // 1. Funções auxiliares para conversão (Real -> Centavos -> Real)
    const toInt = (val) => {
        if (!val) return 0;
        // Remove pontos de milhar e troca vírgula por nada para tratar como inteiro (centavos)
        return parseInt(val.replace(/\./g, '').replace(',', '')) || 0;
    };

    const toReal = (intVal) => {
        return (intVal / 100).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // 2. Coleta de Valores de Receita
    const r1 = toInt(document.getElementById('vf1').value);
    const r2 = toInt(document.getElementById('vf2').value);
    const r3 = toInt(document.getElementById('vf3').value);
    const r4 = toInt(document.getElementById('vf4').value);
    const r5 = toInt(document.getElementById('vf5').value);
    
    // Campo 06: Subtotal Base para Décima (1 a 5)
    const r6 = r1 + r2 + r3 + r4 + r5;
    document.getElementById('vf6').value = toReal(r6);
    document.getElementById('field-6').style.display = 'flex';

    const r7 = toInt(document.getElementById('vf7').value);
    const r8 = toInt(document.getElementById('vf8').value);
    const r9 = toInt(document.getElementById('vf9').value);
    const r10 = toInt(document.getElementById('vf10').value);
    const r11 = toInt(document.getElementById('vf11').value);
    const r12 = toInt(document.getElementById('vf12').value);

    // Campo 13: Soma da Receita da Semana (6 a 12)
    const r13 = r6 + r7 + r8 + r9 + r10 + r11 + r12;
    document.getElementById('vf13').value = toReal(r13);
    document.getElementById('field-13').style.display = 'flex';

    //Campo 14: preenchido no inicio no campo extra 37
    //e repassado para o campo 14 na tansição do estagio (initialState) 1 para o 2
    const r14 = toInt(document.getElementById('vf14').value);

    // Campo 15: Balanço (Soma da semana + Saldo anterior)
    const r15 = r13 + r14;
    document.getElementById('vf15').value = toReal(r15);
    document.getElementById('field-15').style.display = 'flex';

    // 3. Coleta de Valores de Despesa
    const d16 = toInt(document.getElementById('vf16').value);
    const d17 = toInt(document.getElementById('vf17').value);
    const d18 = toInt(document.getElementById('vf18').value);
    const d19 = toInt(document.getElementById('vf19').value);
    const d20 = toInt(document.getElementById('vf20').value);
    const d21 = toInt(document.getElementById('vf21').value);
    const d22 = toInt(document.getElementById('vf22').value);
    const d23 = toInt(document.getElementById('vf23').value);
    const d25 = toInt(document.getElementById('vf25').value);

    // Cálculos Automáticos de Repasse
    // Campo 24: Décima (10% do campo 06)
    const d24 = Math.floor(r6 * 0.10); 
    document.getElementById('vf24').value = toReal(d24);
    document.getElementById('field-24').style.display = 'flex';

    //Campo 26 - repasse campo 8
    const d26 = toInt(document.getElementById('vf8').value);
    document.getElementById('vf26').value = toReal(d26);
    document.getElementById('field-26').style.display = 'flex';

    //Campo 27 - repasse referente a linha 12
    const d27 = toInt(document.getElementById('vf12').value);
    document.getElementById('vf27').value = toReal(d27);
    document.getElementById('field-27').style.display = 'flex';

    // Campo 28: Soma das Despesas
    const d28 = d16 + d17 + d18 + d19 + d20 + d21 + d22 + d23 + d24 + d25 + d26 + d27;
    document.getElementById('vf28').value = toReal(d28);
    document.getElementById('field-28').style.display = 'flex';

    // Campo 29: Saldo Final (Balanço - Despesas)
    const r29 = r15 - d28;
    document.getElementById('vf29').value = toReal(r29);
    document.getElementById('field-29').style.display = 'flex';

    //campo 30: Balaço (Soma dos campos 28 e 29)
    const d30 = d28 + r29;
    document.getElementById('vf30').value = toReal(d30);
    document.getElementById('field-30').style.display = 'flex';

    // Campo 34: Décimas Acumuladas (Décima de hoje + o que veio da reunião passada)
    const pastTenth = toInt(document.getElementById('vf38').value);
    const totalTenth = d24 + pastTenth;
    document.getElementById('vf34').value = toReal(totalTenth);
    document.getElementById('resumo-table').style.display = 'block';

    // Campo 35: Outras contribuições a enviar ao C.P (Coleta de Ozanan, Contribuição da Solidariedade)
    const pastContributions = toInt(document.getElementById('vf39').value);
    const totalContributions = pastContributions + d26 + d27;
    document.getElementById('vf35').value = toReal(totalContributions);

    //Campo 36: Total de recursos com a tesouraria
    const totalResources = r29 + totalTenth + pastContributions;
    document.getElementById('vf36').value = toReal(totalResources);

    // Verificar se tem valores nos header da tabela
    const tabelas = ['receita-table', 'despesa-table', 'resumo-table'];
    
    tabelas.forEach(idTable => {
        const tabela = document.getElementById(idTable);
        if (!tabela) return;

        // Verificamos se existe algum input dentro desta tabela com valor > 0
        let temConteudo = false;
        tabela.querySelectorAll('input').forEach(input => {
            if (toInt(input.value) > 0) {
                temConteudo = true;
            }
        });

        // Se a tabela tem algum valor (digitado ou calculado), ela PRECISA aparecer
        tabela.style.display = temConteudo ? 'block' : 'none';
        document.getElementById("btn-whatsapp").style.display = 'block';
    });

    // Verificar se tem valores nas ROWS (Linhas) dentro das tabelas visíveis
    document.querySelectorAll('.table-row').forEach(row => {
        const input = row.querySelector('input');
        if (input) {
            const valorInt = toInt(input.value);

            if (input.disabled) {
                // Campos automáticos (subtotais/décimas): aparecem se tiverem valor
                row.style.display = valorInt > 0 ? 'flex' : 'none';
            } else {
                // Campos de digitação: aparecem apenas se tiverem valor
                row.style.display = valorInt > 0 ? 'flex' : 'none';
            }
        }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function clearAll() {
    if (confirm("Deseja realmente limpar todos os dados?")) {
        window.location.reload();
    }
}

function validatePresentFieldsInForm(){
    const camposNecessarios = [
        'vf1', 'vf2', 'vf3', 'vf4', 'vf5', 'vf6', 'vf7', 'vf8', 'vf9', 'vf10', 
        'vf11', 'vf12', 'vf13', 'vf14', 'vf15', 'vf16', 'vf17', 'vf18', 'vf19', 
        'vf20', 'vf21', 'vf22', 'vf23', 'vf24', 'vf25', 'vf28', 'vf29', 'vf30',
        'vf34', 'vf35', 'vf36', 'vf37', 'vf38', 'vf39'
    ];

    camposNecessarios.forEach(id => {
        if (!document.getElementById(id)) {
            console.error(`ERRO CRÍTICO: O campo ID "${id}" não foi encontrado no HTML.`);
        }
    });
}

function preencherDataAtual() {
    const inputData = document.getElementById('vf41');
    if (inputData) {
        const hoje = new Date();
        const dataFormatada = hoje.toLocaleDateString('pt-BR');
        inputData.value = dataFormatada;
    }
}