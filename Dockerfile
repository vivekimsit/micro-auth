FROM ubuntu:latest
MAINTAINER Vivek Poddar<vivekimsit@gmail.com>
LABEL Description="Auth microservice Node.JS Container"

RUN apt-get update \
    && apt-get install -y build-essential \
    && apt-get install -y curl \
    && apt-get install -y sudo \
    && curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash - \
    && apt-get install -y nodejs \
    && mkdir -p /opt/micro-auth

COPY ./package.json /opt/micro-auth
RUN cd /opt/micro-auth && npm install
COPY . /opt/micro-auth

WORKDIR /opt/micro-auth
EXPOSE 3000
CMD ["npm", "run", "start:dev"]