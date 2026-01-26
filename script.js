const servicos = document.querySelectorAll('.servico');
let indiceAtual = 0;

function atualizarCarrossel() {
    servicos.forEach((servico, index) => {
        // Removi estilos inline anteriores para limpar o estado
        servico.style.transform = '';
        servico.style.zIndex = '';
        servico.style.opacity = '';
        servico.style.filter = '';

        // Calculando a diferença entre o índice do item e o índice atual (foco)
        // Isso diz quão longe o item está do centro
        let diferenca = index - indiceAtual;

        // Lógica para o carrossel "dar a volta" (loop infinito visual)
        // Se a diferença for muito grande, ajusto para considerar o caminho mais curto
        if (diferenca > servicos.length / 2) {
            diferenca -= servicos.length;
        } else if (diferenca < -servicos.length / 2) {
            diferenca += servicos.length;
        }

        // Configurações visuais baseadas na posição (diferenca)
        if (diferenca === 0) {
            // ITEM CENTRAL (DESTAQUE)
            servico.style.transform = 'translateX(0) scale(1.2)';
            servico.style.zIndex = '10';
            servico.style.opacity = '1';
            servico.style.filter = 'brightness(1.2)'; // Mais brilhante
        } else if (Math.abs(diferenca) === 1) {
            // ITENS VIZINHOS (ESQUERDA E DIREITA IMEDIATOS)
            // Se diferenca for 1 (direita) move 100%, se -1 (esquerda) move -100%
            const direcao = diferenca > 0 ? '65%' : '-65%';
            servico.style.transform = `translateX(${direcao}) scale(0.9)`;
            servico.style.zIndex = '5';
            servico.style.opacity = '0.8';
            servico.style.filter = 'brightness(0.7)'; // Um pouco mais escuro
        } else if (Math.abs(diferenca) === 2) {
            // ITENS MAIS AFASTADOS
            const direcao = diferenca > 0 ? '130%' : '-130%';
            servico.style.transform = `translateX(${direcao}) scale(0.7)`;
            servico.style.zIndex = '2';
            servico.style.opacity = '0.5';
            servico.style.filter = 'brightness(0.5)'; // Bem escuro
        } else {
            // ITENS ESCONDIDOS (ATRÁS DO CENTRO)
            servico.style.transform = 'translateX(0) scale(0.5)';
            servico.style.zIndex = '0';
            servico.style.opacity = '0';
        }
    });
}

function moverCarrossel(direcao) {
    // Atualiza o índice atual somando a direção (-1 ou +1)
    // O operador % (módulo) garante que o índice sempre fique dentro do número de cartas
    indiceAtual = (indiceAtual + direcao + servicos.length) % servicos.length;
    atualizarCarrossel();
}

// Inicializa o carrossel ao carregar a página
atualizarCarrossel();

// Adiciona o evento de clique para rolagem suave nos links do menu
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Evita o comportamento padrão de pular direto

        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            // Calcula a posição do elemento descontando o tamanho do header fixo (aprox 130px)
            const headerOffset = 130; 
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Lógica da Vinheta de Abertura
const introOverlay = document.querySelector('.intro-overlay');
const videoAbertura = document.querySelector('.video-abertura');

if (introOverlay && videoAbertura) {
    // Bloqueia a rolagem do site enquanto a vinheta passa
    document.body.style.overflow = 'hidden';

    // Força o início do vídeo para evitar atrasos
    videoAbertura.play().catch(error => console.log("Autoplay bloqueado ou falhou:", error));

    // Encerra a vinheta após 3 segundos
    setTimeout(() => {
        introOverlay.style.opacity = '0';
        document.body.classList.remove('intro-active'); // Faz o menu aparecer suavemente
        
        setTimeout(() => {
            introOverlay.style.display = 'none';
            document.body.style.overflow = ''; // Libera a rolagem
            videoAbertura.pause(); // Pausa o vídeo
        }, 1000); // Tempo igual ao da transição no CSS
    }, 3000);
} else {
    // Caso a vinheta não exista ou falhe, garante que o menu apareça
    document.body.classList.remove('intro-active');
}