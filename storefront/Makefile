.PHONY: dev
dev:
	@clear
	@echo "🚀 Starting Medusa storefront development server...\n"
	pnpm dev

.PHONY: kill
kill:
	-kill -9 $(lsof -t -i:8000) || true

# Kill process on port
# fuser -k 8000/tcp 

.PHONY: build
build:
	@clear
	@echo "🚀 Starting Medusa build...\n"
	@pnpm build
