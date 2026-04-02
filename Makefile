.PHONY: help serve fmt lint check
# Default target: show help
help:
	@echo "Available commands:"
	@echo "  make serve    - Run the Deno server to host the website locally"
	@echo "  make fmt      - Format source files using Deno"
	@echo "  make lint     - Lint source files using Deno"
	@echo "  make check    - Run both format check and lint"
# Run the local Deno server
serve:
	deno run --allow-net --allow-read serve.ts
# Format all files
fmt:
	deno fmt web/ serve.ts
# Lint all files
lint:
	deno lint web/ serve.ts
# Run format check and lint
check:
	deno fmt --check web/ serve.ts
	deno lint web/ serve.ts
