# Librería Letras Vivas — Prototipo (Proyecto 2)

Prototipo HTML de una tienda en línea de libros, codificado a partir de los bosquejos
de pantalla del Proyecto 1. Implementa los principios de diseño estudiados en el curso:
cabeceras de página, navegación global, migas de pan, búsqueda, columna lateral de
categorías, pie de página y páginas de comercio electrónico con formularios.

## Framework CSS utilizado

**UIKit 3** (cargado por CDN). Se eligió entre Skeleton, Milligram y UIKit por ser el
más completo: aporta de forma nativa los componentes que pide el enunciado
(navbar, breadcrumb, cards, grid, paginación, tabs, accordion, slideshow y formularios).

## Páginas del prototipo

| Archivo            | Tipo de página            | Mecanismos aplicados                                        |
|--------------------|---------------------------|------------------------------------------------------------|
| `index.html`       | Inicio                    | Cabecera, navegación global, hero/carrusel, rejilla         |
| `catalogo.html`    | Navegación por categorías | Columna lateral de filtros, rejilla, paginación             |
| `busqueda.html`    | Búsqueda                  | Campo de palabras clave, lista de resultados, paginación    |
| `detalle.html`     | Contenido                 | Tarjetas, pestañas, acordeón, navegación asociativa         |
| `carrito.html`     | Comercio electrónico      | Tabla de productos y resumen de compra                      |
| `facturacion.html` | Comercio electrónico      | Formularios estructurados (datos, dirección, entrega, pago) |

## Elementos transversales

- **Cabecera**: enlace a inicio (logo), búsqueda y acceso al carrito.
- **Navegación global**: Inicio, Catálogo, Categorías, Autores, Novedades, Contacto.
- **Migas de pan**: presentes en todas las páginas internas.
- **Columna lateral**: filtros por categoría, idioma y precio en el catálogo.
- **Pie de página**: autor, contactos y derechos de autor.

## Cómo ejecutarlo localmente

Abra `index.html` en el navegador, o sirva la carpeta:

```bash
cd libreria-letras-vivas
python3 -m http.server 8000
# Visite http://localhost:8000
```

## Publicación

El prototipo se publica como sitio estático. Puede subirse a GitHub Pages, Netlify
o Vercel arrastrando la carpeta.

**Enlace al sitio publicado:** _<pendiente de publicar — colocar aquí la URL>_
