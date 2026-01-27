const servicos = document.querySelectorAll('.servico');
let indiceAtual = 0;

function atualizarCarrossel() {
    servicos.forEach((servico, index) => {
        // Removi estilos inline anteriores para limpar o estado
        servico.style.transform = '';
        servico.style.zIndex = '';
        servico.style.opacity = '';
        servico.style.filter = '';
        servico.style.cursor = 'default'; // Reseta o cursor para o padrão nas cartas laterais

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
            servico.style.cursor = 'pointer'; // Apenas a carta central ganha o cursor de clique
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

            // Garante que o vídeo do header continue reproduzindo (caso o pause acima afete ele)
            const videoHeader = document.querySelector('.fundo-header');
            if (videoHeader) videoHeader.play().catch(e => console.log("Erro play header:", e));
        }, 1000); // Tempo igual ao da transição no CSS
    }, 3000);
} else {
    // Caso a vinheta não exista ou falhe, garante que o menu apareça
    document.body.classList.remove('intro-active');
}

// --- Lógica do Modal de Serviços ---

// Dados dos serviços (Texto que aparecerá na carta)
const dadosServicos = [
    {
        titulo: "Pergunta Individual",
        texto: `<p>Consiste em perguntas objetivas para quem já tem dimensão do direcionamento necessário.</p>
                <p>O valor é por pergunta, ou seja, não é permitido fazer mais de um questionamento em uma única pergunta. Exemplo: "Vou conseguir viajar para Alemanha? Ou para Itália? É avião ou Navio?" Nesse caso foram três perguntas.</p>
                <p>Contextos não são obrigatórios, no entanto, quanto mais detalhes verídicos é crucial para uma resposta mais assertiva.</p>
                <p>A partir do momento que o Pix for realizado a devolução só é feita por meio de Desistência da tiragem por parte do consulente ou indisponibilidade da Oraculista. Dessa forma, antes de realizar o pagamento tenha certeza que deseja realizar a tiragem!</p>`
    },
    {
        titulo: "Chá e Magia",
        texto: `<p>Consiste em um método dividido em três partes, 15 minutos de mesa aberta, 35 minutos de mesa aberta e 1 hora de mesa aberta.</p>
                <p>Durante a mesa aberta é possível fazer quantas perguntas couberem no tempo escolhido, lembrando que também inclui o tempo de resposta. É possível também puxar conselhos para situações e observar de maneira geral ou profunda questões detalhistas.</p>
                <p>Contextos não são obrigatórios, no entanto, quanto mais detalhes verídicos é crucial para uma resposta mais assertiva.</p>
                <P>A partir do momento que o Pix for realizado a devolução só é feita por meio de Desistência da tiragem por parte do consulente ou indisponibilidade da Oraculista. Dessa forma, antes de realizar o pagamento tenha certeza que deseja realizar a tiragem!</P>`
    },
    
    {
        titulo: "Caminho Traçado",
        texto: `<P>Consiste em uma tiragem focada em UMA área específica da vida e dentro dessa área é possível fazer três perguntas relacionadas. Exemplo: "Vou conseguir uma promoção? O que meu namorado sente por mim?" Nesse caso, são perguntas de áreas diferentes, escolhido sobre carreira, as perguntas devem ser sobre isso, escolhido sobre relacionamento ou amor as perguntas devem ser sobre isso e assim sucessivamente.</P>
                <P>Contextos não são obrigatórios, no entanto, quanto mais detalhes verídicos é crucial para uma resposta mais assertiva. </P>
                <P>A partir do momento que o Pix for realizado a devolução só é feita por meio de Desistência da tiragem por parte do consulente ou indisponibilidade da Oraculista. Dessa forma, antes de realizar o pagamento tenha certeza que deseja realizar a tiragem!</P>`
    },
    {
        titulo: "Auto Conhecimento",
        texto: `<P>Uma tiragem com o mínimo de 10 cartas, feito o direcionamento para o auto conhecimento e esclarecimento. Com bônus e utilizando 3 oráculos.</P>
                <p>Contextos não são obrigatórios, no entanto, quanto mais detalhes verídicos é crucial para uma resposta mais assertiva. </p>
                <p>A partir do momento que o Pix for realizado a devolução só é feita por meio de Desistência da tiragem por parte do consulente ou indisponibilidade da Oraculista. Dessa forma, antes de realizar o pagamento tenha certeza que deseja realizar a tiragem!</p>`
    },
    {
        titulo: "Mesa Real",
        texto: `<P>Uma tiragem que analisa 3 áreas diferentes da sua vida e ao final ainda tiramos um conselho do oráculo. Com bônus e mais.</P>
                <p>Contextos não são obrigatórios, no entanto, quanto mais detalhes verídicos é crucial para uma resposta mais assertiva. </p>
                <p>A partir do momento que o Pix for realizado a devolução só é feita por meio de Desistência da tiragem por parte do consulente ou indisponibilidade da Oraculista. Dessa forma, antes de realizar o pagamento tenha certeza que deseja realizar a tiragem!</p>`
    }
];

const modalOverlay = document.getElementById('modal-servico');
const modalTitulo = document.getElementById('modal-titulo');
const modalTexto = document.getElementById('modal-texto');
const modalBotao = document.getElementById('modal-botao-agendar');

// Adiciona o evento de clique em cada carta do carrossel
servicos.forEach((servico, index) => {
    servico.addEventListener('click', () => {
        // Só abre o modal se a carta clicada for a que está em destaque (índice atual)
        if (index === indiceAtual) {
            abrirModal(index);
        }
    });
});

function abrirModal(index) {
    // Preenche o modal com os dados do serviço clicado
    if (dadosServicos[index]) {
        modalTitulo.innerText = dadosServicos[index].titulo;
        modalTexto.innerHTML = dadosServicos[index].texto; // Alterado para innerHTML para aceitar tags <p>

        // Atualiza o link do WhatsApp com mensagem personalizada
        const mensagem = `Olá! Gostaria de agendar o serviço: ${dadosServicos[index].titulo}`;
        modalBotao.href = `https://wa.me/5511966453789?text=${encodeURIComponent(mensagem)}`;
        
        modalOverlay.classList.add('ativo');
        document.body.style.overflow = 'hidden'; // Bloqueia rolagem da página
    }
}

function fecharModal() {
    modalOverlay.classList.remove('ativo');
    document.body.style.overflow = ''; // Libera rolagem da página
}

// Fecha o modal se clicar fora da carta (no fundo escuro)
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        fecharModal();
    }
});

// --- Menu Hambúrguer Mobile ---
const btnHamburguer = document.querySelector('.menu-hamburguer');
const navMenu = document.querySelector('nav');

if (btnHamburguer && navMenu) {
    btnHamburguer.addEventListener('click', () => {
        navMenu.classList.toggle('ativo');
    });

    // Fecha o menu ao clicar em um link
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => navMenu.classList.remove('ativo'));
    });
}