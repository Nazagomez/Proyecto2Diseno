# Librería Letras Vivas — Prototipo (Proyecto 2)

Prototipo HTML de una tienda en línea de libros con **Bootstrap 5** y datos del catálogo quemados en `js/libros.js` (fuente: `catalogo_libros_organizado.xlsx`).

## Framework CSS

**Bootstrap 5** (CDN) + estilos propios en `css/styles.css`.

## Estructura

| Archivo | Descripción |
|---------|-------------|
| `index.html` | Inicio con carrusel, categorías y destacados |
| `catalogo.html` | 30 libros con filtros y paginación |
| `busqueda.html` | Búsqueda por palabras clave |
| `detalle.html?id=N` | Ficha del libro, pestañas y acordeón |
| `carrito.html` | Carrito con 3 productos del catálogo |
| `facturacion.html` | Formulario de facturación y entrega |
| `js/libros.js` | **Datos quemados** de los 30 libros |
| `js/app.js` | Renderizado y utilidades |

## Cómo ejecutarlo

```bash
cd libreria-letras-vivas
python3 -m http.server 8000
# Visite http://localhost:8000
```

O abra `index.html` directamente en el navegador.
