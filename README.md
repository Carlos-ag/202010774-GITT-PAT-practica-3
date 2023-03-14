# Stockify

## Práctica 3:
En esta práctica se han implementado varias funcionalidades en la página web Stockify:
- Se han añadido varias APIs:
    - API de buscador de acciones con autocompletado
    - API de noticias de acciones
    - API de cotización de acciones
- Se ha refactorizado el código para que sea más legible y mantenible. Cuando se cambia de página el header, la sidebar y el footer no se recargan, y solo se recarga el centro de la página.
- En la cotización de las acciones se ha añadido un gráfico con la evolución temporal y un botón para poder seleccionar el periodo de tiempo que se quiere visualizar.
- Se han añadido gestión de errores de las APIs, ya que al ser gratuitas, disponen de un límite de peticiones, que se alcanza muy rápido. Para intentar solucionarlo se ha implementado un sistema que dispone de varias API keys y que en caso de que una de ellas se quede sin peticiones, se cambia a otra automáticamente. Aún así, si se llega al límite de peticiones de todas las API keys, se muestra un mensaje de error.
- Se ha mejorado la web en el móvil y ahora está más bonita.

## Uso:
Para visualizar la página web desde un navegador se puede acceder al siguiente enlace [Stockify](https://carlos-ag.github.io/202010774-GITT-PAT-practica-3/Stockify/html/index.html)

## Documentación:
Para editarla la página web en VSCODE, hay que abrir la carpeta Stockify, que no incluye el README.md.



## Práctica 2:

### Introducción:
Está página web está siendo realizada en el cuadro de PROGRAMACIÓN DE APLICACIONES TELEMÁTICAS. 

La utilidad de la página es el de facilitar información al usuario sobre su cartera de acciones y permitirle en unos minutos tener un resumen de la evolución de esta en los últimos días/meses/años. 

La página web funciona tanto en ordenadores como en dispositivos móviles y además es responsive, es decir, se adapta al tamaño de la pantalla del dispositivo en el que se visualiza. Verá que los colores del header también cambian para que quede bonita en cualquier dispositivo.

Las técnologías usadas por el momento son HTML, CSS, Javascript, Python y Plotly.

Para familiarizarnos con los frameworks, hemos incluido Bootstrap en la página de login.

También se ha usado SASS para facilitar el desarrollo de los archivos CSS. Para ello se ha usado la extensión de VSCode llamada Live Sass Compiler, que compila los archivos SASS a CSS en tiempo real. Se ha configurado esta extensión para que guarde los archivos en la carpeta CSS (y no en la carpeta SASS).

### Instalación:
Necesita un editor de texto como puede ser VSCode y un navegador para visualizar la página web.
Si lo desea para facilitar el desarrollo de la página web puede la extensión de VSCode llamada Live Server que sirve para ver en directo los cambios realizados en el HTML sin necesidad de recargar la página web. También recomendamos el uso de Live Sass Compiler para facilitar el desarrollo de los archivos CSS ya que compila los archivos SASS a CSS en tiempo real.
