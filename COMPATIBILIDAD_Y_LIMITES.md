# Compatibilidad, límites y siguiente fase

## Compatible ahora mismo

- Web escritorio.
- Web móvil responsive.
- YouTube.
- MP4 directos.
- HLS propios o autorizados.
- Enlaces externos para sincronización de estado.
- Conversión futura a Android/iOS con Capacitor.

## No incluido por motivos legales/técnicos

- Extracción automática de `.m3u8`, `.mpd` o `.mp4` desde webs de terceros protegidas.
- Bypass de Captcha, Cloudflare, Datadome u otras protecciones.
- Bypass de DRM o reproducción embebida ilegal de Netflix/Disney/Prime.
- Automatización de login encubierta en plataformas de terceros.

## Arquitectura correcta para OTT premium

La forma correcta es:
1. cada usuario abre su propia cuenta,
2. la app sincroniza eventos,
3. si se requiere navegador embebido, debe respetar términos de la plataforma,
4. para reproducción real, usar SDKs/APIs oficiales cuando existan.

## Siguiente fase sugerida

- Reemplazar el mock inicial de WebRTC por malla P2P completa o SFU.
- Añadir TURN/STUN serio.
- Añadir moderación avanzada.
- Añadir analytics y observabilidad.
- Subir adjuntos a storage persistente.
- Implementar PWA/Capacitor.
