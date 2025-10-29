// js/service/ApiService.js

class ApiService {
  // Define a classe do Service, responsável por toda a comunicação com a API externa (PokéAPI)
  constructor() {
    // Método construtor
    this.baseURL = 'https://pokeapi.co/api/v2';
    // Define a URL base da API para evitar repetição nos métodos de busca
  }

  async getPokemonList(offset = 0, limit = 24) {
    // Método assíncrono para obter uma lista paginada de Pokémons
    // Recebe 'offset' (início) e 'limit' (quantidade) com valores padrão
    try {
      // Inicia um bloco 'try' para gerir erros de rede ou de resposta da API
      const url = `${this.baseURL}/pokemon?offset=${offset}&limit=${limit}`;
      // Constrói a URL completa para a requisição, incluindo os parâmetros de paginação
      const response = await fetch(url);
      // Faz a requisição HTTP GET à API e aguarda a resposta

      if (!response.ok) throw new Error(`Erro ${response.status} ao buscar lista de pokémons`);
      // Verifica se a resposta HTTP foi bem-sucedida (status 200-299). Se não for, lança um erro.

      const data = await response.json();
      // Converte o corpo da resposta para um objeto JavaScript (JSON)
      return data;
      // Retorna o objeto de dados (que contém a lista sumária dos Pokémons)
    } catch (error) {
      // Bloco 'catch' para erros
      throw error;
      // Propaga o erro para o chamador (o Controller), que o irá tratar (mostrar na UI)
    }
  }

  async getPokemonDetails(nameOrId) {
    // Método assíncrono para obter os detalhes de um Pokémon específico
    // Pode receber o nome ou o ID do Pokémon
    try {
      // Inicia um bloco 'try'
      const id = String(nameOrId).toLowerCase();
      // Garante que o input é uma string e está em minúsculas (para o nome) ou é um ID numérico
      const url = `${this.baseURL}/pokemon/${id}`;
      // Constrói a URL completa para buscar os detalhes
      const response = await fetch(url);
      // Faz a requisição HTTP GET e aguarda a resposta

      if (!response.ok) {
        // Verifica se a resposta HTTP não foi bem-sucedida
        if (response.status === 404) {
          // Trata especificamente o erro 404 (Not Found)
          throw new Error(`Pokémon com ID/nome "${nameOrId}" não encontrado.`);
          // Lança um erro específico para o Controller mostrar ao utilizador
        }
        throw new Error(`Erro ${response.status} ao buscar detalhes do pokémon`);
        // Lança um erro genérico para outros códigos de status
      }

      const data = await response.json();
      // Converte o corpo da resposta para um objeto JavaScript (JSON)
      return data;
      // Retorna o objeto de dados detalhado do Pokémon
    } catch (error) {
      // Bloco 'catch' para erros
      throw error;
      // Propaga o erro para o Controller
    }
  }
}