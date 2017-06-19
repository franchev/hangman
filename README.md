[![Build Status](https://travis-ci.org/camlegleiter/hangman.svg?branch=master)](https://travis-ci.org/camlegleiter/hangman)
[![Coverage Status](https://coveralls.io/repos/github/camlegleiter/hangman/badge.svg?branch=master)](https://coveralls.io/github/camlegleiter/hangman?branch=master)
## singleNode Branch

## Hangman Game

Forked https://github.com/camlegleiter/hangman

## Documentation overview
This documentation will show how to setup this hangman Game in an AWS Hosting environment in a single Node configuration. 
The overall goal is to create an environment where a developer can push their changes to this repository, which will then automatically trigger a jenkins job, which will update the changes on the hosting server. 

## Setup github webhook to trigger jenkins on push
- In github, in your repository, click settings -> webhooks
- Enter a payload url ( for example: https://elasticIp/github-webhook/)
- Disable ssl verification
- Click update webhook


## Configuring jenkins01 node: Please follow these steps to configure
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

### Create self-signed certificate by following this guide: https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-in-ubuntu-16-04

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
#!/bin/bash
#!/bin/bash
WORKLOADDIR="/workload"
HANGMANDIR="$WORKLOADDIR/hangman"

if [ ! -d "$WORKLOADDIR" ]; then
  echo "making $WORKLOADDIR"
  mkdir -p $WORKLOADDIR && cd $WORKLOADDIR
fi

if [ ! -d "$HANGMANDIR" ]; then
  echo "I am cloning hangman"
  git -C $WORKLOADDIR clone git@github.com:franchev/hangman.git -b singleNode
else
  echo "pulling hangman repository"
  cd $HANGMANDIR
  git pull git@github.com:franchev/hangman.git
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
  # let's kill the existing process
  sudo kill $(sudo lsof -t -i:3000)
fi

# let's start a new process
cd $HANGMANDIR
echo "starting app"
yarn
sudo npm install sqlite3 --save
yarn start > /dev/null 2>&1 &
```

- Test by making a small change in the application and load the public facing IP to see if this works. 
