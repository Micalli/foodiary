# 🍽️ Foodiary 

# API

Uma API serverless para gerenciamento de diário alimentar, construída com AWS Lambda, Serverless Framework e TypeScript.

## 📋 Descrição

O Foodiary API é uma aplicação serverless que permite aos usuários registrar e gerenciar suas refeições diárias. A aplicação utiliza inteligência artificial para analisar imagens de alimentos e extrair informações nutricionais automaticamente.

## 🚀 Funcionalidades

- **Autenticação**: Sistema de registro e login de usuários
- **Gerenciamento de Refeições**: Criar, listar e visualizar refeições
- **Upload de Imagens**: Upload de fotos de alimentos para análise
- **Análise com IA**: Processamento automático de imagens usando OpenAI
- **Processamento Assíncrono**: Sistema de filas para processamento de refeições

## 🛠️ Tecnologias

- **Runtime**: Node.js 22.x
- **Framework**: Serverless Framework
- **Cloud Provider**: AWS
- **Banco de Dados**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **Autenticação**: JWT
- **Processamento de Imagens**: FFmpeg
- **IA**: OpenAI API
- **Armazenamento**: AWS S3
- **Filas**: AWS SQS
- **Linguagem**: TypeScript

## 📁 Estrutura do Projeto

```
foodiary-api/
├── src/
│   ├── functions/          # Funções Lambda
│   ├── controllers/        # Controladores
│   ├── services/          # Serviços de negócio
│   ├── db/               # Configuração do banco de dados
│   ├── types/            # Tipos TypeScript
│   ├── utils/            # Utilitários
│   ├── libs/             # Bibliotecas
│   ├── clients/          # Clientes externos
│   └── queues/           # Processamento de filas
├── drizzle/              # Migrações do banco
├── serverless.yml        # Configuração Serverless
├── drizzle.config.ts     # Configuração Drizzle
└── package.json
```

## 🔧 Pré-requisitos

- Node.js 22.x ou superior
- AWS CLI configurado
- Conta no AWS
- Conta no Neon (PostgreSQL)
- Chave da API OpenAI

## ⚙️ Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd foodiary-api
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   Crie um arquivo `.env` na raiz do projeto:
   ```env
   DATABASE_URL=sua_url_do_neon
   JWT_SECRET=seu_jwt_secret
   OPENAI_API_KEY=sua_chave_openai
   ```

4. **Execute as migrações do banco**
   ```bash
   npx drizzle-kit push
   ```

## 🚀 Executando o Projeto

### Desenvolvimento Local
```bash
npm run dev
```

### Deploy para Produção
```bash
serverless deploy
```

## 📚 Endpoints da API

### Autenticação
- `POST /signup` - Registrar novo usuário
- `POST /signin` - Fazer login
- `GET /me` - Obter dados do usuário logado

### Refeições
- `POST /meals` - Criar nova refeição
- `GET /meals` - Listar refeições do usuário
- `GET /meals/{mealId}` - Obter refeição específica

## 🔄 Fluxo de Processamento

1. **Upload de Imagem**: Usuário faz upload de foto da refeição
2. **Trigger S3**: Evento S3 dispara processamento
3. **Análise com IA**: OpenAI analisa a imagem
4. **Fila SQS**: Dados enviados para processamento assíncrono
5. **Atualização**: Refeição atualizada com informações nutricionais

## 🏗️ Arquitetura

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Cliente   │──▶│   API GW     │──▶│   Lambda    │
└─────────────┘    └─────────────┘    └─────────────┘
                           │                   │
                           ▼                   ▼
                    ┌─────────────┐    ┌─────────────┐
                    │     S3      │    │  PostgreSQL │
                    └─────────────┘    └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │     SQS     │
                    └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   OpenAI    │
                    └─────────────┘
```

## 🔐 Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `DATABASE_URL` | URL de conexão com PostgreSQL | Sim |
| `JWT_SECRET` | Chave secreta para JWT | Sim |
| `OPENAI_API_KEY` | Chave da API OpenAI | Sim |
| `BUCKET_NAME` | Nome do bucket S3 | Não (gerado automaticamente) |
| `MEALS_QUEUE_URL` | URL da fila SQS | Não (gerado automaticamente) |

## 🧪 Testes

```bash
npm test
```

## 📦 Deploy

O projeto está configurado para deploy automático na AWS usando Serverless Framework.

### Comandos de Deploy

```bash
# Deploy completo
serverless deploy

# Deploy apenas de uma função específica
serverless deploy function --function nomeDaFuncao

# Remover stack
serverless remove
```


# FRONT

**React Native** - Framework para desenvolvimento mobile
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

3. **Execute o projeto**
   ```bash
   # Inicie o servidor de desenvolvimento
   npm start
   # ou
   yarn start
   ```

4. **Teste em diferentes plataformas**
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

## 👥 Autores

- **Micalli** - *Desenvolvimento inicial*

## 🙏 Agradecimentos

- Serverless Framework
- AWS Lambda
- Drizzle ORM
- OpenAI API
- Neon Database

---

**Nota**: Este projeto é parte do JStack Lab e foi desenvolvido para fins educacionais e de demonstração. 
