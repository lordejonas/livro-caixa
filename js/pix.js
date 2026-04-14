let qrCodeInstancia = null;

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
/*
function enviarPix(tipo) {
    const chave = localStorage.getItem('chavePix');
    if (!chave) {
        alert("Por favor, configure uma chave primeiro.");
        return;
    }

    // 1. Limpa espaços em branco que podem ter vindo do input
    const chaveLimpa = chave.trim();
    
    // 2. Codifica a chave para formato de URL (essencial para @, + e .)
    const chaveCodificada = encodeURIComponent(chaveLimpa);
    
    // 3. Monta a mensagem para o WhatsApp
    let mensagem = `*Chave PIX - SSVP*%0A%0AChave: *${chaveLimpa}*`;
    
    if (tipo === 2) {
        // Usamos o parâmetro completo conforme a documentação oficial
        const linkQR = `https://api.qrserver.com/v1/create-qr-code/?data=${chaveCodificada}&size=300x300&ecc=H`;
        mensagem += `%0A%0A*Link para o QR Code:*%0A${linkQR}`;
    }

    // 4. Dispara para o WhatsApp
    window.open(`https://wa.me/?text=${mensagem}`, '_blank');
}
*/

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