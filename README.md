[![Build Status](https://travis-ci.org/camlegleiter/hangman.svg?branch=master)](https://travis-ci.org/camlegleiter/hangman)
[![Coverage Status](https://coveralls.io/repos/github/camlegleiter/hangman/badge.svg?branch=master)](https://coveralls.io/github/camlegleiter/hangman?branch=master)

## Hangman Game

Forked https://github.com/camlegleiter/hangman

## Documentation overview
This documentation will show how to setup this hangman Game in an AWS Hosting environment in a single Node configuration and in a Docker Swarm Clusters configuration. 
The overall goal is to create an environment where a developer can push their changes to this repository, which will then automatically trigger a jenkins job, which will update the changes on the hosting server. 
For both setups, we will use the same Github repository and jenkins server

## Setup github webhook to trigger jenkins on push
- In github, in your repository, click settings -> webhooks
- Enter a payload url ( for example: https://elasticIp/github-webhook/)
- Disable ssl verification
- Click update webhook


## Since both configuration will use the same jenkins01 node: Please follow these steps to configure
- Create an ec2 instance in AWS: aws provide some simple instruction on how to do create an ec2 instance here: http://docs.aws.amazon.com/efs/latest/ug/gs-step-one-create-ec2-resources.html.
- In the security group open port 443 for everywhere.
- Also open port 22 to my IP address in order to ssh to this server for configuration:
- Create a second security group for internal access only between jenkin01 and other nodes.
- SSH to the server and install and setup jenkins by following this guide: https://www.digitalocean.com/community/tutorials/how-to-install-jenkins-on-ubuntu-16-04
- Edit /etc/hosts and add entries for the different nodes in each environment IP address
### Once jenkins has been installed, create jenkins job that will trigger the changes as part of the deployment process for single node configuration
- In jenkins create a freestyle project (hangman-single-node)
- Under Source Code Management add this repository and github credentials
- specific a branch to use: branch name: singleNode*/
- Under build trigger select: GitHub hook trigger for GITScm polling
- under build select add build steps, and select execute shell
- Call this small bash script which currently exist on the singlenode01
```bash
# Check if we can ping the node otherwise exit
ping -q -c1 singlenode01 > /dev/null
if [ $? -eq 0 ]
then
	ssh singlenode01 /bin/bash /workload/reload.sh
else
  exit 1
fi
```
### Create jenkins job that will trigger the changes as part of the deployment process for swarm cluster
- In jenkins create a freestyle project (hangman-swarm-cluster)
- Under Source Code Management add this repository and github credentials
- specific a branch to use: branch name: clusterNode*/
- Under build trigger select: GitHub hook trigger for GITScm polling
- under build select add build steps, and select execute shell
- Add this script which will reload the jenkins image, and docker container in the cluster
```bash
# Check if we can ping the node otherwise exit
ping -q -c1 manager0 > /dev/null 
if [ $? -eq 0 ]
then
	ssh manager0 /bin/bash /workload/reload.sh
else
  ping -q -c1 manager1 > /dev/null
  if [ $? -eq 0 ]
  then
    ssh manager0 /bin/bash /workload/reload.sh
  else
    exit 1
fi
```

## Create self-signed certificate by following this guide: https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-in-ubuntu-16-04

## Install and configure nginx to access jenkins on port 443
```bash
# apt-get install nginx
# rm -rf /etc/nginx/sites-available/default
# rm -rf /etc/nginx/sites-enabled/default
# vi /etc/nginx/sites-enabled/jenkins.conf
server {
    listen 443 ssl http2;
    server_name your-domain-name.com;
    include snippets/self-signed.conf;
    include snippets/ssl-params.conf;
    location / {
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   Host      $http_host;
        proxy_pass         http://127.0.0.1:8081;
    }
}
```

### Single Node configuration & installation
### Requirements
- AWS Account
- An Ec2 Instance with public facing IP address (using Elastic IP) for the application

### Installation steps
- Create an ec2 instance in AWS: aws provide some simple instruction on how to do create an ec2 instance here: http://docs.aws.amazon.com/efs/latest/ug/gs-step-one-create-ec2-resources.html
- In the security group created during the ec2 instance creation, open these ports:
  TCP port 80 -> provide specific ports
  TCP port 22 -> for ssh access only open port to your own network (your own laptop)

- Once access has been granted connect to the EC2 instance from a terminal and install these services:
nginx
git
commands:
```bash
# ssh -i "francloud.pem" ubuntu@elasticIP
# sudo su 
# apt-get update
# apt-get install -y git nginx
```

- Install and configure nginx to access the hangman application on port 80
```bash
# apt-get install nginx
# rm -rf /etc/nginx/sites-available/default
# rm -rf /etc/nginx/sites-enabled/default
# vi /etc/nginx/sites-enabled/hangman.conf
server {
    listen 80;
    server_name your-domain-name.com;
    location / {
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   Host      $http_host;
        proxy_pass         http://127.0.0.1:3000;
    }
}
```

- Clone repository & start application (and verify that the application has started on port 3000)
```bash
# mkdir /workload && cd /workload
# git clone https://github.com/franchev/hangman.git
# cd hangman
# yarn
# yarn start &
# netstat -tupln | grep 3000
```
- Create small script that will reload the application (this will be used by jenkins)
```bash
# cd /workload
# vi reload.sh
#!/bin/bash
HANGMANDIR="$JENKINS_HOME/hangman"
if [ ! -d "$HANGMANDIR" ]; then
  git -C $HANGMANTOPDIR clone git@github.com:franchev/hangman.git
else
  cd $HANGMANDIR
  git pull git@github.com:franchev/hangman.git 
fi

# let's kill the existing process
sudo kill $(sudo lsof -t -i:3000)

# let's start a new process
cd $HANGMANDIR
yarn
yarn start
```

- Test by making a small change in the application and load the public facing IP to see if this works. 

## Docker Swarm cluster configuration & installation
### Requirements
- AWS Account
- Multiple ec2 instances ( manager0, manager1, node0, node1, consul0)
- a Load balancer between node0 & node1 ec2 instances

### Installation steps
- Follow this guide to setup the docker swarm cluster: http://docs.master.dockerproject.org/swarm/install-manual/
- install and configure nginx on both node0 and node1
- Install and configure nginx to access the hangman application on port 80
```bash
# apt-get install nginx
# rm -rf /etc/nginx/sites-available/default
# rm -rf /etc/nginx/sites-enabled/default
# vi /etc/nginx/sites-enabled/hangman.conf
server {
    listen 80;
    server_name your-domain-name.com;
    location / {
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   Host      $http_host;
        proxy_pass         http://127.0.0.1:3000;
    }
}
```
- on the manager nodes add small script that jenkins will call the reload the container
- mkdir /workload && cd /workload
- vi reload.sh
```bash
#!/bin/bash

HANGMANTOPDIR="$JENKINS_HOME"
HANGMANDIR="$HANGMANTOPDIR/hangman"
DOCKERFILE="$HANGMANTOPDIR/Dockerfile"
SERVICE="docker"

if [ ! -d "$HANGMANDIR" ]; then
  git -C $HANGMANTOPDIR clone git@github.com:franchev/hangman.git
else
  cd $HANGMANDIR
  git pull git@github.com:franchev/hangman.git 
fi

if [ ! -f "$DOCKERFILE" ]; then
cat <<EOF > $DOCKERFILE
FROM node:6.11.0
MAINTAINER frany

RUN mkdir -p /code
WORKDIR /code
ADD hangman /code
RUN npm install -g -s --no-progress yarn && \
    yarn && \
    yarn cache clean
CMD [ "npm", "start" ]
EXPOSE 3000

EOF
fi

# making sure that docker service is running
if (( $(ps -ef | grep -v grep | grep $SERVICE | wc -l) > 0 ))
then
echo "$SERVICE is running, proceeding!!!"
else
service $SERVICE start
fi

# rebuild image
sudo docker -H :4000 build -t hangman_image:latest --pull=true --file=$DOCKERFILE $JENKINS_HOME

# let's remove the old container and use the new image
sudo docker -H :4000 stop hangman && sudo docker -H :4000 rm hangman
docker -H :4000 run -d -p 3000:3000 -e reschedule:on-node-failure --name=hangman hangman /bin/sh -c 'yarn && yarn start'
```
