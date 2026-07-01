APP_NAME      := education-api
DB_CONTAINER  := education-db
DB_USER       := stella
DB_PASSWORD   := stella-dev
DB_NAME       := education
DB_PORT       := 5546

BIN           := ./tmp/main
ENTRY         := ./cmd/api/main.go

.PHONY: build dev lint test db/start db/stop migrate/up migrate/down migrate/status seed clean help

build:
	go build -o $(BIN) $(ENTRY)

dev:
	air

lint:
	go vet ./...

format:
	gofmt -w ./...

test:
	go test -v ./...

db/start:
	@docker rm -f $(DB_CONTAINER) 2>/dev/null || true
	@docker run -d --name $(DB_CONTAINER) \
		-e POSTGRES_USER=$(DB_USER) \
		-e POSTGRES_PASSWORD=$(DB_PASSWORD) \
		-e POSTGRES_DB=$(DB_NAME) \
		-p $(DB_PORT):5432 \
		pgvector/pgvector:pg18
	@echo "$(DB_CONTAINER) started on port $(DB_PORT)"

db/stop:
	@docker rm -f $(DB_CONTAINER)
	@echo "$(DB_CONTAINER) removed"

migrate/up:
	go run ./cmd/migrate up

migrate/down:
	go run ./cmd/migrate down

migrate/status:
	go run ./cmd/migrate status

seed:
	go run ./cmd/seed

clean:
	@rm -rf tmp/ *.log
	@echo "cleaned"

help:
	@echo ""
	@echo "Usage: make <target>"
	@echo ""
	@echo "  build           Compile binary to $(BIN)"
	@echo "  dev             Run dev server with hot reload (air)"
	@echo "  lint            Run go vet"
	@echo "  format          Run gofmt"
	@echo "  test            Run go test"
	@echo "  db/start        Start postgres container on port $(DB_PORT)"
	@echo "  db/stop         Stop and remove postgres container"
	@echo "  migrate/up      Apply all pending migrations"
	@echo "  migrate/down    Roll back the last migration"
	@echo "  migrate/status  Show migration status"
	@echo "  seed            Populate base data"
	@echo "  clean           Remove build/cache artifacts"
	@echo ""
