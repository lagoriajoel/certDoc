# =============================================
# Stage 1: Build Angular
# =============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependencias (cacheado si package.json no cambia)
COPY package*.json ./
RUN npm ci

# Copiar fuente y compilar
COPY . .
RUN npm run build -- --configuration production

# =============================================
# Stage 2: Nginx para servir el build
# =============================================
FROM nginx:alpine

# Copiar build de Angular
COPY --from=builder /app/dist/certificaciones-frontend/browser /usr/share/nginx/html

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
