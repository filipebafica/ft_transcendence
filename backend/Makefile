all: setup up

setup:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

clean:
	docker-compose down --rmi all

fclean: down
	docker system prune
