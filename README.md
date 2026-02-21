# 🦜 El Camino de las Letras

**El Camino de las Letras** es una aplicación educativa interactiva diseñada para acompañar a los niños en su proceso de aprendizaje de la lectoescritura. 

Este proyecto nació con un propósito muy especial: **ayudar a mi hijo**, quien se encuentra en la edad mágica de descubrir las letras y las palabras. Está inspirado en la secuencia pedagógica del libro "Mi Jardín", adaptándola a un entorno digital moderno, gamificado y lleno de estímulos positivos.

---

## 🗺️ Estructura del Juego: Las 3 Islas

El aprendizaje se divide en tres grandes áreas o islas, que los niños pueden recorrer a medida que progresan:

1.  **Isla de las Sílabas (Isla 1 - 🟢 Fácil)**: 
    *   Enfoque en vocales y sílabas simples (m, p, s, l, n, d, t).
    *   El niño debe completar palabras arrastrando la sílaba faltante.
2.  **Isla de las Palabras (Isla 2 - 🟠 Medio)**: 
    *   Enfoque en la formación de palabras completas y vocabulario básico.
    *   Retos donde el niño identifica y construye palabras a partir de sonidos e imágenes.
3.  **Isla de las Oraciones (Isla 3 - 🟣 Difícil)**: 
    *   Enfoque en la lectura comprensiva de frases cortas.
    *   El desafío consiste en completar oraciones con sentido lógico.

---

## ✨ Características Principales

*   **Onboarding Personalizado**: La aplicación captura el nombre del niño y lo saluda personalmente al iniciar la aventura.
*   **Audio Dinámico (TTS)**: Gracias a la integración con Google TTS, el juego puede decir el nombre del niño para hacerlo sentir el protagonista de su propio aprendizaje.
*   **Experiencia PWA Completa 📱**: El juego es una *Progressive Web App*. Puedes instalarlo en la pantalla de inicio de tu móvil o tablet (Android/iOS) y se comportará como una aplicación nativa, a pantalla completa y sin barras de navegación.
*   **Modo Offline**: Una vez descargados los paquetes de audio, el juego funciona totalmente sin internet, ideal para usar en tablets durante viajes o lugares sin conexión.
*   **Feedback Positivo**: Sistema de animaciones, sonidos de aliento y confetti dinámico para celebrar cada pequeño logro.

---

## 👨‍💻 Acerca del Desarrollador

<div align="center">
  <img src="/dev_avatar.png" width="120" alt="Miguel - Desarrollador" style="border-radius: 50%;" />
  
  ### ¡Hola! Soy Miguel
  
  Desarrollé **Aventura de Letras** con mucho cariño para mi hijo **Lucas**, buscando transformar el aprendizaje de la lectura en una experiencia mágica y divertida.
  
  Me apasiona crear tecnología que tenga un impacto positivo. Si te gusta el proyecto o quieres saber más sobre mi trabajo, ¡te invito a conectar!
  
  [🌐 Mi Portafolio](https://landing-personal-8n1b.vercel.app/) | [💻 Ver Código en GitHub](https://github.com/mmiguel40/aprende-a-leer)
  
  ¡Comparte esta aventura con otros pequeños futuros lectores! 🚀
</div>

---

## 🛠️ Configuración Técnica

El proyecto está construido con **Next.js**, **Tailwind CSS** y **Framer Motion** para las animaciones.

### Dependencia de Google Cloud TTS
La aplicación utiliza la API de **Google Text-to-Speech** exclusivamente para el proceso de **Onboarding**. Esta conexión permite generar audios personalizados con el nombre del niño la primera vez que inicia el juego.

Para que esta funcionalidad esté activa, se requiere una API Key de Google Cloud configurada en las variables de entorno:

1.  Crea un archivo `.env.local` en la raíz del proyecto.
2.  Agrega tu clave:
    ```env
    GOOGLE_TTS_API_KEY=tu_api_key_aqui
    ```

*Nota: El resto de los audios pedagógicos vienen pre-generados o se pueden descargar en paquetes, por lo que el uso de la API es mínimo y enfocado solo en la personalización inicial.*

---

Hecho con ❤️ para mi pequeño futuro lector Lucas.
