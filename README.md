[![Build Status](https://travis-ci.org/camlegleiter/hangman.svg?branch=master)](https://travis-ci.org/camlegleiter/hangman)
[![Coverage Status](https://coveralls.io/repos/github/camlegleiter/hangman/badge.svg?branch=master)](https://coveralls.io/github/camlegleiter/hangman?branch=master)

## Hangman Game

Forked https://github.com/camlegleiter/hangman

## Documentation overview
This documentation will show how to setup this hangman Game in an AWS Hosting environment in a single Node configuration and in a Docker Swarm Clusters configuration. 
The overall goal is to create an environment where a developer can push their changes to this repository, which will then automatically trigger a jenkins job, which will update the changes on the hosting server. 

### Single Node configuration & installation
#### Requirements
- AWS Account
- An Ec2 Instance with public facing IP address (using Elastic IP)

#### Installation steps
- Create an ec2 instance in AWS, aws provide some simple instruction on how to do create an ec2 instance here: http://docs.aws.amazon.com/efs/latest/ug/gs-step-one-create-ec2-resources.html
- In the security group created during the ec2 instance creation, open these ports:
  TCP port 80 -> provide specific ports
  TCP port 22 -> for ssh access only open port to your own network (your own laptop)
  TCP port 443 -> for jenkins access
  
- Once access has been granted connect to the EC2 instance from a terminal and install these services:
Jenkins
nginx
git
commands:
```bash
# ssh -i "francloud.pem" ubuntu@elasticIP
# sudo su 
# apt-get update
# apt-get install -y git jenkins nginx
bash```

- Install and setup jenkins by following this guide: https://www.digitalocean.com/community/tutorials/how-to-install-jenkins-on-ubuntu-16-04
- Once jenkins has been installed, create jenkins job that will trigger the changes as part of the deployment process
-- In jenkins create a freestyle project
-- Under Source Code Management add this repository and github credentials
-- specific a branch to use: branch name: singleNode*/
-- Under build trigger select: GitHub hook trigger for GITScm polling
-- under build select add build steps, and select execute shell
-- add this small bash script:
```bash
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
bash```

- Create self-signed certificate by following this guide: https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-in-ubuntu-16-04

- Install and configure nginx to access jenkins on port 443 and to access the hangman application on port 80
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
bash```

- Clone repository & start application (and verify that the application has started on port 3000)
```bash
# mkdir /workspace && cd /workspace
# git clone https://github.com/franchev/hangman.git
# cd hangman
# yarn
# yarn start &
# netstat -tupln | grep 3000
bash```

- Setup github webhook to trigger jenkins on push
-- In github, in your repository, click settings -> webhooks
-- Enter a payload url ( for example: https://elasticIp/github-webhook/)
-- Disable ssl verification
-- Click update webhook

- Test by making a small change in the application and load the public facing IP to see if this works. 
