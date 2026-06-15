/** Utilidades compartidas — Librería Letras Vivas */

function formatPrecio(precio) {
  return '₡' + Number(precio).toLocaleString('es-CR');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getLibroById(id) {
  return LIBROS.find(function (libro) {
    return libro.id === Number(id);
  });
}

function getCategorias() {
  const categorias = LIBROS.map(function (libro) {
    return libro.categoria;
  });
  return [...new Set(categorias)].sort();
}

function getIdiomas() {
  const idiomas = LIBROS.map(function (libro) {
    return libro.idioma;
  });
  return [...new Set(idiomas)].sort();
}

function buscarLibros(termino) {
  const query = (termino || '').trim().toLowerCase();
  if (!query) {
    return LIBROS;
  }
  return LIBROS.filter(function (libro) {
    const texto = [
      libro.titulo,
      libro.autor,
      libro.categoria,
      libro.editorial,
      libro.descripcion
    ].join(' ').toLowerCase();
    return texto.includes(query);
  });
}

function getLibrosRelacionados(libro, limite) {
  return LIBROS.filter(function (item) {
    return item.categoria === libro.categoria && item.id !== libro.id;
  }).slice(0, limite || 4);
}

function renderBookCard(libro) {
  return (
    '<div class="col-6 col-md-4 col-lg-3">' +
      '<div class="card lv-book-card h-100">' +
        '<img src="' + escapeHtml(libro.imagen) + '" class="card-img-top lv-book-cover" alt="' + escapeHtml(libro.titulo) + '" onerror="this.src=\'images/placeholder.svg\'" />' +
        '<div class="card-body d-flex flex-column">' +
          '<h3 class="card-title h6 lv-book-title">' + escapeHtml(libro.titulo) + '</h3>' +
          '<p class="card-text text-muted small mb-1">' + escapeHtml(libro.autor) + '</p>' +
          '<span class="badge text-bg-secondary mb-2">' + escapeHtml(libro.categoria) + '</span>' +
          '<div class="mt-auto d-flex justify-content-between align-items-center">' +
            '<span class="lv-price">' + formatPrecio(libro.precio) + '</span>' +
            '<a href="libros/libro-' + libro.id + '.html" class="btn btn-outline-primary btn-sm">Detalle</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
}

function renderBookGrid(libros) {
  if (!libros.length) {
    return '<div class="col-12"><div class="alert alert-warning">No se encontraron libros.</div></div>';
  }
  return libros.map(renderBookCard).join('');
}

function getQueryParam(nombre) {
  return new URLSearchParams(window.location.search).get(nombre);
}

function initIndex() {
  const destacados = document.getElementById('libros-destacados');
  const categorias = document.getElementById('categorias-principales');
  if (destacados) {
    const ids = [1, 7, 9, 4];
    const libros = ids.map(getLibroById).filter(Boolean);
    destacados.innerHTML = renderBookGrid(libros);
  }
  if (categorias) {
    const iconos = {
      'Novela': 'bi-book',
      'Fantasía': 'bi-stars',
      'Ciencia ficción': 'bi-rocket-takeoff',
      'Romance': 'bi-heart',
      'Infantil': 'bi-emoji-smile',
      'Autoayuda': 'bi-lightbulb',
      'Historia': 'bi-clock-history',
      'Suspenso': 'bi-search',
      'Terror': 'bi-moon',
      'Tecnología': 'bi-cpu',
      'Educación': 'bi-mortarboard'
    };
    categorias.innerHTML = getCategorias().map(function (cat) {
      const icono = iconos[cat] || 'bi-bookmark';
      return (
        '<div class="col-6 col-md-4 col-lg-2">' +
          '<a href="libros/index.html" class="lv-cat-tile text-decoration-none">' +
            '<i class="bi ' + icono + ' fs-2"></i>' +
            '<span>' + escapeHtml(cat) + '</span>' +
          '</a>' +
        '</div>'
      );
    }).join('');
  }
}

function initCatalogo() {
  const grid = document.getElementById('catalogo-grid');
  const paginacion = document.getElementById('catalogo-paginacion');
  const filtroCategoria = document.getElementById('filtro-categoria');
  const filtroIdioma = document.getElementById('filtro-idioma');
  const filtroAutor = document.getElementById('filtro-autor');
  const form = document.getElementById('filtros-form');
  if (!grid) {
    return;
  }
  const porPagina = 9;
  let paginaActual = Number(getQueryParam('pagina')) || 1;
  const categoriaUrl = getQueryParam('categoria');
  if (categoriaUrl && filtroCategoria) {
    filtroCategoria.value = categoriaUrl;
  }
  function aplicarFiltros() {
    let resultados = LIBROS.slice();
    const categoria = filtroCategoria ? filtroCategoria.value : '';
    const idioma = filtroIdioma ? filtroIdioma.value : '';
    const autor = filtroAutor ? filtroAutor.value.trim().toLowerCase() : '';
    if (categoria) {
      resultados = resultados.filter(function (l) { return l.categoria === categoria; });
    }
    if (idioma) {
      resultados = resultados.filter(function (l) { return l.idioma === idioma; });
    }
    if (autor) {
      resultados = resultados.filter(function (l) { return l.autor.toLowerCase().includes(autor); });
    }
    return resultados;
  }
  function renderPagina() {
    const resultados = aplicarFiltros();
    const totalPaginas = Math.max(1, Math.ceil(resultados.length / porPagina));
    if (paginaActual > totalPaginas) {
      paginaActual = 1;
    }
    const inicio = (paginaActual - 1) * porPagina;
    const pagina = resultados.slice(inicio, inicio + porPagina);
    grid.innerHTML = renderBookGrid(pagina);
    if (paginacion) {
      let html = '';
      for (let i = 1; i <= totalPaginas; i++) {
        html += '<li class="page-item' + (i === paginaActual ? ' active' : '') + '">' +
          '<a class="page-link" href="#" data-page="' + i + '">' + i + '</a></li>';
      }
      paginacion.innerHTML = html;
      paginacion.querySelectorAll('[data-page]').forEach(function (link) {
        link.addEventListener('click', function (event) {
          event.preventDefault();
          paginaActual = Number(link.dataset.page);
          renderPagina();
        });
      });
    }
  }
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      paginaActual = 1;
      renderPagina();
    });
  }
  renderPagina();
}

function initBusqueda() {
  const grid = document.getElementById('busqueda-grid');
  const titulo = document.getElementById('busqueda-titulo');
  const contador = document.getElementById('busqueda-contador');
  const input = document.getElementById('busqueda-input-main') || document.getElementById('busqueda-input');
  const termino = getQueryParam('q') || (input ? input.value : '');
  if (input && termino) {
    input.value = termino;
  }
  const headerInput = document.querySelector('header input[name="q"]');
  if (headerInput && termino) {
    headerInput.value = termino;
  }
  const resultados = buscarLibros(termino);
  if (titulo) {
    titulo.textContent = termino ? 'Resultados para: «' + termino + '»' : 'Todos los libros';
  }
  if (contador) {
    contador.textContent = 'Se encontraron ' + resultados.length + ' resultados';
  }
  if (grid) {
    grid.innerHTML = renderBookGrid(resultados);
  }
}

function initDetalle() {
  const contenedor = document.getElementById('detalle-contenido');
  const relacionados = document.getElementById('libros-relacionados');
  const id = getQueryParam('id') || '7';
  const libro = getLibroById(id);
  if (!libro || !contenedor) {
    if (contenedor) {
      contenedor.innerHTML = '<div class="alert alert-danger">Libro no encontrado.</div>';
    }
    return;
  }
  document.title = 'Librería Letras Vivas | ' + libro.titulo;
  const breadcrumb = document.getElementById('detalle-breadcrumb');
  if (breadcrumb) {
    breadcrumb.textContent = libro.titulo;
  }
  contenedor.innerHTML =
    '<div class="col-md-4 text-center mb-4 mb-md-0">' +
      '<img src="' + escapeHtml(libro.imagen) + '" class="img-fluid rounded shadow lv-detail-cover" alt="' + escapeHtml(libro.titulo) + '" onerror="this.src=\'images/placeholder.svg\'" />' +
    '</div>' +
    '<div class="col-md-8">' +
      '<h1 class="h2">' + escapeHtml(libro.titulo) + '</h1>' +
      '<p class="lead text-muted">' + escapeHtml(libro.autor) + '</p>' +
      '<p class="lv-price fs-3">' + formatPrecio(libro.precio) + '</p>' +
      '<span class="badge text-bg-success mb-3">' + escapeHtml(libro.estado) + ' (Stock: ' + libro.stock + ')</span>' +
      '<div class="row g-2 align-items-end mb-4">' +
        '<div class="col-auto"><label class="form-label">Cantidad</label><input type="number" class="form-control" min="1" value="1" style="width:90px" /></div>' +
        '<div class="col-auto"><a href="carrito.html" class="btn btn-danger"><i class="bi bi-cart-plus"></i> Agregar al carrito</a></div>' +
      '</div>' +
      '<table class="table table-sm">' +
        '<tr><th>Editorial</th><td>' + escapeHtml(libro.editorial) + '</td></tr>' +
        '<tr><th>Categoría</th><td>' + escapeHtml(libro.categoria) + '</td></tr>' +
        '<tr><th>Idioma</th><td>' + escapeHtml(libro.idioma) + '</td></tr>' +
        '<tr><th>Formato</th><td>' + escapeHtml(libro.formato) + ' — ' + libro.paginas + ' páginas</td></tr>' +
        '<tr><th>ISBN</th><td>' + escapeHtml(libro.isbn) + '</td></tr>' +
        '<tr><th>Año</th><td>' + libro.anio + '</td></tr>' +
      '</table>' +
    '</div>' +
    '<div class="col-12 mt-4">' +
      '<ul class="nav nav-tabs" role="tablist">' +
        '<li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#desc" type="button">Descripción</button></li>' +
        '<li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#det" type="button">Detalles</button></li>' +
      '</ul>' +
      '<div class="tab-content border border-top-0 p-3 bg-white rounded-bottom">' +
        '<div class="tab-pane fade show active" id="desc"><p>' + escapeHtml(libro.descripcion) + '</p></div>' +
        '<div class="tab-pane fade" id="det">' +
          '<div class="accordion" id="accordionDetalle">' +
            '<div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#envio">Información de envío</button></h2>' +
            '<div id="envio" class="accordion-collapse collapse show" data-bs-parent="#accordionDetalle"><div class="accordion-body">Envío a todo Costa Rica en 2 a 4 días hábiles.</div></div></div>' +
            '<div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#autor">Sobre el autor</button></h2>' +
            '<div id="autor" class="accordion-collapse collapse" data-bs-parent="#accordionDetalle"><div class="accordion-body">' + escapeHtml(libro.autor) + ' — autor destacado en la categoría ' + escapeHtml(libro.categoria) + '.</div></div></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  if (relacionados) {
    relacionados.innerHTML = renderBookGrid(getLibrosRelacionados(libro, 4));
  }
}

function initCarrito() {
  const tbody = document.getElementById('carrito-body');
  const subtotalEl = document.getElementById('carrito-subtotal');
  const totalEl = document.getElementById('carrito-total');
  if (!tbody) {
    return;
  }
  const items = CARRITO_DEMO.map(getLibroById).filter(Boolean);
  let subtotal = 0;
  tbody.innerHTML = items.map(function (libro) {
    subtotal += libro.precio;
    return (
      '<tr>' +
        '<td><div class="d-flex align-items-center gap-2">' +
          '<img src="' + escapeHtml(libro.imagen) + '" width="50" height="70" class="object-fit-cover rounded" alt="" onerror="this.src=\'images/placeholder.svg\'" />' +
          '<div><strong>' + escapeHtml(libro.titulo) + '</strong><br><small class="text-muted">' + escapeHtml(libro.autor) + '</small></div>' +
        '</div></td>' +
        '<td class="text-center">' + formatPrecio(libro.precio) + '</td>' +
        '<td class="text-center"><input type="number" class="form-control form-control-sm mx-auto" style="width:70px" min="1" value="1" /></td>' +
        '<td class="text-end">' + formatPrecio(libro.precio) + '</td>' +
        '<td class="text-end"><button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button></td>' +
      '</tr>'
    );
  }).join('');
  const envio = 2000;
  if (subtotalEl) {
    subtotalEl.textContent = formatPrecio(subtotal);
  }
  if (totalEl) {
    totalEl.textContent = formatPrecio(subtotal + envio);
  }
  const badge = document.getElementById('carrito-badge');
  if (badge) {
    badge.textContent = String(items.length);
  }
}

function initFacturacion() {
  const lista = document.getElementById('facturacion-items');
  const subtotalEl = document.getElementById('facturacion-subtotal');
  const totalEl = document.getElementById('facturacion-total');
  if (!lista) {
    return;
  }
  const items = CARRITO_DEMO.map(getLibroById).filter(Boolean);
  let subtotal = 0;
  lista.innerHTML = items.map(function (libro) {
    subtotal += libro.precio;
    return '<tr><td>' + escapeHtml(libro.titulo) + '</td><td class="text-end">' + formatPrecio(libro.precio) + '</td></tr>';
  }).join('');
  const envio = 2000;
  if (subtotalEl) {
    subtotalEl.textContent = formatPrecio(subtotal);
  }
  if (totalEl) {
    totalEl.textContent = formatPrecio(subtotal + envio);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const page = document.body.dataset.page;
  if (page === 'index') initIndex();
  if (page === 'catalogo') initCatalogo();
  if (page === 'busqueda') initBusqueda();
  if (page === 'detalle') initDetalle();
  if (page === 'carrito') initCarrito();
  if (page === 'facturacion') initFacturacion();
});
