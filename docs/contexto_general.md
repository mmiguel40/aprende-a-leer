# Contexto General del Proyecto: Aprende a Leer

## Iniciativa Original
Desarrollar una aplicación interactiva y gamificada para enseñar a leer a niños, basada en el libro "Mi Jardín".

## Estado Actual (20-02-2026)
Se ha completado una fase mayor de rediseño y expansión que incluye:

### 1. Sistema de Niveles y Navegación
- **Estructura**: 30 niveles divididos en 3 islas:
    - **Isla 1: Sílabas** (Niveles m-v).
    - **Isla 2: Palabras** (Niveles r-z).
    - **Isla 3: Oraciones** (Niveles complejos).
- **Mapa**: Layout vertical con gradientes, mascotas (🦜, 🦋, 🦄) y sistema de nodos con estados.

### 2. Tablero de Juego (GameBoard)
- **Modos de Juego**: Sílabas, Palabras y Oraciones.
- **Feedback**: Sistema de `DropZone` con 4 estados, animaciones de éxito/error y confetti dinámico por isla.
- **Correcciones**: Split dinámico para modo sílabas (fix bug del hueco).

### 3. Personalización y UX
- **Onboarding**: Captura del nombre del niño con persistencia en `localStorage`.
- **TTS Personalizado**: Generación automática de saludos con el nombre del niño usando Google TTS.
- **Acceso Offline**: Los audios personalizados y paquetes de niveles se almacenan en el caché del dispositivo (Service Worker).

### 4. Arquitectura y Seguridad
- **Variables de Entorno**: API Keys extraídas a `.env.local` (seguridad Git).
- **Backend (Next.js)**: API Route para generación de audio dinámica.
- **Scripts**: Soporte para generación masiva de audios pedagógicos.

## Seguimiento de Cambios de Alcance
- **Original**: Aplicación básica de niveles.
- **Ajuste 1**: Se añadió soporte offline global para uso en tablets/móviles sin conexión.
- **Ajuste 2**: Se incorporó personalización por nombre del niño para aumentar el engagement.
- **Ajuste 3**: Se implementó una jerarquía de 3 islas con narrativas visuales distintas.

---
*Documento autogenerado para seguimiento de iniciativa vs. ejecución.*
