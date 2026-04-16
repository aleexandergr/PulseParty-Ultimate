# PulseParty

PulseParty es una plataforma social de watch party con frontend en Next.js, backend en Express, MongoDB, Socket.io y WebRTC-ready. La interfaz usa una estética dark glassmorphism pensada para navegador de escritorio y móvil, con base preparada para empaquetado futuro en Android/iOS mediante Capacitor o wrappers nativos.

## Qué incluye

- Registro, login y JWT.
- Dashboard de salas activas.
- Creación de salas públicas/privadas.
- Reproductor sincronizado para YouTube, MP4 y HLS propios.
- Modo `external-sync` para plataformas con DRM: sincroniza estados sin extraer streams protegidos.
- Chat de sala en tiempo real.
- Inbox privado 1:1.
- Solicitudes de amistad/mensaje.
- Ajustes de perfil y subida de fondo personalizado de imagen o vídeo.
- Recuperación de contraseña por correo con token seguro.
- Detección de país por IP y bandera junto al usuario.
- Invitación viral por copiar enlace y compartir por WhatsApp.
- Overlay PiP arrastrable para videollamada/screen share.
- Diseño responsive para PC, tablets y móviles.

## Stack

- Frontend: Next.js App Router + Tailwind CSS + Framer Motion.
- Backend: Node.js + Express.
- Base de datos: MongoDB.
- Tiempo real: Socket.io.
- Media: React Player, HLS.js y base WebRTC.
- Despliegue recomendado: Railway (API) + Vercel o Railway (frontend) + MongoDB Atlas.

## Nota importante de cumplimiento

Este proyecto **no implementa evasión de captchas, bypass de Cloudflare/Datadome, extracción de flujos protegidos, ni descifrado de DRM**. Para servicios como Netflix, Disney+, Prime Video o Crunchyroll se incluye un modo compatible llamado `external-sync`, donde cada usuario usa su cuenta legítima y PulseParty sincroniza play/pause/timestamps.

## Estructura

- `/frontend`: aplicación Next.js.
- `/backend`: API Express + Socket.io + Mongo.
- `/.env.example`: variables de entorno de ejemplo.
- `/GUIA_PUESTA_EN_MARCHA.md`: paso a paso completo.
- `/COMPATIBILIDAD_Y_LIMITES.md`: límites legales/técnicos y siguiente fase.

## Desarrollo local rápido

1. Copia `.env.example` a `.env`.
2. Completa MongoDB y SMTP.
3. Instala dependencias con `npm install` en la raíz.
4. Ejecuta `npm run dev`.
5. Abre `http://localhost:3000`.

## Producción recomendada

- MongoDB Atlas para base de datos.
- Railway para backend Node.
- Vercel o Railway para frontend Next.
- Cloudinary/S3 para fondos y adjuntos en producción.

