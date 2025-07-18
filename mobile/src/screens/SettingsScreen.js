// src/screens/SettingsScreen.js
import React from 'react';
import userProfileImage from 'C:/Users/zirn/Desktop/programador/mobile/MobileDev/mobile/src/assets/usuario.jpg'
import { 
  View,           // Contêiner básico para layout
  Text,           // Exibição de texto
  StyleSheet,     // API para criar folhas de estilo
  TouchableOpacity, // Botão que responde ao toque com feedback de opacidade
  Image,          // Componente para exibir imagens
  Alert           // API para exibir caixas de diálogo de alerta
} from 'react-native';

// Importa SafeAreaView para garantir que o conteúdo não se sobreponha a elementos do sistema (notch, barra de status)
import { SafeAreaView } from 'react-native-safe-area-context';
// Importa hooks do Redux para interagir com o store (dispatch para ações, useSelector para estado)
import { useDispatch, useSelector } from 'react-redux'; 
// Importa a ação de logout do slice de autenticação do Redux
import { logout } from '../store/authSlice';
// Importa ícones da biblioteca @expo/vector-icons
// Ionicons para a seta de navegação e MaterialCommunityIcons para ícones de menu
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 

/**
 * @function SettingsScreen
 * @description Componente de tela que exibe as configurações do aplicativo.
 * Inclui informações do perfil do usuário, opções de menu de navegação e um botão de logout.
 * O design replica a imagem do Figma fornecida.
 */
const SettingsScreen = () => {
  // Hook useDispatch para obter a função de despacho de ações Redux
  const dispatch = useDispatch();
  // Hook useSelector para obter os dados do usuário (nome, username/email) do estado Redux
  const user = useSelector((state) => state.auth.user); 

  // Define o nome de usuário e e-mail. Prioriza dados do Redux, caso contrário, usa mock data.
  const userName = user?.name || 'João da Silva'; 
  const userEmail = user?.username || 'joaodasilva@gmail.com'; 

  /**
   * @function handleLogout
   * @description Lida com a ação de logout do usuário.
   * Exibe um alerta de confirmação antes de despachar a ação `logout` para o Redux.
   */
  const handleLogout = () => {
    Alert.alert(
      "Sair",                     // Título do alerta
      "Tem certeza que deseja sair?", // Mensagem do alerta
      [
        {
          text: "Cancelar",       // Texto do botão "Cancelar"
          style: "cancel"         // Estilo para o botão "Cancelar" (geralmente cinza)
        },
        {
          text: "Sim",            // Texto do botão "Sim"
          onPress: () => dispatch(logout()) // Despacha a ação `logout` ao pressionar "Sim"
        }
      ],
      { cancelable: true }        // Permite fechar o alerta tocando fora dele
    );
  };

  /**
   * @function OptionItem
   * @description Componente auxiliar reutilizável para renderizar cada item de opção de menu.
   * Exibe um ícone, um texto e uma seta de navegação.
   * @param {object} props - Propriedades do componente.
   * @param {string} props.iconName - Nome do ícone a ser exibido (ex: 'account-outline').
   * @param {string} props.text - O texto da opção de menu (ex: 'Meus dados').
   * @param {function} props.onPress - A função de callback a ser executada quando o item for pressionado.
   * @param {object} [props.iconSet=MaterialCommunityIcons] - O componente do conjunto de ícones a ser usado para o ícone principal. Padrão é MaterialCommunityIcons.
   * @returns {JSX.Element} Um TouchableOpacity estilizado que representa um item de menu.
   */
  const OptionItem = ({ iconName, text, onPress, iconSet: IconComponent = MaterialCommunityIcons }) => (
    <TouchableOpacity style={styles.optionButton} onPress={onPress}>
      {/* optionContent: View que agrupa o ícone principal e o texto da opção */}
      <View style={styles.optionContent}>
        <IconComponent name={iconName} size={24} color="#555" /> {/* Ícone principal */}
        <Text style={styles.optionButtonText}>{text}</Text>     {/* Texto da opção */}
      </View>
      {/* Seta de navegação à direita */}
      <Ionicons name="chevron-forward-outline" size={24} color="#888" /> 
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* topBlueSection: Seção superior da tela com fundo azul e imagem de perfil */}
      <View style={styles.topBlueSection}>
        {/* profileImage: Imagem de perfil do usuário.
          Posicionada de forma absoluta para criar o efeito de sobreposição no card branco.
        */}
        <Image
          // --- MUDANÇA AQUI ---
          source={userProfileImage} // Use a variável que importou com 'require()'
          // source={require('../../assets/usuario.jpg')} // Ou pode usar require diretamente aqui
          style={styles.profileImage}
        />
      </View>

      {/* contentCard: O card branco que contém as informações do usuário e as opções de menu */}
      <View style={styles.contentCard}>
        {/* Informações do usuário (nome e e-mail) */}
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userEmail}>{userEmail}</Text>

        {/* Opções de menu, renderizadas usando o componente OptionItem reutilizável */}
        <OptionItem 
          iconName="account-outline" 
          text="Meus dados" 
          onPress={() => Alert.alert("Navegar", "Meus Dados")} // Ação de exemplo ao clicar
        />
        <OptionItem 
          iconName="bell-outline" 
          text="Notificações" 
          onPress={() => Alert.alert("Navegar", "Notificações")} 
        />
        <OptionItem 
          iconName="script-text-outline" 
          text="Termos de uso" 
          onPress={() => Alert.alert("Navegar", "Termos de uso")} 
        />

        {/* Botão Sair da Conta: Exibe o botão de logout com estilo vermelho */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout} // Chama a função `handleLogout` ao ser pressionado
        >
          <Text style={styles.logoutButtonText}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// --- Folha de Estilos do Componente SettingsScreen ---
const styles = StyleSheet.create({
  // safeArea: Estilo para o contêiner principal SafeAreaView
  safeArea: {
    flex: 1,                          // Ocupa todo o espaço disponível
    backgroundColor: '#2567e8',       // Cor de fundo padrão da tela
  },
  // topBlueSection: Estilo para a View que cria a seção superior azul da tela de perfil
  topBlueSection: {
    width: '100%',                    // Ocupa toda a largura
    height: 150,                      // Altura fixa da seção azul
    backgroundColor: '#2567e8',       // Cor azul do tema
    justifyContent: 'flex-end',       // Alinha o conteúdo (imagem de perfil) à parte inferior
    alignItems: 'center',             // Centraliza o conteúdo horizontalmente
    paddingBottom: 20,                // Espaço entre a imagem e a borda inferior da seção azul
  },
  // profileImage: Estilo para a imagem de perfil circular
  profileImage: {
    width: 200,                       // Largura da imagem
    height: 200,                      // Altura da imagem
    borderRadius: 100,                 // Metade da largura/altura para torná-la circular
    borderWidth: 1,                   // Borda branca ao redor da imagem
    borderColor: '#fff',              // Cor da borda
    position: 'absolute',             // Permite posicionamento fora do fluxo normal, para sobrepor o card
    bottom: -90,                      // Posiciona a imagem 50px acima da base da seção azul (metade da altura da imagem)
    backgroundColor: '#eee',          // Cor de fundo para placeholders visuais
  },
  // contentCard: Estilo para o card branco que contém as informações do usuário e opções
  contentCard: {
    flex: 1,                          // Ocupa o espaço restante verticalmente
    backgroundColor: '#fff',          // Fundo branco do card
    marginTop: 20,                    // Margem superior para posicionar o card abaixo da imagem de perfil
                                      // (50px para metade da imagem circular ficar no card)
    borderTopLeftRadius: 20,          // Borda superior esquerda arredondada
    borderTopRightRadius: 20,         // Borda superior direita arredondada
    padding: 20,                      // Espaçamento interno do card
    alignItems: 'center',             // Centraliza horizontalmente o conteúdo (nome, email, botões)
    bottom: -40,
    zIndex: -3,
    // Sombras (comentadas, mas podem ser adicionadas se o design do Figma as tiver)
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
    // elevation: 5,
  },
  // userName: Estilo para o nome do usuário
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,                    // Espaço após a imagem de perfil
    marginBottom: 5,                  // Espaço abaixo do nome
  },
  // userEmail: Estilo para o e-mail do usuário
  userEmail: {
    fontSize: 16,
    color: '#888',
    marginBottom: 30,                 // Espaço antes das opções de menu
  },
  // optionButton: Estilo para cada TouchableOpacity que representa um item de menu (ex: "Meus dados")
  optionButton: {
    flexDirection: 'row',             // Conteúdo (ícone, texto) e seta de navegação lado a lado
    justifyContent: 'space-between',  // Espaça o conteúdo principal e a seta para as extremidades
    alignItems: 'center',             // Alinha verticalmente os itens
    width: '100%',                    // Ocupa toda a largura do contêiner pai
    backgroundColor: '#fff',          // Fundo branco do botão
    paddingVertical: 15,              // Padding vertical interno
    paddingHorizontal: 15,            // Padding horizontal interno
    borderRadius: 10,                 // Cantos arredondados
    borderWidth: 1,                   // Borda sutil como no Figma
    borderColor: '#eee',              // Cor da borda
    marginBottom: 10,                 // Espaço entre os botões de opção
  },
  // optionContent: Estilo para o View que agrupa o ícone principal e o texto da opção
  optionContent: {
    flexDirection: 'row',             // Ícone e texto lado a lado
    alignItems: 'center',             // Alinha verticalmente
  },
  // optionButtonText: Estilo para o texto de cada opção de menu
  optionButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,                   // Espaço entre o ícone e o texto
  },
  // logoutButton: Estilo para o botão "Sair da conta"
  logoutButton: {
    width: '100%',                    // Ocupa toda a largura
    backgroundColor: '#E53935',       // Cor vermelha do tema (conforme Figma)
    paddingVertical: 15,              // Padding vertical interno
    borderRadius: 10,                 // Cantos arredondados
    marginTop: 30,                    // Margem superior para separar das opções de menu
    alignItems: 'center',             // Centraliza o texto horizontalmente
    justifyContent: 'center',         // Centraliza o texto verticalmente
    // Sombras para dar efeito de elevação ao botão
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  // logoutButtonText: Estilo para o texto do botão "Sair da conta"
  logoutButtonText: {
    fontSize: 18,
    color: '#fff',                    // Cor do texto branco
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
