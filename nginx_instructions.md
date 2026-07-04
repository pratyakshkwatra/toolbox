# Nginx Reverse Proxy Configuration

This project is intended to be hosted at `toolbox.pratyakshkwatra.com`. The following is the recommended Nginx configuration to proxy traffic to the Docker containers.

## Prerequisites
- A server with Nginx installed.
- Docker and Docker Compose running your `toolbox` services.
- An SSL certificate (e.g., from Let's Encrypt / Certbot).

## Configuration

Create a file at `/etc/nginx/sites-available/toolbox.pratyakshkwatra.com` with the following content:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name toolbox.pratyakshkwatra.com;

    # Redirect all HTTP requests to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name toolbox.pratyakshkwatra.com;

    # SSL Configuration (assuming Certbot)
    ssl_certificate /etc/letsencrypt/live/toolbox.pratyakshkwatra.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/toolbox.pratyakshkwatra.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # API Proxying
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_addrs;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend Next.js Proxying
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_addrs;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Enable the configuration

1. Link to `sites-enabled`:
   ```bash
   sudo ln -s /etc/nginx/sites-available/toolbox.pratyakshkwatra.com /etc/nginx/sites-enabled/
   ```
2. Test Nginx config:
   ```bash
   sudo nginx -t
   ```
3. Reload Nginx:
   ```bash
   sudo systemctl reload nginx
   ```
