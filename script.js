class JogoMemoria {
    constructor() {
        this.cartas = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
        this.tabuleiro = document.getElementById('tabuleiro');
        this.movimentosElement = document.getElementById('movimentos');
        this.tempoElement = document.getElementById('tempo');
        this.vitoriaElement = document.getElementById('vitoria');
        this.movimentosFinaisElement = document.getElementById('movimentos-finais');
        this.tempoFinalElement = document.getElementById('tempo-final');
        
        this.movimentos = 0;
        this.tempo = 0;
        this.tempoInterval = null;
        this.cartaVirada = null;
        this.paresEncontrados = 0;
        this.bloquearTabuleiro = false;
        
        this.inicializar();
    }

    inicializar() {
        this.criarTabuleiro();
        this.iniciarCronometro();
        document.getElementById('reiniciar').addEventListener('click', () => this.reiniciarJogo());
    }

    criarTabuleiro() {
        this.tabuleiro.innerHTML = '';
        const cartasEmbaralhadas = [...this.cartas, ...this.cartas]
            .sort(() => Math.random() - 0.5);

        cartasEmbaralhadas.forEach((emoji, index) => {
            const carta = document.createElement('div');
            carta.className = 'carta';
            carta.dataset.emoji = emoji;
            carta.dataset.index = index;
            carta.innerHTML = '?';
            
            carta.addEventListener('click', () => this.virarCarta(carta));
            this.tabuleiro.appendChild(carta);
        });
    }

    virarCarta(carta) {
        if (this.bloquearTabuleiro || carta.classList.contains('virada') || carta.classList.contains('correspondente')) {
            return;
        }

        carta.classList.add('virada');
        carta.innerHTML = carta.dataset.emoji;

        if (!this.cartaVirada) {
            this.cartaVirada = carta;
            return;
        }

        this.movimentos++;
        this.movimentosElement.textContent = this.movimentos;

        this.verificarPar(carta);
    }

    verificarPar(segundaCarta) {
        this.bloquearTabuleiro = true;

        if (this.cartaVirada.dataset.emoji === segundaCarta.dataset.emoji) {
            this.cartaVirada.classList.add('correspondente');
            segundaCarta.classList.add('correspondente');
            this.paresEncontrados++;
            this.bloquearTabuleiro = false;
            
            if (this.paresEncontrados === this.cartas.length) {
                this.finalizarJogo();
            }
        } else {
            setTimeout(() => {
                this.cartaVirada.classList.remove('virada');
                segundaCarta.classList.remove('virada');
                this.cartaVirada.innerHTML = '?';
                segundaCarta.innerHTML = '?';
                this.bloquearTabuleiro = false;
            }, 1000);
        }

        this.cartaVirada = null;
    }

    iniciarCronometro() {
        this.tempoInterval = setInterval(() => {
            this.tempo++;
            this.tempoElement.textContent = this.tempo;
        }, 1000);
    }

    finalizarJogo() {
        clearInterval(this.tempoInterval);
        this.movimentosFinaisElement.textContent = this.movimentos;
        this.tempoFinalElement.textContent = this.tempo;
        this.vitoriaElement.style.display = 'block';
    }

    reiniciarJogo() {
        clearInterval(this.tempoInterval);
        this.movimentos = 0;
        this.tempo = 0;
        this.paresEncontrados = 0;
        this.cartaVirada = null;
        this.bloquearTabuleiro = false;
        
        this.movimentosElement.textContent = '0';
        this.tempoElement.textContent = '0';
        this.vitoriaElement.style.display = 'none';
        
        this.criarTabuleiro();
        this.iniciarCronometro();
    }
}

// Inicializar o jogo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new JogoMemoria();
});

// Função global para reiniciar (usada no HTML)
function reiniciarJogo() {
    new JogoMemoria();
}