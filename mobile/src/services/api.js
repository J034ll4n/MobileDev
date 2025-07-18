// src/services/api.js
import axios from 'axios'; // Importa a biblioteca Axios para fazer requisições HTTP

/**
 * @constant api
 * @description Instância configurada do Axios para interagir com a API DummyJSON.
 * Define a URL base, um tempo limite para as requisições e cabeçalhos padrão.
 */
const api = axios.create({
  baseURL: 'https://dummyjson.com/', // URL base para todas as requisições da API DummyJSON
  timeout: 10000,                   // Tempo limite de 10 segundos para cada requisição.
                                    // Se a resposta não for recebida dentro desse tempo, a requisição é abortada.
  headers: {
    'Content-Type': 'application/json', // Define o tipo de conteúdo padrão para as requisições como JSON.
  },
});

/**
 * @function getProductsByCategory
 * @description Função assíncrona para buscar uma lista de produtos de uma categoria específica na API.
 * @param {string} category - O nome da categoria de produtos a ser buscada (ex: 'mens-shirts', 'womens-dresses').
 * @returns {Promise<object[]>} Uma Promise que resolve com um array de objetos de produtos.
 * @throws {Error} Lança um erro se a requisição falhar ou se houver um problema de rede.
 */
export const getProductsByCategory = async (category) => {
  try {
    // Faz uma requisição GET para o endpoint de produtos por categoria
    const response = await api.get(`products/category/${category}`);
    // A API dummyjson.com retorna os produtos dentro de um array aninhado 'products' na propriedade 'data'.
    return response.data.products;
  } catch (error) {
    // Captura erros da requisição (rede, servidor, etc.)
    // Loga o erro detalhado no console para depuração.
    console.error(`Erro ao buscar produtos da categoria ${category}:`, error.response?.data || error.message);
    // Lança um novo erro com uma mensagem amigável para ser tratada pela UI.
    throw new Error('Não foi possível carregar os produtos. Tente novamente mais tarde.');
  }
};

/**
 * @function getProductDetails
 * @description Função assíncrona para buscar os detalhes de um produto específico na API pelo seu ID.
 * @param {number} id - O ID único do produto a ser buscado.
 * @returns {Promise<object>} Uma Promise que resolve com o objeto de detalhes do produto.
 * @throws {Error} Lança um erro se a requisição falhar ou se o produto não for encontrado.
 */
export const getProductDetails = async (id) => {
  try {
    // Faz uma requisição GET para o endpoint de detalhes do produto
    const response = await api.get(`products/${id}`);
    // A API dummyjson.com retorna o objeto do produto diretamente na propriedade 'data'.
    return response.data;
  } catch (error) {
    // Captura erros da requisição
    console.error(`Erro ao buscar detalhes do produto ${id}:`, error.response?.data || error.message);
    // Lança um novo erro com uma mensagem amigável para a UI.
    throw new Error('Não foi possível carregar os detalhes do produto. Tente novamente mais tarde.');
  }
};

/**
 * @function mockLogin
 * @description Função assíncrona que simula um processo de login.
 * Esta função não se conecta a uma API de login real, mas simula um atraso de rede
 * e verifica credenciais hardcoded ('user'/'password').
 * @param {string} username - O nome de usuário fornecido para o login.
 * @param {string} password - A senha fornecida para o login.
 * @returns {Promise<object>} Uma Promise que resolve com `{ success: true, user: { ... } }` em caso de sucesso,
 * ou rejeita com um erro em caso de falha de autenticação.
 */
export const mockLogin = async (username, password) => {
  return new Promise((resolve, reject) => {
    // Simula um atraso de rede de 1 segundo (1000ms)
    setTimeout(() => {
      // Verifica se as credenciais correspondem aos valores hardcoded
      if (username === 'user' && password === 'password') {
        // Resolve a Promise com sucesso e um objeto de usuário mock
        resolve({ success: true, user: { username: 'user', name: 'Usuário Teste' } });
      } else {
        // Rejeita a Promise com uma mensagem de erro para credenciais inválidas
        reject(new Error('Usuário ou senha inválidos.'));
      }
    }, 1000); // Atraso de 1 segundo
  });
};

// Exporta a instância configurada do Axios como exportação padrão,
// permitindo que outros módulos a importem para fazer requisições personalizadas.
export default api;
