# Etapa 1: construir la app con Vite
FROM node:20 AS build
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Copiar archivo de variables para Vite
COPY app.env .env

# Compilar el frontend
RUN npm run build

# Etapa 2: servir con Nginx
FROM nginx:alpine

# Copiar build compilado
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar certificados SSL
COPY Certs/https /etc/nginx/ssl

# Copiar configuración personalizada de Nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Exponer puertos HTTPS y HTTP
EXPOSE 443 80

CMD ["nginx", "-g", "daemon off;"]