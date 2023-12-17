include .env

all: setup up

setup:
	mkdir -p ${SHARED_VOLUME_DEVICE}
	docker-compose build
	npm --prefix nestjs/pong install

up:
	docker-compose up -d

down:
	docker-compose down

clean:
	docker-compose down

fclean: down
	# docker system prune
