# Gunakan image PHP + Apache
FROM php:8.2-apache

# Set working directory
WORKDIR /var/www/html

# Install dependensi
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpng-dev libonig-dev libxml2-dev zip curl \
    && docker-php-ext-install pdo_mysql mbstring zip exif pcntl bcmath gd

# Aktifkan mod_rewrite (sudah ada di kode Anda)
RUN a2enmod rewrite

# --- TAMBAHKAN BARIS KRUSIAL INI ---
RUN a2enmod headers
# --- TAMBAHKAN INI UNTUK MENGGANTI KONFIGURASI APACHE DEFAULT ---
# Gantikan konfigurasi default Apache dengan versi yang mengizinkan .htaccess (AllowOverride All)
# Salin file konfigurasi Apache yang sudah dimodifikasi
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf
RUN a2ensite 000-default.conf # Pastikan site ini diaktifkan, jika perlu
RUN a2dissite 000-default # Pastikan default site tidak menimpa

# Salin semua file Laravel ke container
COPY . .

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Install dependensi Laravel
RUN composer install --no-dev --optimize-autoloader

# Set permission storage dan cache
RUN chown -R www-data:www-data storage bootstrap/cache

# Jalankan Apache
CMD bash -c "php artisan migrate --seed && apache2-foreground"

# Expose port
EXPOSE 80

