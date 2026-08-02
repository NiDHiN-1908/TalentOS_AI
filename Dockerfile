# Stage 1: Build static assets
FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve via Nginx
FROM nginx:alpine as runner

COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx config for SPA routing & security headers
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
    add_header X-Frame-Options "DENY"; \
    add_header X-Content-Type-Options "nosniff"; \
    add_header Content-Security-Policy "default-src \x27self\x27; script-src \x27self\x27 \x27unsafe-inline\x27; style-src \x27self\x27 \x27unsafe-inline\x27 https://fonts.googleapis.com; font-src \x27self\x27 https://fonts.gstatic.com;"; \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
