SHELL := /bin/bash
.DEFAULT_GOAL := help

# Colors
RED    := \033[0;31m
GREEN  := \033[0;32m
YELLOW := \033[1;33m
BLUE   := \033[0;34m
CYAN   := \033[0;36m
RESET  := \033[0m

.PHONY: help up up-prod down fresh deploy send shell lint

help:
	@echo ""
	@echo "$(CYAN)Figurinhas Educarte$(RESET) — Makefile"
	@echo ""
	@echo "  $(GREEN)make up$(RESET)        Sobe o ambiente de desenvolvimento (hot reload)"
	@echo "  $(GREEN)make up-prod$(RESET)   Build e sobe o ambiente de produção"
	@echo "  $(GREEN)make down$(RESET)      Para todos os containers"
	@echo "  $(GREEN)make fresh$(RESET)     Limpa o build e reinstala dependências"
	@echo "  $(GREEN)make deploy$(RESET)    Faz pull e redeploy em produção"
	@echo "  $(GREEN)make send$(RESET)      Lint + commit + push + PR"
	@echo "  $(GREEN)make shell$(RESET)     Entra no shell do container"
	@echo "  $(GREEN)make lint$(RESET)      Executa o linter"
	@echo ""

## Desenvolvimento
up:
	@echo "$(BLUE)Subindo ambiente de desenvolvimento...$(RESET)"
	docker compose down --remove-orphans
	docker compose up -d
	@echo "$(GREEN)App rodando em http://localhost:5173$(RESET)"

## Produção
up-prod:
	@echo "$(BLUE)Fazendo build de produção...$(RESET)"
	docker compose --profile build -f docker-compose.prod.yml run --rm node
	@echo "$(BLUE)Subindo nginx em produção...$(RESET)"
	docker compose -f docker-compose.prod.yml up -d nginx
	@echo "$(GREEN)App em produção rodando na porta 80$(RESET)"

## Para containers
down:
	@echo "$(YELLOW)Parando containers...$(RESET)"
	docker compose down --remove-orphans

## Limpa e reinstala
fresh:
	@echo "$(YELLOW)Limpando build e node_modules...$(RESET)"
	docker compose down --remove-orphans
	rm -rf dist node_modules
	docker compose build --no-cache
	docker compose up -d
	@echo "$(GREEN)Ambiente recriado com sucesso$(RESET)"

## Deploy em produção
deploy:
	@echo "$(BLUE)Iniciando deploy...$(RESET)"
	git stash
	git pull origin main
	$(MAKE) up-prod
	@echo "$(GREEN)Deploy concluído!$(RESET)"

## Commit + push + PR
send:
	@$(MAKE) lint || (echo "$(RED)Lint falhou. Corrija os erros antes de enviar.$(RESET)" && exit 1)
	@read -p "Mensagem do commit: " MSG; \
	if [ -z "$$MSG" ]; then echo "$(RED)Mensagem não pode ser vazia.$(RESET)"; exit 1; fi; \
	BRANCH="auto/$$(date +%Y%m%d-%H%M%S)"; \
	git checkout -b $$BRANCH; \
	git add -A; \
	git diff --cached --quiet && echo "$(YELLOW)Nada para commitar.$(RESET)" && exit 0; \
	git commit -m "$$MSG"; \
	git push origin $$BRANCH; \
	gh pr create --title "$$MSG" --body "Deploy automático via make send" --base main; \
	gh pr merge --merge --delete-branch; \
	git checkout main; \
	git pull origin main; \
	git branch -d $$BRANCH 2>/dev/null || true; \
	echo "$(GREEN)Enviado com sucesso!$(RESET)"

## Shell do container
shell:
	docker compose exec app sh

## Linter
lint:
	@echo "$(BLUE)Executando lint...$(RESET)"
	docker compose exec app npm run lint || npm run lint

## Aliases não aplicáveis neste projeto (frontend-only)
migrate:
	@echo "$(YELLOW)migrate não se aplica — este é um projeto frontend-only.$(RESET)"

seed:
	@echo "$(YELLOW)seed não se aplica — dados são hardcoded no frontend.$(RESET)"

db:
	@echo "$(YELLOW)db não se aplica — não há banco de dados neste projeto.$(RESET)"

thinker:
	@echo "$(YELLOW)thinker não se aplica — não há Laravel neste projeto.$(RESET)"
