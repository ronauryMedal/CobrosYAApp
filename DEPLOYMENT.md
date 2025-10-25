# 🚀 Guía de Despliegue - PagosYA App

## 📋 Configuración de URLs de API

La aplicación está configurada para usar diferentes URLs de API según el entorno. Todas las URLs están centralizadas en los archivos de environment.

### 🔧 Archivos de Configuración

#### **Desarrollo (environment.ts)**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  apiBaseUrl: 'http://localhost:8000'
};
```

#### **Staging (environment.staging.ts)**
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://staging-api.tu-dominio.com/api',
  apiBaseUrl: 'https://staging-api.tu-dominio.com'
};
```

#### **Producción (environment.prod.ts)**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tu-dominio.com/api',
  apiBaseUrl: 'https://tu-dominio.com'
};
```

## 🛠️ Comandos de Build

### **Desarrollo**
```bash
ionic serve
# o
ng serve
```

### **Build para Staging**
```bash
ionic build --configuration=staging
# o
ng build --configuration=staging
```

### **Build para Producción**
```bash
ionic build --prod
# o
ng build --prod
```

## 📝 Pasos para Cambiar la URL de API

### **1. Para Desarrollo Local**
Edita `src/environments/environment.ts`:
```typescript
apiUrl: 'http://tu-servidor-local:8000/api'
```

### **2. Para Staging**
Edita `src/environments/environment.staging.ts`:
```typescript
apiUrl: 'https://staging-api.tu-dominio.com/api'
```

### **3. Para Producción**
Edita `src/environments/environment.prod.ts`:
```typescript
apiUrl: 'https://api.tu-dominio.com/api'
```

## 🔄 Proceso de Despliegue

### **1. Preparar el Build**
```bash
# Para staging
ionic build --configuration=staging

# Para producción
ionic build --prod
```

### **2. Los archivos se generan en:**
- `www/` - Archivos listos para desplegar

### **3. Desplegar**
- Sube la carpeta `www/` a tu servidor web
- Configura tu servidor para servir archivos estáticos
- Asegúrate de que las rutas de Angular estén configuradas correctamente

## 🌐 Configuración del Servidor Web

### **Apache (.htaccess)**
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### **Nginx**
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## 📱 Para Aplicación Móvil (Capacitor)

### **1. Sincronizar con Capacitor**
```bash
ionic cap sync
```

### **2. Build para Android**
```bash
ionic cap build android
```

### **3. Build para iOS**
```bash
ionic cap build ios
```

## ⚠️ Consideraciones Importantes

1. **CORS**: Asegúrate de que tu API tenga configurado CORS para el dominio de tu app
2. **HTTPS**: En producción, siempre usa HTTPS
3. **Variables de Entorno**: Nunca hardcodees URLs en el código
4. **Testing**: Prueba siempre en staging antes de producción

## 🔍 Verificación

Para verificar que la configuración es correcta:

1. **Desarrollo**: Abre DevTools → Network → Verifica que las peticiones van a `localhost:8000`
2. **Staging**: Verifica que van a tu servidor de staging
3. **Producción**: Verifica que van a tu servidor de producción

## 📞 Soporte

Si tienes problemas con el despliegue, verifica:
- ✅ Las URLs en los archivos de environment
- ✅ La configuración de CORS en tu API
- ✅ Que el servidor web esté configurado correctamente
- ✅ Los certificados SSL en producción
