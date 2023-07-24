run dev:
	@echo "Starting development server..."
	docker compose up -d --remove-orphans

run dev-down:
	@echo "Stoping development server..."
	docker compose down 

createdb: 
	docker exec -it yamb-db createdb --username=postgres --owner=postgres yamb

