# 🔴 Pokédex Interactiva - Región Kanto

Una Pokédex moderna e interactiva que muestra los primeros 151 Pokémon de la región Kanto utilizando la PokéAPI.

## 🚀 Características

✅ **Listado paginado** - Visualiza los 151 Pokémon de Kanto con paginación (20 por página)
✅ **Búsqueda inteligente** - Busca por nombre o número de Pokémon
✅ **Vista detallada** - Información completa incluyendo:
  - Nombre y número de Pokédex
  - Imagen oficial de alta calidad
  - Tipos (Fuego, Agua, Planta, etc.)
  - Estadísticas base (HP, Ataque, Defensa, etc.)
  - Altura y peso
✅ **Diseño moderno** - Inspirado en la Pokédex clásica con tarjetas interactivas
✅ **Responsive** - Funciona perfectamente en móviles y tablets

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con gradientes y animaciones
- **JavaScript (ES6+)** - Lógica de la aplicación
- **PokéAPI** - API REST para datos de Pokémon

## 📂 Estructura del Proyecto

```
proyectatec/
├── index.html      # Estructura HTML principal
├── styles.css      # Estilos CSS con diseño de Pokédex
├── app.js          # Lógica JavaScript y llamadas a la API
└── README.md       # Este archivo
```

## 🎯 Cómo Usar

### Opción 1: Abrir directamente
1. Simplemente abre el archivo `index.html` en tu navegador
2. La Pokédex se cargará automáticamente

### Opción 2: Servidor local (recomendado)
Si tienes Python instalado:
```bash
# Python 3
python -m http.server 8000

# Luego abre http://localhost:8000 en tu navegador
```

Si tienes Node.js instalado:
```bash
npx serve

# O instala live-server globalmente
npm install -g live-server
live-server
```

## 📖 Uso de la Pokédex

1. **Ver la lista**: Al cargar, verás los primeros 20 Pokémon
2. **Navegar**: Usa los botones "Anterior" y "Siguiente" para ver más
3. **Buscar**: 
   - Escribe un nombre (ej: "pikachu")
   - O escribe un número (ej: "25")
   - Presiona Enter o haz clic en "Buscar"
4. **Ver detalles**: Haz clic en cualquier tarjeta de Pokémon
5. **Cerrar detalles**: Clic en el botón "✖ Cerrar", fuera del modal, o presiona ESC

## 🔌 Endpoints de PokéAPI Utilizados

### 1. Listado de Pokémon
```javascript
GET https://pokeapi.co/api/v2/pokemon?limit=151&offset=0

// Respuesta
{
  "results": [
    {
      "name": "bulbasaur",
      "url": "https://pokeapi.co/api/v2/pokemon/1/"
    },
    ...
  ]
}
```

### 2. Detalles de Pokémon
```javascript
GET https://pokeapi.co/api/v2/pokemon/{id or name}

// Ejemplo de procesamiento
const pokemonData = {
  id: response.id,
  name: response.name,
  image: response.sprites.other['official-artwork'].front_default,
  types: response.types.map(t => t.type.name),
  stats: response.stats.map(s => ({
    name: s.stat.name,
    value: s.base_stat
  })),
  height: response.height / 10,  // Convertir a metros
  weight: response.weight / 10   // Convertir a kg
};
```

## 💡 Conceptos Clave Implementados

### 1. Llamadas a API con Fetch
```javascript
async function fetchPokemonDetails(identifier) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${identifier}`);
  const data = await response.json();
  return data;
}
```

### 2. Procesamiento de JSON
```javascript
// Extraer imagen del sprite oficial
const image = pokemon.sprites.other['official-artwork'].front_default;

// Mapear tipos
const types = pokemon.types.map(typeInfo => typeInfo.type.name);

// Procesar estadísticas
const stats = pokemon.stats.map(stat => ({
  name: stat.stat.name,
  value: stat.base_stat
}));
```

### 3. Renderizado Dinámico
```javascript
function createPokemonCard(pokemon) {
  const card = document.createElement('div');
  card.className = 'pokemon-card';
  card.innerHTML = `
    <img src="${pokemon.image}" alt="${pokemon.name}">
    <div class="pokemon-name">${pokemon.name}</div>
  `;
  return card;
}
```

## 🎨 Personalización

### Cambiar colores por tipo
Edita en `styles.css` la sección de tipos:
```css
.type-fire { background: #F08030; }
.type-water { background: #6890F0; }
/* Añade o modifica según prefieras */
```

### Cambiar Pokémon por página
En `app.js`:
```javascript
const POKEMON_PER_PAGE = 20; // Cambia este número
```

### Incluir más generaciones
```javascript
const TOTAL_KANTO_POKEMON = 151; // Cambia a 251 para Johto, etc.
```

## 🐛 Solución de Problemas

**Problema**: Los Pokémon no cargan
- Verifica tu conexión a internet
- Revisa la consola del navegador (F12) para errores

**Problema**: Las imágenes no aparecen
- Algunas imágenes pueden tardar en cargar
- La API puede estar temporalmente lenta

**Problema**: Búsqueda no funciona
- Asegúrate de escribir el nombre completo en minúsculas
- Para búsqueda por ID, usa números del 1 al 151

## 📚 Recursos Adicionales

- [Documentación de PokéAPI](https://pokeapi.co/docs/v2)
- [Lista completa de Pokémon](https://pokeapi.co/api/v2/pokemon?limit=151)
- [MDN - Fetch API](https://developer.mozilla.org/es/docs/Web/API/Fetch_API)

## 🎓 Conceptos Aprendidos

- ✅ Consumo de APIs REST
- ✅ Manejo de promesas y async/await
- ✅ Procesamiento de datos JSON
- ✅ Renderizado dinámico del DOM
- ✅ Paginación de datos
- ✅ Búsqueda y filtrado
- ✅ Diseño responsive
- ✅ Eventos del usuario

## 📝 Licencia

Este proyecto es de código abierto y está disponible para propósitos educativos.

---

**Desarrollado con ❤️ usando JavaScript puro y PokéAPI**
