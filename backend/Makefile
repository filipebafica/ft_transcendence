include .env

all: setup up

setup:
	sudo mkdir -p ${SHARED_VOLUME_DEVICE}
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

clean:
	docker-compose down

fclean: down
	# docker system prune
