# Gunakan base image PHP + Apache
FROM php:8.2-apache

# Set working directory ke root project Laravel
WORKDIR /var/www/html

# Install dependensi yang dibutuhkan Laravel
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpng-dev libonig-dev libxml2-dev zip curl \
    && docker-php-ext-install pdo_mysql mbstring zip exif pcntl bcmath gd

# Aktifkan mod_rewrite dan mod_headers (krusial untuk Laravel + CORS)
RUN a2enmod rewrite headers

# Ubah DocumentRoot Apache agar mengarah ke folder public Laravel
RUN sed -i 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf

# Gantikan konfigurasi default Apache dengan versi custom (CORS + AllowOverride All)
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf

# Pastikan site aktif
RUN a2ensite 000-default.conf

# Salin semua file Laravel ke container
COPY . .

# Copy Composer dari official image agar tidak perlu download ulang
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Install dependensi Laravel (tanpa dev, optimize autoloader)
RUN composer install --no-dev --optimize-autoloader

# Set permission folder storage dan cache
RUN chown -R www-data:www-data storage bootstrap/cache

# Jalankan migrasi (opsional, bisa dihapus kalau mau manual)
# Lalu start Apache
CMD bash -c "php artisan migrate --seed && apache2-foreground"

# Expose port Apache
EXPOSE 80
