# 📋 Gerenciador Global de Estado com Zustand

Um aplicativo de gerenciamento de tarefas desenvolvido em **React Native** com **Expo** e **TypeScript**. Este projeto demonstra a substituição do gerenciamento de estado local tradicional por uma arquitetura de estado global simplificada e de alto desempenho usando **Zustand**, persistida localmente com **AsyncStorage**, e estruturada com rotas dinâmicas do **Expo Router**.

---

## 🎯 Principais Objetivos do Projeto

- **Estado Global Descentralizado:** Migração de lógica local e remoção de *prop drilling* com stores reativas do Zustand.
- **Otimização de Renderização:** Componentes otimizados que extraem apenas as propriedades necessárias da store, eliminando renderizações redundantes.
- **Persistência de Dados Inteligente:** Uso do middleware nativo do Zustand com AsyncStorage para salvar as informações no celular automaticamente.
- **Estruturação de Rotas Avançada:** Divisão do aplicativo em navegação por abas (Tabs) e fluxo de tela detalhada em pilha (Stack).

---

## 🛠️ Stack Tecnológica

- **Core:** React Native (Expo SDK 54) & TypeScript
- **Estado Global:** Zustand 5+
- **Persistência:** `@react-native-async-storage/async-storage`
- **Roteamento:** Expo Router (Stack & Tabs)
- **Ícones:** `@expo/vector-icons` (Feather)

---

## 📂 Organização do Código

```text
├── app/                      # Rotas e Páginas do Expo Router
│   ├── (tabs)/               # Grupo de Navegação em Abas
│   │   ├── _layout.tsx       # Estilização e abas inferiores
│   │   ├── index.tsx         # Listagem principal de tarefas
│   │   └── settings.tsx      # Aba de estatísticas e limpeza de dados
│   ├── task/                 # Detalhes da tarefa
│   │   └── [id].tsx          # Rota em pilha dinâmica
│   └── _layout.tsx           # Layout raiz com Stack principal
│
└── src/                      # Código Fonte Reutilizável
    ├── components/           # Componentes Modulares
    │   ├── AboutScreen.tsx   # Modal de informações
    │   ├── TaskInputModal.tsx# Form de inserção/edição integrado à store
    │   ├── TaskItem.tsx      # Componente de cartão com ações
    │   └── TaskList.tsx      # Renderização otimizada em Seções
    │
    ├── store/                # Gerenciamento de Estado
    │   └── useTaskStore.ts   # Store principal Zustand com persistência
    │
    └── styles/               # Padrões Visuais
        └── global.ts         # Tokens de estilo de apoio
```

---

## 🚀 Como Executar o Projeto

### 1. Clonar e Instalar as Dependências

Navegue até a pasta do aplicativo e instale as dependências:

```bash
cd tasks-app-expo
npm install
```

### 2. Rodar o Servidor de Desenvolvimento

Inicie o Expo:

```bash
npx expo start
```

### 3. Visualizar o Aplicativo

- **Dispositivo Físico:** Escaneie o código QR gerado com o aplicativo **Expo Go** (Android) ou a câmera padrão (iOS).
- **Emulador:** Pressione `a` para abrir no emulador Android ou `i` para o emulador iOS.

---

## 📈 Recursos e Estatísticas Visualizadas

- **Painel Analítico:** Acompanhe a quantidade total de tarefas criadas, concluídas, pendentes e prioritárias na aba de ajustes.
- **Gráfico de Progresso:** Taxa de conclusão geral das tarefas representadas em barras dinâmicas.
- **Foco em Alta Prioridade:** Monitoramento percentual específico voltado para tarefas críticas.
- **Categorização & Prazos:** Identificação de tarefas por categoria (Trabalho, Pessoal, Estudos, Compras) e sinalização em tempo real de prazos expirados.
