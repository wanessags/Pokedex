class PokemonController {
  // Define a classe do controlador
  constructor(model, view, service) {
    // Método construtor, que recebe Model, View e Service como dependências
    this.model = model;
    // Armazena a instância do Model para gerir os dados
    this.view = view;
    // Armazena a instância da View para gerir a interface do utilizador (UI)
    this.service = service;
    // Armazena a instância do Service para gerir a lógica de negócio e chamadas de API
  }

  //

  async init() {
    // Método de inicialização da aplicação (assíncrono, pois pode ter chamadas que demoram)
    try {
      // Inicia um bloco 'try' para capturar potenciais erros
      this.view.showLoading();
      // Pede à View para mostrar um indicador de carregamento (spinner)

      this.view.bindEvents({
        // Pede à View para registar os manipuladores de eventos da interface
        onCardClick: (name) => this.handleCardClick(name),
        // Associa o clique num cartão (card) ao método handleCardClick do Controller
        onSearch: (term) => this.handleSearch(term),
        // Associa o evento de pesquisa ao método handleSearch
        onDetailClose: () => this.handleDetailClose()
        // Associa o fecho do detalhe ao método handleDetailClose
      });

      await this.loadPokemons();
      // Chama o método para carregar a primeira lista de Pokémons e aguarda a conclusão

      this.view.hideLoading();
      // Pede à View para ocultar o indicador de carregamento
      console.log('Aplicação iniciada com sucesso');
      // Mensagem de sucesso na consola
    } catch (error) {
      // Bloco 'catch' para lidar com erros durante a inicialização
      this.view.hideLoading();
      // Garante que o indicador de carregamento seja ocultado, mesmo em caso de erro
      this.view.showError('Erro ao iniciar a aplicação');
      // Pede à View para mostrar uma mensagem de erro na interface
      console.error(error);
      // Regista o erro na consola
    }
  }

  async loadPokemons() {
    // Método assíncrono para carregar e renderizar a lista de Pokémons
    try {
      // Inicia um bloco 'try'
      this.view.showLoading();
      // Mostra o indicador de carregamento (porque é uma operação assíncrona)
      const offset = this.model.getOffset();
      // Obtém o índice de início (offset) da lista no Model
      const limit = this.model.getLimit();
      // Obtém o número de itens a carregar (limit) no Model

      const data = await this.service.getPokemonList(offset, limit);
      // Chama o Service para obter a lista inicial (sumário) de Pokémons da API
      const listSummary = data.results || [];
      // Extrai a lista de resultados, garantindo que seja um array vazio se não houver dados

      const detailPromises = listSummary.map(p => this.service.getPokemonDetails(p.name));
      // Cria um array de Promises, onde cada Promise obtém os detalhes de um Pokémon (pelo nome)
      const fullList = await Promise.all(detailPromises);
      // Aguarda que todas as Promises de detalhe sejam resolvidas (carregamento paralelo)

      this.model.setPokemons(fullList);
      // Armazena a lista completa de Pokémons detalhados no Model
      this.view.renderList(this.model.getPokemons());
      // Pede à View para renderizar a lista de Pokémons a partir dos dados no Model
    } catch (error) {
      // Bloco 'catch' para lidar com erros de carregamento
      this.view.showError('Erro ao carregar lista de pokémons');
      // Mostra uma mensagem de erro
      console.error(error);
      // Regista o erro na consola
    } finally {
      // Bloco 'finally' que é executado sempre, independentemente do sucesso ou erro
      this.view.hideLoading();
      // Garante que o indicador de carregamento seja ocultado
    }
  }

  async handleCardClick(name) {
    // Manipulador de evento para o clique num cartão (assíncrono, carrega detalhes)
    try {
      // Inicia um bloco 'try'
      this.view.showLoading();
      // Mostra o indicador de carregamento
      const pokemon = await this.service.getPokemonDetails(name);
      // Chama o Service para obter os detalhes do Pokémon selecionado
      this.model.setCurrentPokemon(pokemon);
      // Armazena o Pokémon atual no Model
      this.view.renderDetail(pokemon);
      // Pede à View para renderizar os detalhes desse Pokémon
    } catch (error) {
      // Bloco 'catch' para lidar com erros ao carregar detalhes
      this.view.showError('Erro ao carregar detalhes do pokémon');
      // Mostra uma mensagem de erro
      console.error(error);
      // Regista o erro na consola
    } finally {
      // Bloco 'finally'
      this.view.hideLoading();
      // Garante que o indicador de carregamento seja ocultado
    }
  }

  async handleSearch(term) {
    // Manipulador de evento para a pesquisa (assíncrono)
    if (!term) {
      // Verifica se o termo de pesquisa está vazio
      this.model.setOffset(0);
      // Se estiver vazio, reinicia o offset para o início da lista
      await this.loadPokemons();
      // Recarrega a lista completa de Pokémons
      return;
      // Sai da função
    }

    try {
      // Inicia um bloco 'try'
      this.view.showLoading();
      // Mostra o indicador de carregamento
      const pokemon = await this.service.getPokemonDetails(term.toLowerCase());
      // Chama o Service para obter detalhes do Pokémon com o termo de pesquisa (em minúsculas)

      this.model.setCurrentPokemon(pokemon);
      // Armazena o Pokémon encontrado no Model
      this.view.renderDetail(pokemon);
      // Pede à View para renderizar os detalhes do Pokémon encontrado (resultado da pesquisa)
    } catch (error) {
      // Bloco 'catch' para lidar com erros na pesquisa
      this.view.showError(error.message || 'Pokémon não encontrado. Tente outro nome ou id.');
      // Mostra uma mensagem de erro personalizada ou padrão
      console.error(error);
      // Regista o erro na consola
    } finally {
      // Bloco 'finally'
      this.view.hideLoading();
      // Garante que o indicador de carregamento seja ocultado
    }
  }

  async handleDetailClose() {
    // Manipulador de evento para o fecho da vista de detalhes (assíncrono)
    await this.loadPokemons();
    // Recarrega a lista completa de Pokémons, voltando à vista de lista principal
  }
}