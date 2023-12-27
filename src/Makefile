include .env

all: setup up

setup:
	mkdir -p ${SHARED_VOLUME_DEVICE}
	docker-compose build
	npm --prefix backend/nestjs/pong install

up:
	docker-compose up -d

down:
	docker-compose down

purge: down
	sudo rm -rf ${SHARED_VOLUME_DEVICE}
	sudo rm -rf backend/nestjs/pong/dist
	docker volume rm src_shared-volumes-postgres

clean:
	docker-compose down

fclean: down
	# docker system prune
