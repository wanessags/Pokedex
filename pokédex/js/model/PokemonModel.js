class PokemonModel {
  // Define a classe do Model, responsável por armazenar e gerir os dados da aplicação
  constructor() {
    // Método construtor para inicializar o estado (dados) do Model
    this.pokemons = [];
    // Array para armazenar a lista de Pokémons carregados (lista principal)
    this.currentPokemon = null;
    // Objeto para armazenar os dados detalhados do Pokémon atualmente selecionado/visualizado
    this.offset = 0;
    // Variável para a paginação: indica o índice inicial (a partir de qual Pokémon buscar)
    this.limit = 24;
    // Variável para a paginação: indica o número máximo de Pokémons a carregar por vez
  }

  setPokemons(list) {
    // Método para definir/atualizar a lista principal de Pokémons
    this.pokemons = list;
    // Atribui a lista recebida ao estado interno do Model
  }

  getPokemons() {
    // Método para obter a lista principal de Pokémons
    return this.pokemons;
    // Retorna a lista armazenada
  }

  setCurrentPokemon(pokemon) {
    // Método para definir o Pokémon atualmente selecionado
    this.currentPokemon = pokemon;
    // Atribui o objeto Pokémon recebido
  }

  getCurrentPokemon() {
    // Método para obter o Pokémon atualmente selecionado
    return this.currentPokemon;
    // Retorna o Pokémon armazenado
  }

  setOffset(offset) {
    // Método para definir/atualizar o valor do offset (para próxima página/carga)
    this.offset = offset;
    // Atribui o novo valor de offset
  }

  getOffset() {
    // Método para obter o valor atual do offset
    return this.offset;
    // Retorna o valor de offset
  }

  getLimit() {
    // Método para obter o valor fixo do limit (quantos carregar)
    return this.limit;
    // Retorna o valor de limit
  }
}