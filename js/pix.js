let qrCodeInstancia = null;

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
function gerarPayloadPix(chave) {
    const nome = "CONFERENCIA SSVP"; // Nome padrão
    const cidade = "BRASIL"; 
    
    let payload = "000201"; // Versão do payload
    payload += "26" + (22 + chave.length).toString().padStart(2, '0'); 
    payload += "0014br.gov.bcb.pix";
    payload += "01" + chave.length.toString().padStart(2, '0') + chave;
    
    payload += "52040000"; // Categoria
    payload += "5303986";  // Moeda (BRL)
    payload += "5802BR";   // País
    payload += "59" + nome.length.toString().padStart(2, '0') + nome;
    payload += "60" + cidade.length.toString().padStart(2, '0') + cidade;
    payload += "62070503***"; // Campo livre
    payload += "6304"; // Início do CRC16
    
    payload += calcularCRC16(payload);
    return payload;
}

function exibirQRCode(chave) {
    document.getElementById('config-secao').style.display = 'none';
    document.getElementById('display-secao').style.display = 'block';
    
    // EXTREMAMENTE IMPORTANTE: 
    // O texto visual mostra a chave (e-mail), 
    // mas o QR Code recebe o Payload do PIX!
    document.getElementById('texto-chave').innerText = chave;

    const payloadPix = gerarPayloadPix(chave);
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
        this.classList.toggle('fullscreen');
        document.body.style.overflow = this.classList.contains('fullscreen') ? 'hidden' : 'auto';
    };
}

function salvarChave() {
    const input = document.getElementById('input-chave');
    const chave = input.value.trim();
    if (chave) {
        localStorage.setItem('chavePix', chave);
        exibirQRCode(chave);
    }
}

function editarChave() {
    document.getElementById('config-secao').style.display = 'block';
    document.getElementById('display-secao').style.display = 'none';
}
/*
function enviarPix(tipo) {
    const chave = localStorage.getItem('chavePix');
    const payload = gerarPayloadPix(chave);
    
    let mensagem = `*Chave PIX - SSVP*%0AChave: *${chave}*`;
    
    if (tipo === 2) {
        const linkQR = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(payload)}&size=400x400`;
        mensagem += `%0A%0ACopie e cole o código ou abra o QR Code:%0A${payload}%0A%0A${linkQR}`;
    }
    window.open(`https://api.whatsapp.com/send?text=${mensagem}`, '_blank');
}
*/

function enviarPix(tipo) {
    const chave = localStorage.getItem('chavePix');
    if (!chave) return;

    // Mensagem 1: O cabeçalho informativo
    const titulo = `*Chave PIX da Conferência SSVP* 👇`;
    
    // Mensagem 2: A chave isolada (usamos o sinal de código ` ` para destacar)
    // No WhatsApp, isso cria um bloco cinza que facilita a visualização
    const chaveIsolada = `\`${chave}\``;

    let mensagemFinal = `${titulo}%0A%0A${chaveIsolada}`;

    if (tipo === 2) {
        const payload = gerarPayloadPix(chave);
        const linkQR = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(payload)}&size=400x400`;
        mensagemFinal += `%0A%0A*Link do QR Code:*%0A${linkQR}`;
    }

    window.open(`https://api.whatsapp.com/send?text=${mensagemFinal}`, '_blank');
}

// Carregar ao iniciar
document.addEventListener('DOMContentLoaded', () => {
    const salva = localStorage.getItem('chavePix');
    if (salva) exibirQRCode(salva);
});