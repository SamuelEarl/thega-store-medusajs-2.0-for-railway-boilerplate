.PHONY: dev-backend
dev-backend:
	@clear
	@echo "🚀 Starting Medusa backend development server...\n"
	cd backend && pnpm dev


.PHONY: dev-storefront
dev-storefront:
	@clear
	@echo "🚀 Starting Medusa storefront development server...\n"
	cd storefront && pnpm dev


# The trap 'kill 0' INT command sets up a signal handler for clean shutdown:

# - trap - Shell built-in that catches signals and runs commands
# - 'kill 0' - The command to execute when trapped. kill 0 sends a termination signal to all processes in the current process group (both the background backend and foreground storefront)
# - INT - The signal to catch (SIGINT), which is sent when you press Ctrl+C

# Without this trap:
# - Pressing Ctrl+C would only kill the foreground process (storefront)
# - The backend would keep running in the background, requiring manual cleanup

# With this trap:
# - Pressing Ctrl+C kills both the backend and storefront processes cleanly
# - No orphaned processes left behind

# So it ensures when you stop the dev servers with Ctrl+C, everything shuts down properly together.

# This script works, but I don't want to use it because I want to have separate terminal outputs for the backend and storefront.
# .PHONY: dev
# dev:
# 	@clear
# 	@echo "🚀 Starting Medusa development servers...\n"
# 	@trap 'kill 0' INT; \
# 	$(MAKE) dev-backend & \
# 	$(MAKE) dev-storefront
	

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
