#!/bin/sh
apt-get update
apt-get install -y wget git
git clone https://github.com/NextDom/nextdom-mobile
wget -q https://deb.nodesource.com/setup_10.x -O /tmp/node_install.sh
bash /tmp/node_install.sh
apt install -y nodejs
npm install
npm run build
