FROM centos:7
RUN curl --silent --location https://rpm.nodesource.com/setup_12.x | bash -
RUN yum install -y nodejs
WORKDIR /app
COPY . /app
ENV LANG C.UTF-8
EXPOSE 3001
ENTRYPOINT npm run start:k8s