## Docker

#### Build image

`$ docker build -t <image_name>:<tag_name> <context>`

eg:

`$ docker build -t ubuntu-node:0.1 .`

#### Run container

`$ docker run -d -p 8000:8000 ubuntu-node:0.1 `

#### Misc

See running container

`$ docker ps`

Check logs

`$ docker logs <container_id>`

Stop container

`$ docker stop <container_id>`