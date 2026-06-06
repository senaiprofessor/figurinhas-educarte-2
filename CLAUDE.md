# Figurinhas Educarte — CLAUDE.md

## Regras de Trabalho

- **NUNCA faça commits automáticos.** Sempre peça confirmação antes de commitar.
- Use **português correto com acentuação** em todos os textos de interface, comentários e mensagens.
- Não adicione dependências sem justificativa clara. Este projeto é intencionalmente leve.

## Stack

- **Frontend:** React 19 + TypeScript 5 + Vite + Tailwind CSS v4
- **Roteamento:** React Router v7
- **Persistência:** localStorage (chave: `figurinhas_app_data`)
- **Autenticação:** Hardcoded (sem backend)
- **Infraestrutura:** Docker + Nginx

## Estrutura de Pastas

```
src/
  types/        # Interfaces TypeScript globais
  data/         # Dados estáticos (figurinhas, raridades)
  utils/        # Funções puras (sorteio)
  services/     # Lógica de negócio (auth, storage)
  contexts/     # React Contexts (AuthContext)
  components/   # Componentes reutilizáveis
  pages/        # Páginas da SPA
```

## Comandos Make

```bash
make up         # Dev com hot reload
make up-prod    # Build + nginx produção
make down       # Para containers
make fresh      # Limpa e recria
make deploy     # Pull + redeploy
make send       # Lint + commit + push + PR
make shell      # Shell do container
make lint       # Executa ESLint
```

## Paleta de Cores

| Papel             | Hex       |
|-------------------|-----------|
| Azul escuro       | `#1E3A8A` |
| Azul médio        | `#3B82F6` |
| Laranja vibrante  | `#F97316` |
| Laranja escuro    | `#EA580C` |
| Branco            | `#FFFFFF` |

## Raridades

| Tier      | Cor       | Probabilidade |
|-----------|-----------|---------------|
| Comum     | `#60A5FA` | 60%           |
| Rara      | `#A855F7` | 25%           |
| Lendária  | `#F59E0B` | 10%           |
| Secreta   | `#DC2626` | 5%            |

## Usuários de Teste

| Login     | Senha    | Perfil  |
|-----------|----------|---------|
| usuario1  | 123456   | usuario |
| usuario2  | 123456   | usuario |
| admin     | 123456   | admin   |

## Convenções de Código

- Apenas componentes funcionais com hooks
- Props tipadas com interfaces TypeScript
- Nenhuma chamada fetch direta dentro de componentes
- Lógica de negócio isolada em `/services`
- Sem comentários óbvios — apenas quando o motivo não é evidente

## UI

- Glassmorphism: `rgba(255,255,255,0.07)` + `rgba(255,255,255,0.15)` border + `border-radius: 16px`
- Botões de ação: gradiente laranja `#F97316 → #EA580C` com glow no hover
- Fonte de títulos: **Sora** | Fonte de corpo: **Inter**
- Animações de entrada: `opacity 0→1` + `translateY` em ≤ 400ms
- Modais: fecham ao clicar fora ou pressionar ESC

## Tratamento de Erros

- Erros de autenticação: mensagem clara em português ("Usuário ou senha inválidos")
- Erros de localStorage: capturados silenciosamente com fallback para objeto vazio
- Nunca exibir "Error 500" ou mensagens técnicas ao usuário
