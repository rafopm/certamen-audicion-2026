# 🎵 Certamen de Audición Musical 2026
**Colegio "San Martín de Porres" (Lima, Perú)**  
*Homenaje a Johann Strauss (201 años de su nacimiento)*  
**Fecha del Evento:** Jueves 19 de noviembre de 2026, 5:00 p.m.

---

## 📋 Tabla de Contenidos
1. [Arquitectura del Sistema](#-arquitectura-del-sistema)
2. [Estructura de Google Sheets (Hoja Maestra)](#-estructura-de-google-sheets)
3. [Configuración de Google Apps Script (Backend)](#-configuración-de-google-apps-script)
4. [Subida de Audios a Google Drive y Obtención de File IDs](#-subida-de-audios-a-google-drive)
5. [Conexión Frontend con Backend](#-conexión-frontend-con-backend)
6. [Despliegue en GitHub Pages](#-despliegue-en-github-pages)
7. [Vista de Proyector en Pantalla Gigante](#-vista-de-proyector)
8. [Backup y Respaldo de Datos](#-backup-y-respaldo-de-datos)
9. [Troubleshooting y Preguntas Frecuentes](#-troubleshooting)

---

## 🏛 Arquitectura del Sistema

- **Frontend:** HTML5, TailwindCSS (CDN), JavaScript Vanilla modular (ES Modules), Vite 5.
- **Backend:** Google Apps Script (`Código.gs`) publicado como Web App REST JSON.
- **Base de Datos:** Google Sheets con 5 hojas maestras.
- **Almacenamiento de Audios:** Google Drive (soporte para streaming directo y fallback a Base64).
- **Proyección:** `proyector.html` recibe órdenes de reproducción, carga el audio y sincroniza la cuenta regresiva con el panel.

---

## 📊 Estructura de Google Sheets

Crea un libro en Google Sheets con estas **7 hojas**. La función `setupInitialSheets` crea las hojas faltantes y sus encabezados.

### 📑 1. Hoja: `Config`
Esta hoja es la **fuente de verdad** para todos los parámetros del certamen:

| Clave | Valor | Descripción |
|---|---|---|
| `ANIO_CERTAMEN` | 2026 | Año del certamen |
| `NOMBRE_EVENTO` | Certamen Audición Musical 2026 | Nombre oficial |
| `HOMENAJEADO` | Johann Strauss | Compositor homenajeado |
| `TOTAL_RONDAS` | 5 | Número total de rondas |
| `RONDA_ACTUAL` | 1 | Ronda en curso (editable durante el evento) |
| `MINIMO_PASAR_DEFAULT` | 2 | Mínimo de aciertos para pasar (default) |
| `DURACION_RONDA_1` | 40 | Segundos por audición en Ronda 1 |
| `NUM_AUDICIONES_RONDA_1` | 4 | Cantidad de audiciones en Ronda 1 |
| `MINIMO_PASAR_RONDA_1` | 2 | Mínimo para pasar en Ronda 1 |
| `DURACION_RONDA_2` | 20 | Segundos por audición en Ronda 2 |
| `NUM_AUDICIONES_RONDA_2` | 4 | Cantidad de audiciones en Ronda 2 |
| `MINIMO_PASAR_RONDA_2` | 2 | Mínimo para pasar en Ronda 2 |
| `DURACION_RONDA_3` | 10 | Segundos por audición en Ronda 3 |
| `NUM_AUDICIONES_RONDA_3` | 3 | Cantidad de audiciones en Ronda 3 |
| `MINIMO_PASAR_RONDA_3` | 2 | Mínimo para pasar en Ronda 3 |
| `DURACION_RONDA_4` | 5 | Segundos por audición en Ronda 4 |
| `NUM_AUDICIONES_RONDA_4` | 3 | Cantidad de audiciones en Ronda 4 |
| `MINIMO_PASAR_RONDA_4` | 2 | Mínimo para pasar en Ronda 4 |
| `DURACION_RONDA_FINAL` | 2 | Segundos por audición en Ronda Final |
| `NUM_AUDICIONES_RONDA_FINAL` | 3 | Cantidad de audiciones en Ronda Final |
| `MINIMO_PASAR_RONDA_FINAL` | 3 | Mínimo para ganar en Ronda Final |
| `PREMIOS_PRIMER_PUESTO` | Diploma, medalla y premio sorpresa | Premio 1° |
| `PREMIOS_SEGUNDO_PUESTO` | Diploma, medalla y premio sorpresa | Premio 2° |
| `PREMIOS_TERCER_PUESTO` | Diploma y medalla | Premio 3° |
| `API_VERSION` | 1.0.0 | Versión de la API |

### 📑 2. Hoja: `Canciones`
Cabeceras en Fila 1:  
`ID` | `Nombre` | `Codigo` | `Archivo_Drive_ID` | `Año` | `Activa`

Ejemplo de datos:
```
1  | TRITSCH-TRATSCH-POLKA | TP2380 | 1A2b3C4d... | 2026 | TRUE
2  | VIDA DE ARTISTA       | VD1044 | 1A2b3C4d... | 2026 | TRUE
3  | EL MURCIELAGO         | EM1854 | 1A2b3C4d... | 2026 | TRUE
4  | VALS DEL EMPERADOR    | VE1053 | 1A2b3C4d... | 2026 | TRUE
5  | EL DANUBIO AZUL       | EA0955 | 1A2b3C4d... | 2026 | TRUE
6  | VOCES DE PRIMAVERA    | VP0533 | 1A2b3C4d... | 2026 | TRUE
7  | AL GRANO              | AG0238 | 1A2b3C4d... | 2026 | TRUE
8  | MARCHA RUSA           | MR0330 | 1A2b3C4d... | 2026 | TRUE
9  | NAPOLEON MARSCH       | NM0255 | 1A2b3C4d... | 2026 | TRUE
10 | PERSISCHER MARSCH     | PM0205 | 1A2b3C4d... | 2026 | TRUE
```

### 📑 3. Hoja: `Alumnos`
Cabeceras en Fila 1:  
`ID` | `Nombre` | `Grado` | `Nivel` | `Año` | `Activo`

Ejemplo:
```
1 | Valeria Sánchez    | 5to | Primaria   | 2026 | TRUE
2 | Mateo Quispe       | 6to | Primaria   | 2026 | TRUE
3 | Camila Flores      | 1ro | Secundaria | 2026 | TRUE
4 | Sebastián Mendoza  | 2do | Secundaria | 2026 | TRUE
```

### 📑 4. Hoja: `Audiciones_Ronda`
Cabeceras en Fila 1:  
`Ronda` | `Audicion_Num` | `Cancion_ID` | `Orden`

Ejemplo:
```
1 | 1 | 5  | 1
1 | 2 | 3  | 2
1 | 3 | 8  | 3
1 | 4 | 1  | 4
2 | 1 | 2  | 1
...
```

### 📑 5. Hoja: `Resultados`
Cabeceras en Fila 1:  
`Alumno_ID` | `Alumno_Nombre` | `Grado` | `Ronda` | `Aciertos` | `Eliminado` | `Puntos_Total` | `Timestamp` | `Ronda_Eliminacion`

*(Se actualiza al guardar las respuestas y se completa al finalizar la ronda.)*

### 📑 6. Hoja: `Respuestas_Audicion`
Cabeceras en Fila 1:  
`Alumno_ID` | `Ronda` | `Audicion_Num` | `Respuesta` | `Correcto` | `Fecha_Hora`

*(Guarda una respuesta correcta o un error por participante y audición. Una respuesta vacía también se registra como error.)*

### 📑 7. Hoja: `Log_Reproducciones` (Auditoría en Tiempo Real)
Cabeceras en Fila 1:  
`ID` | `Ronda` | `Audicion_Num` | `Cancion_ID` | `Cancion_Nombre` | `Cancion_Codigo` | `Segundo_Inicio` | `Segundo_Fin` | `Duracion_Seg` | `Fecha_Hora` | `Timestamp`

*(Registra automáticamente cada vez que se reproduce una audición: qué obra sonó, su código oficial, de qué segundo a qué segundo se escuchó y la fecha y hora exacta con zona horaria de Lima, Perú).*

## 🧭 Flujo del certamen

1. En **Rondas y reglas**, define la cantidad de rondas y, para cada una, las audiciones, duración y mínimo para clasificar. Los valores actuales aparecen como editables.
2. Guarda las canciones activas en **Canciones**.
3. En **Sorteo de canciones**, genera y guarda la distribución. Una canción no se repite dentro de una ronda. Si cambias el sorteo después de guardar resultados, confirma el reinicio antes de continuar.
4. Durante una ronda, reproduce una audición, revisa las pizarras y guarda una respuesta por cada participante elegible. Los campos vacíos o incorrectos se guardan como error.
5. El botón **Siguiente** solo se habilita cuando las respuestas están guardadas y sin cambios pendientes. La ronda no puede finalizar hasta completar todas sus audiciones.
6. Al finalizar la ronda se calcula quién clasifica según su mínimo configurado. El sistema avanza a la siguiente ronda; para modificar una ronda cerrada, usa **Resetear ronda**, que también borra los datos de las rondas posteriores.

Al cambiar reglas con actividad registrada, el panel solicitará confirmar el reinicio de respuestas y resultados. El sorteo también se limpia y debe generarse de nuevo.

---

## ⚡ Configuración de Google Apps Script

1. En tu hoja de cálculo, ve al menú: **Extensiones** > **Apps Script**.
2. Reemplaza cualquier código existente pegando íntegramente el archivo `Codigo.gs` del repositorio.
3. **Inicialización automática (Opcional pero muy útil):**
   - En la barra superior de Apps Script, selecciona la función `setupInitialSheets` en el menú desplegable y presiona **Ejecutar**.
   - Concede los permisos que Google solicite. Esta función creará o verificará las hojas y sus valores predeterminados.
4. **Despliegue como Web App:**
   - Haz clic en el botón azul superior **Implementar** (Deploy) > **Nueva implementación** (New deployment).
   - Haz clic en el engranaje ⚙️ junto a "Seleccionar tipo" y elige **Aplicación web**.
   - **Descripción:** `Certamen 2026`
   - **Ejecutar como:** `Yo (tu_correo@gmail.com)`
   - **Quién tiene acceso:** `Cualquiera` (*Anyone* - fundamental para que la app web y el proyector puedan acceder sin iniciar sesión).
   - Haz clic en **Implementar**.
5. Copia la **URL de la aplicación web** generada (termina en `/exec`).

Cada vez que actualices `Codigo.gs`, implementa una nueva versión de la aplicación web para que el panel use los endpoints de respuestas y validaciones actuales.

---

## 🎵 Subida de Audios a Google Drive

Para reproducir los audios sin bloqueos:

1. Sube tus archivos `.mp3` o `.m4a` a una carpeta de Google Drive.
2. Haz clic derecho sobre la carpeta o cada archivo > **Compartir** > **Compartir**.
3. En *Acceso general*, cámbialo a **Cualquier persona con el enlace** (Lector).
4. Para obtener el `FILE_ID`:
   - Copia el enlace del archivo:  
     `https://drive.google.com/file/d/1A2b3C4d5E6F7G8H9I0J/view?usp=sharing`
   - El `FILE_ID` es la cadena entre `/d/` y `/view`:  
     `1A2b3C4d5E6F7G8H9I0J`
5. Pega ese código en la columna `Archivo_Drive_ID` de la hoja `Canciones`.

El panel envía la orden al proyector, que descarga el audio desde Apps Script como Base64 y lo conserva temporalmente en caché. La caché mantiene como máximo una pista. Cuando termina la carga, el proyector inicia una cuenta regresiva de 5 segundos; el panel sincroniza su temporizador con esa hora. El audio suena únicamente en la computadora conectada al proyector.

---

## 🔗 Conexión Frontend con Backend

1. Abre el archivo `src/js/config.js`.
2. Actualiza la variable `API_URL` con la URL de tu Web App de Apps Script:

```javascript
export const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycbx...TU_ID.../exec',
  // ... resto de configuración
};
```

3. Prueba en tu entorno local:
```bash
npm run dev
```

---

## 🚀 Despliegue en GitHub Pages

1. Verifica que en `vite.config.js` la propiedad `base` coincida con el nombre de tu repositorio:
```javascript
base: command === 'serve' ? '/' : '/certamen-audicion-2026/'
```
2. Ejecuta el comando de compilación y despliegue:
```bash
npm run deploy
```
*(Este comando ejecuta `vite build` y publica la carpeta `dist` en la rama `gh-pages` con el paquete `gh-pages`).*

3. En GitHub, ve a **Settings** > **Pages** de tu repositorio:
   - **Source:** Deploy from a branch
   - **Branch:** `gh-pages` / `/ (root)`
   - Guarda los cambios. Tu sitio estará disponible en minutos en:  
     `https://tu-usuario.github.io/certamen-audicion-2026/`

---

## 📺 Vista de Proyector

Para la pantalla gigante del auditorio:
- Accede a `proyector.html` (o haz clic en el botón **Abrir Proyector** en la cabecera).
- En esa computadora, pulsa una vez **Activar audio** para permitir la reproducción del navegador.
- Mantén esa página abierta durante el certamen. Al pulsar **Reproducir Audición** en el panel, la pantalla muestra la carga del archivo y, al terminar, la cuenta regresiva de 5 segundos antes de reproducir.
- El panel permite detener la audición y registra el rango reproducido en Google Sheets al terminar.
- La pantalla cuenta con:
  - Temporizador gigante con tipografía clásica.
  - Indicador de estado en tiempo real (**EN VIVO**).
  - Podio superior animado (1°, 2° y 3° lugar).
  - Tabla completa de posiciones.
  - Botón de **Pantalla Completa** (o presiona F11).
  - Efecto de **Confeti** festivo al culminar el certamen.
  - Polling cada 2 segundos sin necesidad de recargar la página.

---

## 💾 Backup y Respaldo de Datos

- **Antes del evento:** Ve a Google Sheets > **Archivo** > **Hacer una copia**.
- **Durante el evento:** Cada vez que el jurado presiona **Guardar Aciertos** o **Finalizar Ronda**, Google Sheets almacena una fila con timestamp exacto.
- **En caso de emergencia (Falla total de internet):**
  - Los datos locales se mantienen en memoria del navegador mientras no se cierre la pestaña.
  - La hoja de cálculo puede ser editada directamente desde un celular u otra laptop y el proyector reflejará los cambios en 2 segundos.

---

## 🛠 Troubleshooting

### 1. Error de CORS en Google Apps Script
- **Causa:** Apps Script no fue desplegado con acceso para "Cualquiera" (*Anyone*).
- **Solución:** Ve a Apps Script > **Implementar** > **Gestionar implementaciones** > Editar > asegúrate de que **Quién tiene acceso** sea **Cualquiera**. Cada vez que modifiques `Código.gs`, debes crear una **Nueva versión** del despliegue.

### 2. Los audios no suenan o quedan en carga
- Confirma que `proyector.html` esté abierto y que se haya pulsado **Activar audio** en esa computadora.
- Verifica que el archivo de Drive permita lectura a **Cualquier persona con el enlace** y que el proyecto de Apps Script esté desplegado con la versión más reciente de `Codigo.gs`.
- Revisa el mensaje de estado en la pantalla del proyector para identificar si falló la descarga, la decodificación o el inicio de reproducción.

### 3. GitHub Pages muestra una página en blanco
- **Causa:** El path `base` en `vite.config.js` no coincide con el subpath del repositorio.
- **Solución:** Verifica que `base: '/certamen-audicion-2026/'` tenga las barras diagonales al inicio y final.

---

*Desarrollado para el Certamen de Audición Musical 2026 • I.E.P. San Martín de Porres.*
