server {
  listen              443 ssl;
  listen              [::]:443 ssl;
  ssl_certificate     /var/webapp/TowerMonitor/backend/support/holytiny.com.pem;
  ssl_certificate_key /var/webapp/TowerMonitor/backend/support/holytiny.com.key;

  location / {
    proxy_pass http://localhost:3030/;
  }

  location /socket.io/ {
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_pass "http://localhost:3210/socket.io/";
  }
}

server {
  listen 80;
  listen [::]:80;
  return 301 https://$host$request_uri;
}
