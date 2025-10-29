class PokemonView {
    // Define a classe da View, responsável por tudo o que é visual e pela captura de eventos
    constructor() {
        // Método construtor, onde se obtêm as referências aos elementos do DOM
        this.pokemonListEl = document.getElementById('pokemonList');
        // Referência ao container onde a lista de Pokémons será renderizada
        this.pokemonDetailEl = document.getElementById('pokemonDetail');
        // Referência ao container onde os detalhes do Pokémon serão mostrados (modal)
        this.loadingEl = document.getElementById('loading');
        // Referência ao elemento de carregamento (spinner)
        this.errorEl = document.getElementById('error');
        // Referência ao elemento de mensagem de erro
        this.searchInput = document.getElementById('searchInput');
        // Referência ao campo de input da pesquisa
        this.searchBtn = document.getElementById('searchBtn');
        // Referência ao botão de pesquisa

        this.modalOverlayEl = this._createModalOverlay();
        // Chama um método privado para criar e anexar o overlay do modal ao corpo do documento
    }

    _createModalOverlay() {
        // Método privado para criar o elemento de sobreposição (overlay) do modal
        const overlay = document.createElement('div');
        // Cria um novo elemento <div>
        overlay.className = 'modal-overlay hidden';
        // Define as classes, escondendo-o inicialmente
        document.body.appendChild(overlay);
        // Anexa o overlay ao corpo do HTML
        return overlay;
        // Retorna a referência ao novo elemento
    }

    showLoading() { if (this.loadingEl) this.loadingEl.classList.remove('hidden'); }
    // Mostra o elemento de carregamento, removendo a classe 'hidden' se o elemento existir
    hideLoading() { if (this.loadingEl) this.loadingEl.classList.add('hidden'); }
    // Oculta o elemento de carregamento, adicionando a classe 'hidden' se o elemento existir
    showError(message) {
        // Mostra uma mensagem de erro temporária
        if (this.errorEl) {
            // Verifica se o elemento de erro existe
            this.errorEl.textContent = message;
            // Define o texto da mensagem de erro
            this.errorEl.classList.remove('hidden');
            // Torna o elemento de erro visível
            setTimeout(() => this.hideError(), 4000);
            // Define um temporizador para ocultar o erro automaticamente após 4 segundos
        }
    }
    hideError() {
        // Oculta o elemento de erro
        if (this.errorEl) {
            // Verifica se o elemento de erro existe
            this.errorEl.classList.add('hidden');
            // Torna o elemento invisível
            this.errorEl.textContent = '';
            // Limpa o texto da mensagem
        }
    }

    renderList(pokemons) {
        // Renderiza a lista de Pokémons na interface
        this.hideDetail();
        // Garante que o detalhe (modal) esteja fechado
        this.pokemonListEl.classList.remove('hidden');
        // Garante que o container da lista esteja visível
        this.pokemonListEl.innerHTML = '';
        // Limpa o conteúdo anterior do container da lista

        pokemons.forEach(p => {
            // Itera sobre a lista de Pokémons
            const card = this._createPokemonCard(p);
            // Cria um cartão (card) HTML para cada Pokémon
            this.pokemonListEl.appendChild(card);
            // Adiciona o cartão à lista
        });
    }

    _createPokemonCard(pokemonData) {
        // Método privado para gerar o HTML de um cartão de Pokémon
        const card = document.createElement('div');
        // Cria o elemento principal do cartão

        let id = pokemonData.id || this._extractIdFromUrl(pokemonData.url);
        // Tenta obter o ID do objeto (detalhes completos) ou extrai da URL (lista sumária)
        id = id.toString().replace(/[^0-9]/g, '');
        // Garante que o ID seja uma string limpa de números

        const primaryType = pokemonData.types ? pokemonData.types[0].type.name : 'normal';
        // Obtém o tipo principal para usar como classe de cor, ou 'normal' como padrão

        card.className = `pokemon-card card-atom item-lista-molecula ${primaryType}`;
        // Define as classes CSS, incluindo a classe de cor baseada no tipo
        card.dataset.name = pokemonData.name;
        // Armazena o nome do Pokémon no atributo data-name (útil para o clique do Controller)

        card.innerHTML = `
            
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png"
                alt="${pokemonData.name}" class="imagem-atom">
            <span class="nome-pokemon">${this._capitalize(pokemonData.name)}</span>
            <span class="texto-atom">#${id}</span>
          
        `;
        return card;
        // Retorna o elemento HTML do cartão
    }

    /**
     * @description Renderiza os detalhes de um Pokémon num modal.
     * **MODIFICADO:** Adiciona a classe de cor do tipo ao container principal do modal.
     * @param {Object} pokemon - Objeto de detalhes COMPLETO do Pokémon.
     */
    renderDetail(pokemon) {
        // Renderiza a vista de detalhes
        this.pokemonListEl.classList.add('hidden');
        // Oculta a lista principal
        this.pokemonDetailEl.classList.remove('hidden');
        // Mostra o container de detalhes
        this.pokemonDetailEl.innerHTML = '';
        // Limpa o conteúdo anterior

        const typesHtml = pokemon.types.map(t =>
            // Mapeia os tipos do Pokémon para criar badges HTML
            `<span class="botao-atom tipo-${t.type.name}-atom type-badge">${this._capitalize(t.type.name)}</span>`
        ).join('');
        // Une os spans dos tipos numa única string

        const statsHtml = pokemon.stats.map(s =>
            // Mapeia as estatísticas base do Pokémon
            `<p class="texto-atom stat-item"><strong>${this._capitalize(s.stat.name)}:</strong> ${s.base_stat}</p>`
        ).join('');
        // Une os parágrafos das estatísticas

        const primaryTypeClassText = pokemon.types ? `tipo-${pokemon.types[0].type.name}-text` : 'tipo-normal-text';
        // Obtém a classe de cor do tipo para o texto do título
        // NOVIDADE: Pega o tipo principal para aplicar no fundo do card de detalhe.
        const primaryTypeClassBackground = pokemon.types ? `${pokemon.types[0].type.name}-detail-bg` : 'normal-detail-bg';
        // Obtém a classe de fundo baseada no tipo principal


        this.pokemonDetailEl.innerHTML = `
      
            <div class="card-detalhe-organism ${primaryTypeClassBackground}">
                
                <h2 class="titulo-atom detail-name ${primaryTypeClassText}">${this._capitalize(pokemon.name)} (#${pokemon.id})</h2>
                
                <img src="${pokemon.sprites.front_default || ''}" alt="${pokemon.name}" class="imagem-atom detail-img" />
               
                <div class="type-container">${typesHtml}</div>

                <p class="texto-atom detail-info"><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
               
                <p class="texto-atom detail-info"><strong>Altura:</strong> ${pokemon.height / 10} m</p>
                
                <h3 class="stats-title">Estatísticas Base:</h3>
                <div class="stats-list">${statsHtml}</div>
               
                <p class="close-hint"><small>Clique em qualquer lugar para fechar</small></p>
            </div>
        `;

        this.modalOverlayEl.classList.remove('hidden');
        // Mostra o overlay do modal para escurecer o fundo
    }

    hideDetail() {
        // Oculta a vista de detalhes (modal)
        this.modalOverlayEl.classList.add('hidden');
        // Oculta o overlay
        this.pokemonDetailEl.classList.add('hidden');
        // Oculta o container de detalhes
        this.pokemonListEl.classList.remove('hidden');
        // Volta a mostrar a lista principal
    }

    _extractIdFromUrl(url) {
        // Método utilitário privado para extrair o ID numérico do final da URL
        const parts = url.split('/').filter(Boolean);
        // Divide a URL pela '/' e remove entradas vazias
        return parts[parts.length - 1];
        // Retorna o último segmento da URL, que é o ID
    }

    _capitalize(text) {
        // Método utilitário privado para colocar a primeira letra de uma string em maiúscula
        if (!text) return '';
        // Se o texto for vazio ou nulo, retorna string vazia
        return text.charAt(0).toUpperCase() + text.slice(1);
        // Converte a primeira letra para maiúscula e concatena com o resto da string
    }

    bindEvents({ onCardClick, onSearch, onDetailClose }) {
        // Método principal para registar os manipuladores de eventos. Recebe funções de callback do Controller
        this.pokemonListEl.addEventListener('click', (e) => {
            // Ouve cliques no container da lista (delegação de eventos)
            const card = e.target.closest('.pokemon-card');
            // Procura o cartão mais próximo (pai) do elemento clicado
            if (!card) return;
            // Se não for um cartão, ignora
            const name = card.dataset.name;
            // Obtém o nome do Pokémon do data-attribute
            if (onCardClick) onCardClick(name);
            // Chama a função de callback do Controller com o nome
        });

        const handleSearchAction = () => {
            // Função auxiliar para lidar com a lógica de pesquisa
            const term = this.searchInput.value.trim();
            // Obtém e limpa o termo de pesquisa
            if (onSearch) onSearch(term);
            // Chama a função de callback do Controller
        };

        this.searchBtn.addEventListener('click', handleSearchAction);
        // Ouve o clique no botão de pesquisa
        this.searchInput.addEventListener('keydown', (e) => {
            // Ouve eventos de teclado no campo de pesquisa
            if (e.key === 'Enter') handleSearchAction();
            // Se a tecla for "Enter", executa a pesquisa
        });

        const closeHandler = () => {
            // Função auxiliar para fechar o modal
            this.hideDetail();
            // Oculta o detalhe
            if (onDetailClose) onDetailClose();
            // Chama a função de callback do Controller
        };

        this.modalOverlayEl.addEventListener('click', closeHandler);
        // Ouve o clique no overlay para fechar o modal

        this.pokemonDetailEl.addEventListener('click', (e) => {
            // Ouve cliques no container de detalhes (para fechar se clicar dentro do card)
            if (e.target.closest('.card-detalhe-organism')) {
                // Se o clique for *dentro* do cartão de detalhe em si (e não no padding do container)
                closeHandler();
                // Fecha o modal
            }
        });
    }
}