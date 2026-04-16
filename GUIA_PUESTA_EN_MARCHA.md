# Guía paso a paso para poner PulseParty en marcha

## 1) Requisitos previos

- Node.js 20 o superior.
- npm 10 o superior.
- Una base MongoDB (local o MongoDB Atlas).
- Una cuenta SMTP o Gmail con contraseña de aplicación para recuperación de contraseña.
- Git opcional.

## 2) Descargar o descomprimir el proyecto

Si recibiste un ZIP, descomprímelo y entra en la carpeta `pulseparty`.

## 3) Crear el archivo de entorno

Copia el archivo `.env.example` y renómbralo a `.env`.

Rellena estas variables:

### Backend
- `PORT=4000`
- `MONGODB_URI=...`
- `JWT_SECRET=...`
- `CLIENT_URL=http://localhost:3000`
- `SMTP_HOST=...`
- `SMTP_PORT=587`
- `SMTP_USER=...`
- `SMTP_PASS=...`
- `SMTP_FROM=...`
- `IPINFO_TOKEN=` opcional

### Frontend
- `NEXT_PUBLIC_API_URL=http://localhost:4000/api`
- `NEXT_PUBLIC_SOCKET_URL=http://localhost:4000`

## 4) Instalar dependencias

Desde la raíz del proyecto ejecuta:

```bash
npm install
```

## 5) Arrancar en local

Desde la raíz ejecuta:

```bash
npm run dev
```

Esto levanta:
- Frontend en `http://localhost:3000`
- Backend en `http://localhost:4000`

## 6) Probar flujo básico

1. Crea una cuenta.
2. Entra al dashboard.
3. Crea una sala.
4. Abre la sala en otra ventana/navegador con otro usuario.
5. Prueba chat, sincronización y compartir enlace.
6. Ve a Ajustes y sube un fondo personalizado.
7. Prueba “Olvidé mi contraseña”.

## 7) Despliegue del backend en Railway

### Opción recomendada: servicio independiente para `/backend`

1. Sube el repositorio a GitHub.
2. En Railway crea un nuevo proyecto desde GitHub.
3. Configura el servicio backend apuntando al directorio `backend`.
4. Añade variables de entorno del backend.
5. Define el comando de arranque:

```bash
npm start
```

6. Define el comando de instalación:

```bash
npm install
```

7. Despliega y copia la URL pública del backend.

## 8) Despliegue del frontend

### Opción A: Vercel

1. Importa el proyecto desde GitHub.
2. Configura el root directory como `frontend`.
3. Añade:
   - `NEXT_PUBLIC_API_URL=https://TU_BACKEND/api`
   - `NEXT_PUBLIC_SOCKET_URL=https://TU_BACKEND`
4. Deploy.

### Opción B: Railway

1. Crea otro servicio apuntando a `frontend`.
2. Variables:
   - `NEXT_PUBLIC_API_URL=https://TU_BACKEND/api`
   - `NEXT_PUBLIC_SOCKET_URL=https://TU_BACKEND`
3. Build command:

```bash
npm run build
```

4. Start command:

```bash
npm run start
```

## 9) MongoDB Atlas

1. Crea un clúster.
2. Crea usuario/contraseña.
3. Autoriza IPs o usa `0.0.0.0/0` temporalmente.
4. Copia la cadena de conexión a `MONGODB_URI`.

## 10) SMTP para recuperación de contraseña

### Gmail

1. Activa verificación en dos pasos.
2. Genera una contraseña de aplicación.
3. Usa:
   - `SMTP_HOST=smtp.gmail.com`
   - `SMTP_PORT=587`
   - `SMTP_USER=tu_correo`
   - `SMTP_PASS=tu_password_de_aplicacion`

## 11) Producción: almacenamiento de archivos

Ahora mismo los fondos se guardan en disco local del backend para que el proyecto funcione rápido en desarrollo.

**En producción en Railway ese almacenamiento puede ser efímero**, así que debes migrarlo a Cloudinary, S3 o Supabase Storage si quieres persistencia real.

## 12) Convertir a app móvil más adelante

Tienes dos rutas:

### Ruta 1: PWA
- Añadir manifest y service worker.
- Instalable desde Android y escritorio.

### Ruta 2: Capacitor
1. Instalar Capacitor en `frontend`.
2. Generar build de Next.
3. Integrar Android Studio / Xcode.
4. Permitir cámara, micrófono y screen share según plataforma.

## 13) Qué revisar antes de lanzar

- CORS del backend.
- URLs públicas correctas.
- Variables de entorno.
- MongoDB accesible.
- SMTP funcionando.
- Storage persistente para fondos/medios.
- Políticas de uso para contenido con copyright.

## 14) Recomendación final

Para una versión comercial te recomiendo la siguiente fase:
- mover uploads a Cloudinary/S3,
- añadir TURN server para WebRTC (por ejemplo Coturn),
- mejorar moderación/admin de sala,
- añadir Giphy/Tenor real,
- añadir notificaciones push,
- empaquetar con Capacitor.
