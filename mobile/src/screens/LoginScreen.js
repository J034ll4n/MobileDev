import React, { useState } from 'react';
import {
  View,           // Contêiner básico para layout
  Text,           // Exibição de texto
  TextInput,      // Campo de entrada de texto
  TouchableOpacity, // Botão que responde ao toque com feedback de opacidade
  StyleSheet,     // API para criar folhas de estilo
  ActivityIndicator, // Indicador de carregamento (spinner)
  Alert,          // API para exibir caixas de diálogo de alerta
  Dimensions,     // API para obter as dimensões da tela do dispositivo
  Image           // Componente para exibir imagens (não usado diretamente neste layout final)
} from 'react-native';

// Importa o hook useDispatch do Redux para despachar ações
import { useDispatch } from 'react-redux';
// Importa a ação de sucesso de login do slice de autenticação do Redux
import { loginSuccess } from '../store/authSlice';
// Importa a função de mock de login da API para simular a autenticação
import { mockLogin } from '../services/api';
// Importa ícones da biblioteca @expo/vector-icons
// MaterialIcons para ícones de erro e Ionicons para o ícone de olho (mostrar/ocultar senha)
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

// Obtém a altura e largura da janela para design responsivo e posicionamento de elementos
const { height, width } = Dimensions.get('window');

/**
 * @function LoginScreen
 * @description Componente de tela responsável pela interface e lógica de login do usuário.
 * Gerencia a entrada de dados (usuário/senha), validação de campos, simulação de autenticação
 * e feedback visual para o usuário (carregamento, erros, visibilidade da senha).
 */
const LoginScreen = () => {
  // --- Estados do Componente ---

  // Estado para armazenar o valor do campo de nome de usuário/email
  const [username, setUsername] = useState('');
  // Estado para armazenar o valor do campo de senha
  const [password, setPassword] = useState('');
  // Estado para controlar a exibição do indicador de carregamento durante o processo de login
  const [isLoading, setIsLoading] = useState(false);

  // Estados para controlar a validade individual dos campos de usuário e senha
  // Usados para exibir feedback visual (borda vermelha, mensagem de erro)
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  // Estado para controlar a visibilidade do texto da senha no campo de input
  // Controlado pelo ícone de olho (mostrar/ocultar senha)
  const [showPassword, setShowPassword] = useState(false);

  // Estado para armazenar e exibir mensagens de erro genéricas de login (e.g., "Usuário ou senha inválidos")
  // Esta mensagem substitui o título do formulário em caso de falha de autenticação.
  const [loginErrorMessage, setLoginErrorMessage] = useState('');

  // Hook useDispatch para obter a função de despacho de ações Redux
  const dispatch = useDispatch();

  /**
   * @function validateFields
   * @description Valida os campos de nome de usuário e senha, verificando se estão vazios
   * ou contêm apenas espaços em branco.
   * Atualiza os estados de validade (`isUsernameValid`, `isPasswordValid`) para controlar
   * o feedback visual de erro.
   * @returns {boolean} `true` se todos os campos estiverem preenchidos e válidos, `false` caso contrário.
   */
  const validateFields = () => {
    let valid = true; // Assume que os campos são válidos por padrão

    // Validação do campo de nome de usuário/email
    if (username.trim() === '') { // `trim()` remove espaços em branco antes/depois da string
      setIsUsernameValid(false);  // Marca o campo como inválido
      valid = false;              // Define a validação geral como falsa
    } else {
      setIsUsernameValid(true);   // Marca o campo como válido
    }

    // Validação do campo de senha
    if (password.trim() === '') {
      setIsPasswordValid(false);
      valid = false;
    } else {
      setIsPasswordValid(true);
    }
    return valid; // Retorna o resultado da validação geral
  };

  /**
   * @function handleLogin
   * @description Função assíncrona que lida com o processo de login quando o botão "Entrar" é pressionado.
   * 1. Limpa qualquer mensagem de erro de login anterior.
   * 2. Valida os campos de entrada.
   * 3. Se os campos forem válidos, ativa o indicador de carregamento.
   * 4. Tenta autenticar o usuário através da função `mockLogin` (simulação de API).
   * 5. Em caso de sucesso, despacha a ação `loginSuccess` para o Redux.
   * 6. Em caso de falha (credenciais inválidas ou erro de rede), define a mensagem de erro apropriada.
   * 7. Desativa o indicador de carregamento ao final do processo.
   */
  const handleLogin = async () => {
    // Limpa qualquer mensagem de erro de login genérica antes de uma nova tentativa
    setLoginErrorMessage('');

    // Valida os campos do formulário
    const fieldsAreValid = validateFields();

    // Se a validação dos campos falhar (campos vazios), exibe um alerta e interrompe a função
    if (!fieldsAreValid) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Ativa o indicador de carregamento
    setIsLoading(true);
    
    try {
      // Simula a chamada da API de login
      const response = await mockLogin(username, password);

      // Verifica se a autenticação foi bem-sucedida
      if (response.success) {
        // Despacha a ação `loginSuccess` para atualizar o estado de autenticação no Redux
        dispatch(loginSuccess({ user: response.user }));
        // A navegação para a tela principal é gerenciada pelo AppNavigator,
        // que observa o estado `isLoggedIn` do Redux.
      } else {
        // Define a mensagem de erro específica para credenciais inválidas
        setLoginErrorMessage('Usuário ou senha inválidos.');
      }
    } catch (error) {
      // Captura e define a mensagem para outros erros (e.g., erro de rede, erro na simulação)
      setLoginErrorMessage(error.message || 'Ocorreu um erro ao tentar fazer login.');
    } finally {
      // Desativa o indicador de carregamento, independentemente do resultado da autenticação
      setIsLoading(false);
    }
  };

  // --- Renderização da Interface do Usuário ---
  return (
    // outerContainer: View principal que envolve toda a tela de login
    <View style={styles.outerContainer}>
      {/* topBlueHalf: Seção superior da tela com fundo azul e textos de boas-vindas */}
      <View style={styles.topBlueHalf}>
        <Text style={styles.headerTitle}>Bem-vindo de volta!</Text>
        <Text style={styles.headerSubtitle}>Insira seus dados para entrar na conta.</Text>
      </View>

      {/* loginCard: O card branco flutuante que contém os campos do formulário de login */}
      <View style={styles.loginCard}>
        {/* Renderização condicional do título do formulário ou da mensagem de erro de login.
          Se houver uma mensagem de erro (`loginErrorMessage` não está vazio), ela é exibida.
          Caso contrário, o título padrão "Acesse sua conta" é mostrado.
        */}
        {loginErrorMessage ? (
          <Text style={styles.generalErrorMessage}>{loginErrorMessage}</Text>
        ) : (
          <Text style={styles.formTitle}>Acesse sua conta</Text>
        )}

        {/* Campo de input para Nome de Usuário/Email */}
        <TextInput
          style={[
            styles.input,                                 // Estilos base do input
            !isUsernameValid && styles.inputError,        // Aplica borda vermelha se o campo for inválido
            { marginBottom: !isUsernameValid ? 0 : 15 }  // Ajusta margem inferior: 0px se há erro (para a msg de erro colar no input), senão 15px
          ]}
          placeholder="Email ou Usuário"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            // Limpa o estado de erro do campo assim que o usuário começa a digitar
            if (!isUsernameValid && text.trim() !== '') {
              setIsUsernameValid(true);
            }
            // Limpa a mensagem de erro geral de login ao iniciar a digitação em qualquer campo
            setLoginErrorMessage('');
          }}
          onBlur={() => validateFields()} // Dispara a validação quando o campo perde o foco
          autoCapitalize="none"          // Desativa a capitalização automática do texto
          keyboardType="email-address"   // Sugere um layout de teclado para email
          placeholderTextColor="#888"    // Cor do texto do placeholder
        />
        {/* Mensagem de erro e ícone para o campo de usuário, visíveis apenas se `isUsernameValid` for `false` */}
        {!isUsernameValid && (
          <View style={styles.errorMessageContainer}>
            <MaterialIcons name="error" size={16} color="red" /> {/* Ícone de erro de exclamação */}
            <Text style={styles.errorMessageText}>Campo Obrigatório</Text> {/* Texto da mensagem de erro */}
          </View>
        )}

        {/* Campo de Senha com funcionalidade de mostrar/ocultar e validação */}
        {/* passwordInputContainer: View que agrupa o TextInput da senha e o botão de "olho" */}
        <View style={[
          styles.passwordInputContainer,                      // Estilos base do contêiner da senha
          !isPasswordValid && styles.inputError,              // Aplica borda vermelha ao CONTÊINER se o campo for inválido
          { marginTop: 10, marginBottom: !isPasswordValid ? 0 : 15 } // Margens ajustáveis para o contêiner da senha
        ]}>
          <TextInput
            style={[
              styles.input,                               // Estilos base do input (flex:1, height, padding)
              { borderWidth: 0, backgroundColor: 'transparent' } // Remove borda e fundo do TextInput interno,
                                                              // pois o contêiner pai gerencia esses estilos.
            ]}
            placeholder="Senha"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (!isPasswordValid && text.trim() !== '') {
                setIsPasswordValid(true);
              }
              setLoginErrorMessage(''); // Limpa a mensagem de erro geral ao digitar
            }}
            onBlur={() => validateFields()}   // Dispara a validação ao perder o foco
            secureTextEntry={!showPassword}   // Oculta/mostra o texto da senha com base no estado `showPassword`
            placeholderTextColor="#888"
          />
          {/* Botão de alternar visibilidade da senha (ícone de olho) */}
          <TouchableOpacity
            style={styles.togglePasswordButton}
            onPress={() => setShowPassword(!showPassword)} // Inverte o estado `showPassword`
          >
            {/* Ionicons: Renderiza o ícone de olho aberto ou fechado dinamicamente */}
            <Ionicons
              name={showPassword ? "eye-off" : "eye"} // "eye-off" se senha visível, "eye" se oculta
              size={24}
              color="#888"
            />
          </TouchableOpacity>
        </View>
        {/* Mensagem de erro e ícone para o campo de senha, visíveis apenas se `isPasswordValid` for `false` */}
        {!isPasswordValid && (
          <View style={styles.errorMessageContainer}>
            <MaterialIcons name="error" size={16} color="red" />
            <Text style={styles.errorMessageText}>Campo Obrigatório</Text>
          </View>
        )}

        {/* forgotPasswordButton: Botão para recuperar a senha */}
        <TouchableOpacity style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        {/* button: Botão principal "Entrar" para iniciar o processo de login */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}    // Função chamada ao pressionar
          disabled={isLoading}     // Desabilita o botão enquanto `isLoading` for `true`
        >
          {/* Renderização condicional do conteúdo do botão: spinner de carregamento ou texto "Entrar" */}
          {isLoading ? (
            <ActivityIndicator color="#fff" /> // Exibe um spinner branco durante o carregamento
          ) : (
            <Text style={styles.buttonText}>Entrar</Text> // Texto padrão do botão
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- Folha de Estilos do Componente LoginScreen ---
const styles = StyleSheet.create({
  // outerContainer: Estilo do contêiner View mais externo, ocupa toda a tela.
  outerContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8', // Fundo cinza claro para a parte inferior da tela
  },
  // topBlueHalf: Estilo para a seção superior da tela com fundo azul
  topBlueHalf: {
    width: '100%',
    height: height * 0.50,  // Ocupa 45% da altura da tela
    backgroundColor: '#2567e8', // Cor azul do tema
    justifyContent: 'center', // Centraliza o conteúdo verticalmente
    alignItems: 'center',     // Centraliza o conteúdo horizontalmente
    // Sombra para dar um efeito de elevação 3D
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  // headerTitle: Estilo para o título principal "Bem-vindo de volta!"
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    marginTop: -50, // Ajusta a posição do título para que ele se projete acima do card de login
  },
  // headerSubtitle: Estilo para o subtítulo "Insira seus dados..."
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 20, // Padding para evitar que o texto cole nas bordas
  },
  // loginCard: Estilo para o contêiner do formulário de login (o card branco flutuante)
  loginCard: {
    width: '90%',                   // Largura do card
    backgroundColor: '#fff',        // Fundo branco
    borderRadius: 15,               // Cantos arredondados
    padding: 25,                    // Espaçamento interno
    position: 'absolute',           // Permite que o card flutue sobre outros elementos
    top: height * 0.3,              // Posiciona o topo do card a 30% da altura da tela
    alignSelf: 'center',            // Centraliza o card horizontalmente
    // Sombra para dar um efeito de elevação 3D ao card
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  // formTitle: Estilo para o título "Acesse sua conta" dentro do formulário
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30, // Margem inferior antes do primeiro campo de input
    textAlign: 'center',
  },
  // generalErrorMessage: Estilo para a mensagem de erro de login geral (usuário/senha inválidos)
  generalErrorMessage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    marginBottom: 30, // Mantém a mesma margem do formTitle para consistência de layout
  },
  // input: Estilo base para os campos de entrada de texto (TextInput)
  input: {
    flex: 1,                        // Ocupa o espaço disponível em um contêiner flex row
    height: 50,                     // Altura fixa do campo
    backgroundColor: '#f0f0f0',    // Fundo cinza claro
    borderRadius: 8,                // Cantos arredondados
    paddingHorizontal: 15,          // Padding interno horizontal do texto
    fontSize: 16,                   // Tamanho da fonte do texto digitado
    borderWidth: 1,                 // Largura da borda padrão
    borderColor: '#e0e0e0',        // Cor da borda padrão
    color: '#333',                  // Cor do texto digitado
  },
  // inputError: Estilo condicional para a borda do input quando o campo é inválido
  inputError: {
    borderColor: 'red',             // Borda vermelha
    borderWidth: 2,                 // Borda mais grossa para destaque
  },
  // errorMessageContainer: Contêiner para o ícone de erro e o texto da mensagem de erro
  errorMessageContainer: {
    flexDirection: 'row',           // Ícone e texto lado a lado
    alignItems: 'center',           // Alinha verticalmente no centro
    marginTop: 4,                   // Espaço entre o input e a mensagem de erro
    marginBottom: 15,               // Espaço abaixo da mensagem de erro e o próximo campo
    paddingLeft: 5,                 // Recuo para alinhamento
  },
  // errorMessageText: Estilo para o texto da mensagem de erro individual de campo
  errorMessageText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 5,                  // Espaço entre o ícone e o texto
  },
  // forgotPasswordButton: Estilo para o botão "Esqueceu a senha?"
  forgotPasswordButton: {
    marginTop: 5,
    alignSelf: 'flex-end',          // Alinha o botão à direita
  },
  // forgotPasswordText: Estilo para o texto do botão "Esqueceu a senha?"
  forgotPasswordText: {
    color: '#2567e8',               // Cor azul do tema
    fontSize: 14,
  },
  // button: Estilo para o botão principal de ação (Entrar)
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#2567e8',    // Cor de fundo do botão (azul do tema)
    borderRadius: 8,                // Cantos arredondados
    justifyContent: 'center',       // Centraliza o conteúdo verticalmente
    alignItems: 'center',           // Centraliza o conteúdo horizontalmente
    marginTop: 20,                  // Margem superior para separar de outros elementos
  },
  // buttonText: Estilo para o texto do botão de ação
  buttonText: {
    color: '#fff',                  // Cor do texto branco
    fontSize: 18,
    fontWeight: 'bold',
  },
  // passwordInputContainer: Contêiner para o campo de senha e o ícone de olho
  passwordInputContainer: {
    flexDirection: 'row',           // Ícone e campo lado a lado
    alignItems: 'center',           // Alinha verticalmente
    backgroundColor: '#f0f0f0',    // Fundo cinza claro
    borderRadius: 8,                // Cantos arredondados
    borderWidth: 1,                 // Borda do contêiner
    borderColor: '#e0e0e0',        // Cor da borda
    // Margens são aplicadas no JSX para flexibilidade baseada em validação
  },
  // togglePasswordButton: Estilo para o botão de alternar visibilidade da senha (ícone de olho)
  togglePasswordButton: {
    padding: 10,                    // Área de toque maior
    position: 'absolute',           // Posiciona o botão de forma absoluta dentro de passwordInputContainer
    right: 0,                       // Alinha à direita
    justifyContent: 'center',       // Centraliza o ícone verticalmente
    height: '100%',                 // Ocupa toda a altura do contêiner
  },
});

export default LoginScreen;
