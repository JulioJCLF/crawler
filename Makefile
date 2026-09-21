# Atalhos do projeto. Rode `make` para ver a lista.
.PHONY: help docs portal-dev portal-build test typecheck crawler frontend-dev

help:
	@echo "make docs          - regenera os painéis da documentação"
	@echo "make test          - testes do backend (Vitest)"
	@echo "make typecheck     - checagem de tipos de backend e frontend"
	@echo "make crawler       - roda o crawler uma vez, localmente"
	@echo "make frontend-dev  - sobe a vitrine em modo de desenvolvimento"
	@echo "make portal-dev    - sobe o portal da documentação localmente"
	@echo "make portal-build  - compila o portal da documentação"

docs:
	python3 scripts/gerar-paineis.py

test:
	cd backend && npm test

typecheck:
	cd backend && npx tsc --noEmit && cd ../frontend && npx tsc --noEmit

crawler:
	cd backend && npm start

frontend-dev:
	cd frontend && npm run dev

portal-dev: docs
	cd portal && npx quartz build --serve -d ../docs

portal-build: docs
	cd portal && npx quartz build -d ../docs
