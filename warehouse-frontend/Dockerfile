# Gunakan NodeJS
FROM node:18

# Set working directory
WORKDIR /app

# Salin file package
COPY package*.json ./

# Install dependensi
RUN npm install

# Salin seluruh file React
COPY . .

COPY .env .env

# Build untuk produksi
RUN npm run build

# Jalankan server (gunakan Vite preview atau serve)
EXPOSE 3000
CMD ["npm", "start"]
