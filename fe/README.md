# 🍽️ FoodDiary

Um aplicativo móvel moderno para registro e acompanhamento de refeições, desenvolvido com React Native e Expo.

## 📱 Sobre o Projeto

O FoodDiary é uma aplicação mobile que permite aos usuários registrar suas refeições diárias de forma simples e intuitiva. Com uma interface moderna e funcionalidades avançadas, o app oferece uma experiência completa para o controle alimentar.

## ✨ Funcionalidades

- **🔐 Autenticação Segura**: Sistema de login e cadastro com validação
- **📝 Registro de Refeições**: Adicione suas refeições com detalhes completos
- **📊 Estatísticas Diárias**: Acompanhe seus dados nutricionais
- **📅 Histórico**: Visualize refeições anteriores organizadas por data
- **🎯 Metas Personalizadas**: Configure objetivos nutricionais
- **📱 Interface Moderna**: Design responsivo e intuitivo
- **🔍 Busca e Filtros**: Encontre refeições rapidamente
- **📸 Captura de Imagens**: Registre suas refeições com fotos

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para desenvolvimento React Native
- **TypeScript** - Linguagem de programação tipada
- **NativeWind** - Framework CSS para React Native
- **Tailwind CSS** - Framework de estilização

### Gerenciamento de Estado
- **React Query (TanStack Query)** - Gerenciamento de estado do servidor
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas

### Navegação e UI
- **Expo Router** - Sistema de roteamento
- **Lucide React Native** - Ícones
- **React Native Reanimated** - Animações
- **React Native Safe Area Context** - Área segura para diferentes dispositivos

### Armazenamento
- **AsyncStorage** - Armazenamento local
- **Expo File System** - Sistema de arquivos

### Mídia
- **Expo Camera** - Captura de imagens
- **Expo Audio** - Reprodução de áudio

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Expo CLI
- Android Studio (para desenvolvimento Android)
- Xcode (para desenvolvimento iOS - apenas macOS)

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/foodiary.git
   cd foodiary/fe
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   # Crie um arquivo .env na raiz do projeto
   cp .env.example .env
   ```

4. **Execute o projeto**
   ```bash
   # Inicie o servidor de desenvolvimento
   npm start
   # ou
   yarn start
   ```

5. **Teste em diferentes plataformas**
   ```bash
   # Para Android
   npm run android
   
   # Para iOS
   npm run ios
   
   # Para Web
   npm run web
   ```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Rotas da aplicação (Expo Router)
│   ├── (private)/         # Rotas autenticadas
│   └── (public)/          # Rotas públicas
├── components/             # Componentes reutilizáveis
├── contexts/              # Contextos React
├── hooks/                 # Hooks customizados
├── services/              # Serviços de API
├── styles/                # Estilos globais
└── utils/                 # Utilitários
```

## 🔧 Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm run android` - Executa no Android
- `npm run ios` - Executa no iOS
- `npm run web` - Executa na web

## 📱 Funcionalidades Principais

### Autenticação
- Login e cadastro de usuários
- Validação de formulários
- Persistência de sessão

### Registro de Refeições
- Adição de refeições com nome e descrição
- Categorização por tipo de refeição
- Captura de imagens
- Registro de alimentos consumidos

### Dashboard
- Visualização de refeições do dia
- Estatísticas nutricionais
- Histórico de refeições
- Metas e progresso

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Seu Nome** - *Desenvolvimento inicial* - [SeuGitHub](https://github.com/seu-usuario)

## 🙏 Agradecimentos

- Expo pela plataforma incrível
- React Native pela comunidade ativa
- Todos os contribuidores do projeto

---

**FoodDiary** - Transformando o controle alimentar em uma experiência simples e eficiente! 🍎 