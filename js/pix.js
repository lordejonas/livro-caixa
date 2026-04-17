//let qrCodeInstancia = null;

/*
document.addEventListener('DOMContentLoaded', () => {
    const chaveSalva = localStorage.getItem('chavePix');
    if (chaveSalva) {
        exibirQRCode(chaveSalva);
    }
});


function salvarChave() {
    const chave = document.getElementById('input-chave').value;
    if (chave) {
        localStorage.setItem('chavePix', chave);
        exibirQRCode(chave);
    }
}


function exibirQRCode(chave) {
    document.getElementById('config-secao').style.display = 'none';
    document.getElementById('display-secao').style.display = 'block';
    document.getElementById('texto-chave').innerText = chave;

    const container = document.getElementById('qrcode');
    container.innerHTML = ''; // Limpa o QR Code anterior

    // Criamos a instância. 
    // Se QRCode.CorrectLevel não funcionar, usamos o padrão automático da biblioteca
    qrCodeInstancia = new QRCode(container, {
        text: chave,
        width: 250,
        height: 250,
        colorDark : "#000000",
        colorLight : "#ffffff",
        // Ajuste aqui: acessando o nível de correção de forma mais segura
        correctLevel : QRCode.CorrectLevel ? QRCode.CorrectLevel.H : 2 
    });

    container.onclick = function() {
        this.classList.toggle('fullscreen');
        
        // Dica visual: esconde o restante da página para focar no QR
        if (this.classList.contains('fullscreen')) {
            document.body.style.overflow = 'hidden'; // Trava o scroll
        } else {
            document.body.style.overflow = 'auto';   // Libera o scroll
        }
    };
}

function editarChave() {
    document.getElementById('config-secao').style.display = 'block';
    document.getElementById('display-secao').style.display = 'none';
}
*/
/*
function enviarPix(tipo) {
    const chave = localStorage.getItem('chavePix');
    if (!chave) return;

    // 1. Limpa espaços em branco que podem ter vindo do input
    const chaveLimpa = chave.trim();
    // 2. Codifica a chave para formato de URL (essencial para @, + e .)
    const chaveCodificada = encodeURIComponent(chaveLimpa);
    
    // 3. Monta a mensagem para o WhatsApp
    let mensagem = `*Chave PIX - SSVP*%0A`;
    mensagem += `Chave: *${chaveLimpa}*%0A%0A`;
    
    if (tipo === 2) {
        // Coloca o link por último para facilitar a leitura do WhatsApp
        const linkQR = `https://api.qrserver.com/v1/create-qr-code/?data=${chaveCodificada}&size=400x400`;
        mensagem += `Clique no link para abrir o QR Code e fazer sua doação:%0A${linkQR}`;
    }

    // 4. Dispara para o WhatsApp
    // Usamos o link de API do WhatsApp que funciona melhor para disparar prévias
    const urlFinal = `https://api.whatsapp.com/send?text=${mensagem}`;
    window.open(urlFinal, '_blank');
}
*/

function baixarQRCode() {
    // Procura a imagem ou canvas dentro da div do qrcode
    const qrContainer = document.getElementById('qrcode');
    const img = qrContainer.querySelector('img');
    const canvas = qrContainer.querySelector('canvas');
    const chave = localStorage.getItem('chavePix') || 'pix';

    let imagemURL = '';

    if (img && img.src) {
        imagemURL = img.src;
    } else if (canvas) {
        imagemURL = canvas.toDataURL("image/png");
    }

    if (imagemURL) {
        // Cria um link invisível para forçar o download
        const link = document.createElement('a');
        link.href = imagemURL;
        link.download = `QR_Code_PIX_${chave.replace(/[^a-z0-9]/gi, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Feedback para o utilizador
        alert("Imagem guardada! Agora pode anexá-la no WhatsApp.");
    } else {
        alert("Erro ao gerar imagem para download.");
    }
}

// Função para calcular o CRC16 (Obrigatório para o PIX funcionar)
function calcularCRC16(payload) {
    let res = 0xFFFF;
    for (let b = 0; b < payload.length; b++) {
        for (let i = 0; i < 8; i++) {
            let bit = ((payload.charCodeAt(b) >> (7 - i)) & 1) === 1;
            let c15 = ((res >> 15) & 1) === 1;
            res <<= 1;
            if (c15 ^ bit) res ^= 0x1021;
        }
    }
    return (res & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

// Monta o "PIX Copia e Cola" dinamicamente
function gerarPayloadPix(chave, nome) {
    // O PIX exige nomes sem acentos e em maiúsculas para maior compatibilidade
    const nomeLimpo = nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().substring(0, 25);
    const cidade = "BRASIL"; 
    
    let payload = "000201";
    payload += "26" + (22 + chave.length).toString().padStart(2, '0'); 
    payload += "0014br.gov.bcb.pix";
    payload += "01" + chave.length.toString().padStart(2, '0') + chave;
    
    payload += "52040000";
    payload += "5303986";
    payload += "5802BR";
    payload += "59" + nomeLimpo.length.toString().padStart(2, '0') + nomeLimpo;
    payload += "60" + cidade.length.toString().padStart(2, '0') + cidade;
    payload += "62070503***";
    payload += "6304";
    
    payload += calcularCRC16(payload);
    return payload;
}

function exibirQRCode(chave, nome) {
    const elementoTexto = document.getElementById('texto-chave');
    const configSecao = document.getElementById('config-secao');
    const displaySecao = document.getElementById('display-secao');

    // Verifica se os elementos existem antes de tentar usá-los
    if (configSecao) configSecao.style.display = 'none';
    if (displaySecao) displaySecao.style.display = 'block';
    
    if (elementoTexto) {
        elementoTexto.innerHTML = `
            <small style="color: #666; display: block; margin-bottom: 5px;">Conferência ${nome}</small>
            <strong style="color: #0064b6; font-size: 1.4rem;">${chave}</strong>
        `;
    }

    const payloadPix = gerarPayloadPix(chave, nome);
    const container = document.getElementById('qrcode');
    container.innerHTML = '';

    new QRCode(container, {
        text: payloadPix, // Aqui vai o código que o banco entende
        width: 250,
        height: 250,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    // Ajuste para o clique/zoom que fizemos antes
    container.onclick = function() {
        //console.log("TESTE");
        document.body.style.overflow = 'hidden';
        window.scrollTo(0, 0);
        const beneficiario = localStorage.getItem('beneficiarioPix') || "";
        const banco = localStorage.getItem('bancoPix') || "";
        this.classList.toggle('fullscreen');
        if (this.classList.contains('fullscreen')) {
            // Inserir info no topo do QR Code ampliado
            let infoTopo = document.getElementById('info-topo-pix');
            if (!infoTopo) {
                infoTopo = document.createElement('div');
                infoTopo.id = 'info-topo-pix';
                this.prepend(infoTopo);
            }
            infoTopo.innerHTML = `
                <p style="margin:0; font-weight:bold; color:#0064b6;">Beneficiário: ${beneficiario}</p>
                <p style="margin-bottom: 1em; font-size: 0.9rem; color:#666;">Instituição: ${banco}</p>
            `;
        }else{
            document.body.style.overflow = 'auto';
            // Remove a info ao fechar para não poluir a tela normal
            const infoTopo = document.getElementById('info-topo-pix');
            if (infoTopo) infoTopo.remove();
        }
        
        //document.body.style.overflow = this.classList.contains('fullscreen') ? 'hidden' : 'auto';
    };
}
/*
function salvarChave() {
    const input = document.getElementById('input-chave');
    const chave = input.value.trim();
    if (chave) {
        localStorage.setItem('chavePix', chave);
        exibirQRCode(chave);
    }
}*/

function salvarConfiguracao() {
    const nomeInput = document.getElementById('input-nome-conf').value.trim();
    const beneficiarioInput = document.getElementById('input-beneficiario').value.trim();
    const bancoInput = document.getElementById('input-banco').value.trim();
    const chaveInput = document.getElementById('input-chave').value.trim();

    if (nomeInput && chaveInput && beneficiarioInput && bancoInput) {
        localStorage.setItem('nomeConferencia', nomeInput);
        localStorage.setItem('beneficiarioPix', beneficiarioInput);
        localStorage.setItem('bancoPix', bancoInput);
        localStorage.setItem('chavePix', chaveInput);
        
        exibirQRCode(chaveInput, nomeInput);
    } else {
        alert("Por favor, preencha todos os campos para garantir a clareza do doador.");
    }
}

function editarChave() {
    document.getElementById('config-secao').style.display = 'block';
    document.getElementById('display-secao').style.display = 'none';
    
    // Preenche os campos com o que já está salvo para facilitar a edição
    document.getElementById('input-nome-conf').value = localStorage.getItem('nomeConferencia') || "";
    document.getElementById('input-chave').value = localStorage.getItem('chavePix') || "";
}


function enviarPix() {
    const chave = localStorage.getItem('chavePix');
    const nome = localStorage.getItem('nomeConferencia') || "SSVP";
    const beneficiario = localStorage.getItem('beneficiarioPix') || "";
    const instituicao = localStorage.getItem('bancoPix') || "";
    
    if (!chave) return;

    // Mensagem 1: O cabeçalho informativo
    const titulo = `Chave PIX - Unidade *VICENTINA*`;
    const lnUnidade = `Conferência: ${nome}`;//Fururamente pode trocar o nome Conferencia pela unidade
    const lnBeneficiario =  `Beneficiario: ${beneficiario}`;
    const lnInstituicao =   `Instituição: ${instituicao}`;

    // Mensagem 2: A chave isolada (usamos o sinal de código ` ` para destacar)
    // No WhatsApp, isso cria um bloco cinza que facilita a visualização
    const chaveFormatada = `\`\`\`${chave}\`\`\``;

    const mensagem = `${titulo}%0A${lnUnidade}%0A${lnBeneficiario}%0A${lnInstituicao}%0A%0A${chaveFormatada}`;
    //console.log(mensagem);
    window.open(`https://api.whatsapp.com/send?text=${mensagem}`, '_blank');
}

/*
function enviarPix() {
    const chave = localStorage.getItem('chavePix');
    const nome = localStorage.getItem('nomeConferencia') || " da SSVP";
    
    if (!chave) return;

    const mensagem = `Chave PIX - Conferência *vicentina* ${nome} 👇%0A${chave}`;
    //console.log(mensagem);
    window.open(`https://api.whatsapp.com/send?text=${mensagem}`, '_blank');
}*/


function copiarChave() {
    const chave = localStorage.getItem('chavePix');
    
    if (!chave) {
        alert("Nenhuma chave encontrada para copiar.");
        return;
    }

    // Tenta usar a API moderna de área de transferência
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(chave).then(() => {
            mostrarAvisoCopiado();
        }).catch(err => {
            console.error("Erro ao copiar: ", err);
            copiarFallback(chave); // Tenta método antigo se o moderno falhar
        });
    } else {
        copiarFallback(chave);
    }
}

// Função para dar um feedback visual mais elegante que um alert
function mostrarAvisoCopiado() {
    const btn = document.querySelector('button[onclick="copiarChave()"]');
    const textoOriginal = btn.innerHTML;
    
    btn.innerHTML = "✅ Copiado!";
    btn.style.backgroundColor = "#27ae60"; // Muda para verde temporariamente
    
    setTimeout(() => {
        btn.innerHTML = textoOriginal;
        btn.style.backgroundColor = "#0064b6";
    }, 2000);
}

// Método de reserva para navegadores mais antigos
function copiarFallback(texto) {
    const textArea = document.createElement("textarea");
    textArea.value = texto;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        mostrarAvisoCopiado();
    } catch (err) {
        alert("Não foi possível copiar automaticamente. Por favor, selecione e copie o texto manualmente.");
    }
    document.body.removeChild(textArea);
}

// Carregar ao iniciar
document.addEventListener('DOMContentLoaded', () => {
    const salvaChave = localStorage.getItem('chavePix');
    const salvaNome = localStorage.getItem('nomeConferencia');
    if (salvaChave && salvaNome) {
        exibirQRCode(salvaChave, salvaNome);
    }
});