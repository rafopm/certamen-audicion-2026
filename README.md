# 🎵 Certamen de Audición Musical 2026
**Colegio "San Martín de Porres" (Lima, Perú)**  
*Homenaje a Johann Strauss (201 años de su nacimiento)*  
**Fecha del Evento:** Jueves 19 de noviembre de 2026, 5:00 p.m.

---

## 📋 Tabla de Contenidos
1. [Arquitectura del Sistema](#-arquitectura-del-sistema)
2. [Estructura de la Base de Datos](#-estructura-de-la-base-de-datos)
3. [Configuración del Servicio de Datos](#-configuración-del-servicio-de-datos)
4. [Archivos de Audio](#-archivos-de-audio)
5. [Conexión de la Aplicación](#-conexión-de-la-aplicación)
6. [Publicación](#-publicación)
7. [Vista de Proyector en Pantalla Gigante](#-vista-de-proyector)
8. [Backup y Respaldo de Datos](#-backup-y-respaldo-de-datos)
9. [Troubleshooting y Preguntas Frecuentes](#-troubleshooting)

---

## 🏛 Arquitectura del Sistema

- **Interfaz:** aplicación web modular adaptable a computadoras y pantallas de proyección.
- **Servicio de datos:** recibe las solicitudes de la aplicación y las comunica con la base de datos.
- **Base de datos:** conserva configuración, participantes, audiciones, resultados y registros.
- **Almacenamiento de audio:** servicio de archivos configurado para que el proyector pueda cargar las pistas.
- **Proyección:** `proyector.html` controla la carga, el inicio, el tiempo de reproducción y la detención.

---

## 📊 Estructura de la Base de Datos

La base de datos requiere estas **7 tablas o colecciones**:

### 📑 1. Tabla: `Config`
Esta tabla es la **fuente de verdad** para todos los parámetros del certamen:

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
| `PUNTOS_POR_ACIERTO_RONDA_1` | 1 | Puntos por cada acierto en Ronda 1 |
| `BONUS_POR_CLASIFICAR_RONDA_1` | 0 | Bonus único al clasificar en Ronda 1 |
| `DURACION_RONDA_2` | 20 | Segundos por audición en Ronda 2 |
| `NUM_AUDICIONES_RONDA_2` | 4 | Cantidad de audiciones en Ronda 2 |
| `MINIMO_PASAR_RONDA_2` | 2 | Mínimo para pasar en Ronda 2 |
| `PUNTOS_POR_ACIERTO_RONDA_2` | 1 | Puntos por cada acierto en Ronda 2 |
| `BONUS_POR_CLASIFICAR_RONDA_2` | 0 | Bonus único al clasificar en Ronda 2 |
| `DURACION_RONDA_3` | 10 | Segundos por audición en Ronda 3 |
| `NUM_AUDICIONES_RONDA_3` | 3 | Cantidad de audiciones en Ronda 3 |
| `MINIMO_PASAR_RONDA_3` | 2 | Mínimo para pasar en Ronda 3 |
| `PUNTOS_POR_ACIERTO_RONDA_3` | 1 | Puntos por cada acierto en Ronda 3 |
| `BONUS_POR_CLASIFICAR_RONDA_3` | 0 | Bonus único al clasificar en Ronda 3 |
| `DURACION_RONDA_4` | 5 | Segundos por audición en Ronda 4 |
| `NUM_AUDICIONES_RONDA_4` | 3 | Cantidad de audiciones en Ronda 4 |
| `MINIMO_PASAR_RONDA_4` | 2 | Mínimo para pasar en Ronda 4 |
| `PUNTOS_POR_ACIERTO_RONDA_4` | 1 | Puntos por cada acierto en Ronda 4 |
| `BONUS_POR_CLASIFICAR_RONDA_4` | 0 | Bonus único al clasificar en Ronda 4 |
| `DURACION_RONDA_FINAL` | 2 | Segundos por audición en Ronda Final |
| `NUM_AUDICIONES_RONDA_FINAL` | 3 | Cantidad de audiciones en Ronda Final |
| `MINIMO_PASAR_RONDA_FINAL` | 3 | Mínimo para ganar en Ronda Final |
| `PUNTOS_POR_ACIERTO_RONDA_FINAL` | 1 | Puntos por cada acierto en la Ronda Final |
| `BONUS_POR_CLASIFICAR_RONDA_FINAL` | 0 | Bonus único al alcanzar el mínimo para ganar |
| `PREMIOS_PRIMER_PUESTO` | Diploma, medalla y premio sorpresa | Premio 1° |
| `PREMIOS_SEGUNDO_PUESTO` | Diploma, medalla y premio sorpresa | Premio 2° |
| `PREMIOS_TERCER_PUESTO` | Diploma y medalla | Premio 3° |
| `API_VERSION` | 1.0.0 | Versión de la API |

### 📑 2. Tabla: `Canciones`
Cabeceras en Fila 1:  
`ID` | `Nombre` | `Codigo` | `Archivo_ID` | `Año` | `Activa`

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

### 📑 3. Tabla: `Alumnos`
Cabeceras en Fila 1:  
`ID` | `Nombre` | `Grado` | `Nivel` | `Año` | `Activo`

Ejemplo:
```
1 | Valeria Sánchez    | 5to | Primaria   | 2026 | TRUE
2 | Mateo Quispe       | 6to | Primaria   | 2026 | TRUE
3 | Camila Flores      | 1ro | Secundaria | 2026 | TRUE
4 | Sebastián Mendoza  | 2do | Secundaria | 2026 | TRUE
```

### 📑 4. Tabla: `Audiciones_Ronda`
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

### 📑 5. Tabla: `Resultados`
Cabeceras en Fila 1:  
`Alumno_ID` | `Alumno_Nombre` | `Grado` | `Ronda` | `Aciertos` | `Eliminado` | `Puntos_Total` | `Timestamp` | `Ronda_Eliminacion`

*(Se actualiza al guardar las respuestas y se completa al finalizar la ronda.)*

### 📑 6. Tabla: `Respuestas_Audicion`
Cabeceras en Fila 1:  
`Alumno_ID` | `Ronda` | `Audicion_Num` | `Respuesta` | `Correcto` | `Fecha_Hora`

*(Guarda una respuesta correcta o un error por participante y audición. Una respuesta vacía también se registra como error.)*

### 📑 7. Tabla: `Log_Reproducciones` (Auditoría en Tiempo Real)
Cabeceras en Fila 1:  
`ID` | `Ronda` | `Audicion_Num` | `Cancion_ID` | `Cancion_Nombre` | `Cancion_Codigo` | `Segundo_Inicio` | `Segundo_Fin` | `Duracion_Seg` | `Fecha_Hora` | `Timestamp`

*(Registra automáticamente cada vez que se reproduce una audición: qué obra sonó, su código oficial, de qué segundo a qué segundo se escuchó y la fecha y hora exacta con zona horaria de Lima, Perú).*

## 🧭 Flujo del certamen

1. En **Rondas y reglas**, define la cantidad de rondas y, para cada una, las audiciones, duración, mínimo para clasificar, puntos por acierto y bonus por clasificar. El bonus se suma una sola vez cuando el participante alcanza el mínimo; en la ronda final, al alcanzar el mínimo para ganar.
2. Guarda las canciones activas en **Canciones**.
3. En **Sorteo de canciones**, genera y guarda la distribución. Una canción no se repite dentro de una ronda. Si cambias el sorteo después de guardar resultados, confirma el reinicio antes de continuar.
4. Durante una ronda, reproduce una audición, revisa las pizarras y guarda una respuesta por cada participante elegible. Los campos vacíos o incorrectos se guardan como error.
5. El botón **Siguiente** solo se habilita cuando las respuestas están guardadas y sin cambios pendientes. La ronda no puede finalizar hasta completar todas sus audiciones.
6. Al finalizar la ronda se calcula quién clasifica según su mínimo de aciertos, se actualizan los puntos y la ronda queda marcada como **Completada**. El panel permanece en esa ronda; selecciona manualmente la siguiente cuando quieras continuar. Para modificar una ronda cerrada, usa **Resetear ronda**, que también borra los datos de las rondas posteriores.
7. La línea de tiempo habilita la siguiente ronda solo después de cerrar la actual. Al avanzar, se cargan primero sus datos y se muestran únicamente quienes clasificaron. Las rondas anteriores se pueden consultar en modo de solo lectura; vuelve a la ronda activa para continuar reproduciendo y registrando respuestas.
8. El ranking muestra los resultados y el avance por cada ronda. Si dos participantes terminan con el mismo puntaje y llegaron a la misma ronda máxima, comparten puesto y premio de podio.

Al cambiar reglas o puntajes con actividad registrada, el panel solicitará confirmar el reinicio de respuestas y resultados. Cambiar parámetros de ronda también limpia el sorteo; cambiar solo los puntajes conserva el sorteo.

---

## ⚡ Configuración del Servicio de Datos

1. Prepara la base de datos con las tablas y campos descritos en este documento.
2. Configura el servicio de datos para leer y guardar la configuración, los participantes, las respuestas, los resultados y los registros de reproducción.
3. Configura los permisos de acceso para que la aplicación y la pantalla de proyección puedan comunicarse con el servicio.
4. Publica los cambios del servicio antes de iniciar el certamen. Después de cada actualización, verifica que la aplicación se conecte correctamente.

---

## 🎵 Archivos de Audio

1. Carga las pistas en el servicio de almacenamiento de archivos elegido.
2. Concede al servicio de datos permiso para obtener los archivos.
3. Copia el identificador o la dirección de cada archivo en el campo de archivo correspondiente de la tabla `Canciones`.

El panel envía la orden y registra el resultado, pero no reproduce audio ni controla su temporizador. La pantalla de proyección carga la pista, se posiciona en el segundo seleccionado antes de la cuenta regresiva de 5 segundos y controla la duración completa. La caché mantiene como máximo una pista.

---

## 🔗 Conexión de la Aplicación

Configura en `src/js/config.js` la dirección del servicio de datos. Verifica la conexión desde el entorno de prueba antes de publicar la aplicación.

---

## 🚀 Publicación

Publica la aplicación web mediante el servicio de alojamiento elegido. Si se publica dentro de una subcarpeta, configura la ruta base de la aplicación para que coincida con esa ubicación. Después de publicar, comprueba la página principal, el panel del jurado y la pantalla de proyección.

---

## 📺 Vista de Proyector

Para la pantalla gigante del auditorio:
- Accede a `proyector.html` (o haz clic en el botón **Abrir Proyector** en la cabecera).
- En esa computadora, pulsa una vez **Activar audio** para permitir la reproducción del navegador.
- Mantén esa página abierta durante el certamen. Al pulsar **Reproducir Audición** en el panel, la pantalla muestra la carga del archivo y, al terminar, la cuenta regresiva de 5 segundos antes de reproducir.
- El panel permite solicitar la detención y registra en la base de datos el rango y la duración reportados por el proyector.
- La pantalla cuenta con:
  - Temporizador gigante con tipografía clásica.
  - Indicador de estado en tiempo real (**EN VIVO**).
  - Podio superior animado (1°, 2° y 3° lugar).
  - Tabla completa de posiciones.
  - Botón de **Pantalla Completa** (o presiona F11).
  - Efecto de **Confeti** festivo al culminar el certamen.
  - Actualización automática cada 2 segundos, sin necesidad de recargar la página.

---

## 💾 Backup y Respaldo de Datos

- **Antes del evento:** Crea una copia de respaldo de la base de datos.
- **Durante el evento:** Al guardar respuestas o finalizar una ronda, la base de datos almacena los resultados con su fecha y hora.
- **En caso de interrupción del servicio de datos:**
  - Los datos locales se mantienen en memoria del navegador mientras no se cierre la pestaña.
  - Una vez restablecido el servicio, verifica que los datos pendientes se hayan guardado antes de continuar.

---

## 🛠 Troubleshooting

### 1. La aplicación no conecta con la base de datos
- **Causa:** La dirección o los permisos del servicio de datos no son correctos.
- **Solución:** Verifica la dirección configurada, los permisos de acceso y que la versión publicada del servicio esté disponible.

### 2. Los audios no suenan o quedan en carga
- Confirma que `proyector.html` esté abierto y que se haya pulsado **Activar audio** en esa computadora.
- Verifica que el archivo exista, que el servicio de datos tenga permiso para leerlo y que la conexión esté disponible.
- Revisa el mensaje de estado en la pantalla del proyector para identificar si falló la descarga, la decodificación o el inicio de reproducción.

### 3. La aplicación no aparece en la dirección publicada
- **Causa:** La ruta base configurada no coincide con la ubicación de publicación.
- **Solución:** Ajusta la ruta base para que corresponda a la dirección elegida y vuelve a publicar la aplicación.

---

*Desarrollado para el Certamen de Audición Musical 2026 • I.E.P. San Martín de Porres.*
