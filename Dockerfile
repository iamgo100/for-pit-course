# Version 0.1pre-alpha
FROM UBUNTU:19.04
LABEL Author="Galina Elkina"
RUN apt-get update
RUN apt-get install -y nginx
RUN echo 'Hello... It\'s me...' > /var/www/html/index.nginx-debian.html

EXPOSE 8080

