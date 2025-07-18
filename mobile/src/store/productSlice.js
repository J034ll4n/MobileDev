// src/store/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; // Importa createSlice para criar a "fatia" do estado e createAsyncThunk para ações assíncronas
import { getProductsByCategory, getProductDetails } from '../services/api'; // Importa funções de API para buscar produtos

/**
 * @function fetchProductsByCategory
 * @description Thunk assíncrono para buscar produtos de uma categoria específica.
 * Utiliza `createAsyncThunk` para lidar com os diferentes estágios de uma requisição
 * assíncrona (pending, fulfilled, rejected).
 * @param {object} arg - Argumentos passados para o thunk.
 * @param {string} arg.category - O nome da categoria de produtos a ser buscada.
 * @param {object} thunkAPI - Objeto com utilitários do Redux Thunk (ex: `rejectWithValue`).
 * @returns {Promise<object>} Uma Promise que resolve com um objeto contendo a categoria e os produtos,
 * ou rejeita com a mensagem de erro.
 */
export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchByCategory', // Tipo de ação base (ex: 'products/fetchByCategory/pending', '/fulfilled', '/rejected')
  async ({ category }, { rejectWithValue }) => {
    try {
      // Chama a função da API para buscar produtos por categoria
      const products = await getProductsByCategory(category);
      // Retorna os dados que serão incluídos no payload da ação fulfilled
      return { category, products };
    } catch (error) {
      // Em caso de erro, rejeita a Promise com a mensagem de erro para que o estado rejected seja tratado
      return rejectWithValue(error.message);
    }
  }
);

/**
 * @function fetchProductDetails
 * @description Thunk assíncrono para buscar os detalhes de um único produto pelo seu ID.
 * Similar a `fetchProductsByCategory`, lida com os estágios de requisição.
 * @param {number} productId - O ID do produto cujos detalhes devem ser buscados.
 * @param {object} thunkAPI - Objeto com utilitários do Redux Thunk.
 * @returns {Promise<object>} Uma Promise que resolve com o objeto de detalhes do produto,
 * ou rejeita com a mensagem de erro.
 */
export const fetchProductDetails = createAsyncThunk(
  'products/fetchDetails', // Tipo de ação base
  async (productId, { rejectWithValue }) => {
    try {
      // Chama a função da API para buscar detalhes do produto
      const product = await getProductDetails(productId);
      // Retorna os dados que serão incluídos no payload da ação fulfilled
      return product;
    } catch (error) {
      // Em caso de erro, rejeita a Promise com a mensagem de erro
      return rejectWithValue(error.message);
    }
  }
);

/**
 * @constant productSlice
 * @description Define um "slice" do estado Redux para gerenciar os dados dos produtos.
 * Isso inclui a lista de produtos por categoria e os detalhes do produto atualmente visualizado,
 * juntamente com seus respectivos status de carregamento e erro.
 */
const productSlice = createSlice({
  name: 'products', // Nome do slice
  
  // initialState: Define o estado inicial para este slice.
  initialState: {
    // categories: Objeto para armazenar produtos organizados por categoria.
    // Cada chave de categoria (ex: 'mens-shirts') contém um objeto com:
    //   - `items`: array de produtos daquela categoria.
    //   - `status`: status da requisição ('idle'|'loading'|'succeeded'|'failed').
    //   - `error`: mensagem de erro para a requisição da categoria.
    categories: {}, 
    // currentProduct: Objeto que armazena os detalhes do produto atualmente sendo visualizado.
    currentProduct: null,
    // status: Status geral da requisição para o `currentProduct` ('idle'|'loading'|'succeeded'|'failed').
    status: 'idle', 
    // error: Mensagem de erro para a requisição de `currentProduct`.
    error: null,
  },
  
  // reducers: Objeto para reducers síncronos. Neste slice, não há reducers síncronos customizados.
  reducers: {},
  
  // extraReducers: Objeto para lidar com ações definidas fora do slice (como as ações geradas por createAsyncThunk).
  // Usa um "builder" para adicionar casos de reducer para os diferentes estágios dos thunks assíncronos.
  extraReducers: (builder) => {
    builder
      // --- Reducers para fetchProductsByCategory (Buscar Produtos por Categoria) ---
      // Caso: Requisição `fetchProductsByCategory` está pendente
      .addCase(fetchProductsByCategory.pending, (state, action) => {
        // Obtém a categoria do argumento original do thunk
        const category = action.meta.arg.category;
        // Se a categoria ainda não existe no estado, inicializa-a
        if (!state.categories[category]) {
          state.categories[category] = { items: [], status: 'loading', error: null };
        } else {
          // Se a categoria já existe, apenas atualiza o status para 'loading'
          state.categories[category].status = 'loading';
        }
      })
      // Caso: Requisição `fetchProductsByCategory` foi bem-sucedida
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        // Extrai a categoria e os produtos do payload da ação
        const { category, products } = action.payload;
        // Atualiza os produtos e o status para 'succeeded' para a categoria específica
        state.categories[category] = { items: products, status: 'succeeded', error: null };
      })
      // Caso: Requisição `fetchProductsByCategory` foi rejeitada (falhou)
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        const category = action.meta.arg.category;
        // Se a categoria ainda não existe, inicializa-a com status 'failed' e o erro
        if (!state.categories[category]) {
          state.categories[category] = { items: [], status: 'failed', error: action.payload };
        } else {
          // Se a categoria existe, atualiza o status e a mensagem de erro
          state.categories[category].status = 'failed';
          state.categories[category].error = action.payload;
        }
      })
      // --- Reducers para fetchProductDetails (Buscar Detalhes de Produto) ---
      // Caso: Requisição `fetchProductDetails` está pendente
      .addCase(fetchProductDetails.pending, (state) => {
        // Define o status geral para 'loading' e limpa qualquer erro anterior
        state.status = 'loading';
        state.error = null;
      })
      // Caso: Requisição `fetchProductDetails` foi bem-sucedida
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        // Define o status geral para 'succeeded' e armazena os detalhes do produto
        state.status = 'succeeded';
        state.currentProduct = action.payload;
      })
      // Caso: Requisição `fetchProductDetails` foi rejeitada (falhou)
      .addCase(fetchProductDetails.rejected, (state, action) => {
        // Define o status geral para 'failed' e armazena a mensagem de erro
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Exporta o reducer gerado pelo createSlice.
// Este reducer será combinado com outros reducers na store principal do Redux.
export default productSlice.reducer;
