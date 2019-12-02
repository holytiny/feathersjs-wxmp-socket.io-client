#!/usr/bin/env bash

SITE=holytiny.com

echo 'Install or update nginx...'
apt-get update
apt-get install -y nginx

echo 'config nginx...'
cp -f ./support/${SITE} /etc/nginx/sites-available/

echo 'clean current enbalbed sites...'
rm /etc/nginx/sites-enabled/*

echo 'enable holytiny.com...'
ln -s /etc/nginx/sites-available/${SITE} /etc/nginx/sites-enabled/

echo 'restart nginx...'
systemctl restart nginx

echo 'start nginx automatically...'
systemctl enable nginx

echo 'start socket.io wss test server...'
pm2 start -f ./support/server.js
