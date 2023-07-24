run dev: 
	@echo "Starting development server..."
	yarn "start:dev:client" & yarn "start:dev:server"

run prod:
	@echo "Starting prod..."
	cp ./env.backend.sample ./workspace/backend/.env
	cp ./env.frontend.sample ./workspace/frontend/.env
	docker compose up -d --remove-orphans

run prod-down:
	@echo "Stoping prod server..."
	docker compose down 

createdb: 
	docker exec -it yamb-db createdb --username=postgres --owner=postgres yamb

