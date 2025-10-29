(function () {
    // Ouve o evento que garante que todo o HTML foi carregado
    document.addEventListener('DOMContentLoaded', async function () {
        // Função assíncrona executada quando o DOM está pronto
        console.log('Iniciando aplicação Pokédex MVC...');
        // Mensagem de log para confirmar o início

        // Instanciação das camadas (Injeção de Dependência)
        // Aqui, criamos uma instância de cada parte (Service, Model, View)
        const apiService = new ApiService();
        // Cria a instância do Service (responsável pelas chamadas à API)
        const pokemonModel = new PokemonModel();
        // Cria a instância do Model (responsável pela gestão do estado dos dados)
        const pokemonView = new PokemonView();
        // Cria a instância da View (responsável pela UI e eventos)

        // Cria o Controller e injeta as dependências
        const pokemonController = new PokemonController(pokemonModel, pokemonView, apiService);
        // Cria a instância do Controller, passando Model, View e Service como argumentos (Injeção de Dependência)

        // Inicia a aplicação (carrega a lista inicial e eventos)
        await pokemonController.init();
        // Chama o método 'init' do Controller, que inicia o carregamento dos dados e regista os eventos
    });
})();

// O Controller, Model, View e Service são chamados e interligados aqui, 
// e o Controller orquestra o início das operações de carregamento e interação (eventos).