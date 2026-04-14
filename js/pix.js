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
}

function editarChave() {
    document.getElementById('config-secao').style.display = 'block';
    document.getElementById('display-secao').style.display = 'none';
}

function enviarPix(tipo) {
    const chave = localStorage.getItem('chavePix');
    let mensagem = `*Chave PIX - SSVP*%0A%0AChave: *${chave}*`;
    
    if (tipo === 2) {
        // Gera um link de visualização rápida do QR Code via API externa
        const linkQR = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${chave}`;
        mensagem += `%0A%0AVisualizar QR Code: ${linkQR}`;
    }

    window.open(`https://wa.me/?text=${mensagem}`, '_blank');
}