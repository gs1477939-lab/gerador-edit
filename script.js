// --- 1. Selecionando os Elementos ---
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d'); // O "pincel" para desenhar no canvas

const imageLoader = document.getElementById('imageLoader');
const downloadBtn = document.getElementById('downloadBtn');

// Sliders de Filtro
const brightnessSlider = document.getElementById('brightness');
const contrastSlider = document.getElementById('contrast');
const saturateSlider = document.getElementById('saturate');
const blurSlider = document.getElementById('blur');

// Inputs de Texto
const textOverlayInput = document.getElementById('textOverlay');
const fontSizeInput = document.getElementById('fontSize');

// Variável para guardar a imagem original
const img = new Image();
img.crossOrigin = "anonymous"; // Permite carregar imagens de outras fontes (se o servidor permitir)

// --- 2. Carregando a Imagem ---
imageLoader.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    
    // Quando o arquivo for lido
    reader.onload = (event) => {
        // Coloca o resultado no nosso objeto 'img'
        img.src = event.target.result;
    };
    
    // Pede para o leitor ler o arquivo como uma URL
    reader.readAsDataURL(file);
});

// --- 3. Desenhando a Imagem (A Mágica) ---
// Isso acontece quando o 'img.src' é definido (ali em cima)
img.onload = () => {
    // Ajusta o tamanho do canvas para o tamanho da imagem
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Desenha a imagem pela primeira vez
    applyFiltersAndText();
};

// --- 4. A Função Principal: Aplicar Filtros e Texto ---
function applyFiltersAndText() {
    if (!img.src) return; // Não faz nada se não tiver imagem

    // Pega os valores atuais dos sliders
    const brightness = brightnessSlider.value;
    const contrast = contrastSlider.value;
    const saturate = saturateSlider.value;
    const blur = blurSlider.value;
    
    // Pega os valores do texto
    const text = textOverlayInput.value;
    const fontSize = fontSizeInput.value;

    // --- Aplicando Filtros ---
    // Limpa o canvas antes de desenhar de novo
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Monta a string de filtros do CSS
    // Isso é o que "deixa a edit boa"
    ctx.filter = `
        brightness(${brightness}%)
        contrast(${contrast}%)
        saturate(${saturate}%)
        blur(${blur}px)
    `;
    
    // Desenha a imagem NO canvas com os filtros aplicados
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // --- Aplicando Texto ---
    // Reseta os filtros para o texto não ficar borrado ou estourado
    ctx.filter = 'none'; 
    
    if (text) {
        // Estilo do texto (branco com contorno preto = clássico de edit)
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = '#FFFFFF'; // Cor do texto: Branca
        ctx.strokeStyle = '#000000'; // Cor do contorno: Preta
        ctx.lineWidth = fontSize / 10; // Contorno proporcional
        ctx.textAlign = 'center'; // Alinha no centro
        ctx.textBaseline = 'middle'; // Alinha no meio

        // Posição do texto (bem no meio do canvas)
        const x = canvas.width / 2;
        const y = canvas.height / 2;

        // Desenha o contorno primeiro
        ctx.strokeText(text, x, y);
        // Desenha o texto por cima
        ctx.fillText(text, x, y);
    }
}

// --- 5. Ouvindo Mudanças nos Controles ---
// Qualquer vez que o usuário mexer num slider ou digitar,
// a função 'applyFiltersAndText' é chamada de novo.
brightnessSlider.addEventListener('input', applyFiltersAndText);
contrastSlider.addEventListener('input', applyFiltersAndText);
saturateSlider.addEventListener('input', applyFiltersAndText);
blurSlider.addEventListener('input', applyFiltersAndText);
textOverlayInput.addEventListener('input', applyFiltersAndText);
fontSizeInput.addEventListener('input', applyFiltersAndText);

// --- 6. Fazendo o Download ---
downloadBtn.addEventListener('click', () => {
    // Pega o conteúdo do canvas como uma imagem PNG
    const dataURL = canvas.toDataURL('image/png');
    
    // Cria um link "fantasma" para fazer o download
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'minha-edit-pronta.png'; // Nome do arquivo
    
    // Clica no link
    link.click();
});
  
