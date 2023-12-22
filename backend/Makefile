include .env

all: setup up

setup:
	sudo mkdir -p ${SHARED_VOLUME_DEVICE}
	docker-compose build
	npm --prefix nestjs/pong install

up:
	docker-compose up -d

down:
	docker-compose down

purge:
	sudo rm -rf /home/adrianooliveira/workspace/studies/42sp/ft_transcendence/backend/nestjs/pong/storage
	sudo rm -rf /home/adrianooliveira/workspace/studies/42sp/ft_transcendence/backend/nestjs/pong/dist
	docker volume rm backend_shared-volumes-postgres

clean:
	docker-compose down

fclean: down
	# docker system prune
