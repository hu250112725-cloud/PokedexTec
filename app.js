// ===========================
// CONFIGURACIÓN Y VARIABLES
// ===========================
const API_BASE_URL = 'https://pokeapi.co/api/v2';
const TOTAL_POKEMON = 1025; // Pokédex completa hasta Gen 9
const POKEMON_PER_PAGE = 20;

// Generaciones de Pokémon
const GENERATIONS = {
    all: { name: 'Todas', start: 1, end: 1025 },
    gen1: { name: 'Kanto', start: 1, end: 151 },
    gen2: { name: 'Johto', start: 152, end: 251 },
    gen3: { name: 'Hoenn', start: 252, end: 386 },
    gen4: { name: 'Sinnoh', start: 387, end: 493 },
    gen5: { name: 'Unova', start: 494, end: 649 },
    gen6: { name: 'Kalos', start: 650, end: 721 },
    gen7: { name: 'Alola', start: 722, end: 809 },
    gen8: { name: 'Galar', start: 810, end: 905 },
    gen9: { name: 'Paldea', start: 906, end: 1025 }
};

let currentPage = 1;
let allPokemon = [];
let displayedPokemon = [];
let currentGeneration = 'all';

// ===========================
// ELEMENTOS DEL DOM
// ===========================
const elements = {
    pokemonList: document.getElementById('pokemonList'),
    pokemonDetail: document.getElementById('pokemonDetail'),
    detailContent: document.getElementById('detailContent'),
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    clearBtn: document.getElementById('clearBtn'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    pageInfo: document.getElementById('pageInfo'),
    paginationInfo: document.getElementById('paginationInfo'),
    closeDetailBtn: document.getElementById('closeDetailBtn'),
    genFilter: document.getElementById('genFilter')
};

// ===========================
// FUNCIONES DE API
// ===========================

/**
 * Obtiene la lista de Pokémon de Kanto (primeros 151)
 * Endpoint: /api/v2/pokemon/?limit=151&offset=0
 */
async function fetchKantoPokemonList() {
    try {
        showListLoading(true);
        
        const gen = GENERATIONS[currentGeneration];
        const limit = gen.end - gen.start + 1;
        const offset = gen.start - 1;
        
        const response = await fetch(`${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
        
        if (!response.ok) {
            throw new Error('Error al obtener la lista de Pokémon');
        }
        
        const data = await response.json();
        
        // Procesar la respuesta para obtener información básica
        allPokemon = data.results.map((pokemon, index) => ({
            id: gen.start + index,
            name: pokemon.name,
            url: pokemon.url
        }));
        
        displayedPokemon = [...allPokemon];
        currentPage = 1;
        renderPokemonList();
        
    } catch (error) {
        console.error('Error:', error);
        showError('Error al cargar la Pokédex. Por favor, intenta de nuevo.');
    } finally {
        showListLoading(false);
    }
}

/**
 * Obtiene los detalles completos de un Pokémon específico
 * Endpoint: /api/v2/pokemon/{id or name}
 * @param {string|number} identifier - Nombre o ID del Pokémon
 */
async function fetchPokemonDetails(identifier) {
    try {
        // Mostrar modal con skeleton mientras se cargan los datos
        showDetailLoading();
        
        const response = await fetch(`${API_BASE_URL}/pokemon/${identifier}`);
        
        if (!response.ok) {
            throw new Error('Pokémon no encontrado');
        }
        
        const pokemon = await response.json();
        
        // Obtener descripción del species endpoint
        const speciesResponse = await fetch(pokemon.species.url);
        const speciesData = await speciesResponse.json();
        
        // Buscar descripción en español, si no, en inglés
        const flavorTextEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'es') ||
                                speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
        
        const description = flavorTextEntry 
            ? flavorTextEntry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ')
            : 'No hay descripción disponible.';
        
        // Procesar la respuesta JSON
        const pokemonData = {
            id: pokemon.id,
            name: pokemon.name,
            // Imagen oficial (sprite principal)
            image: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default,
            // Tipos (puede tener 1 o 2 tipos)
            types: pokemon.types.map(typeInfo => typeInfo.type.name),
            // Estadísticas base
            stats: pokemon.stats.map(stat => ({
                name: stat.stat.name,
                value: stat.base_stat
            })),
            // Altura (en decímetros, convertir a metros)
            height: pokemon.height / 10,
            // Peso (en hectogramos, convertir a kilogramos)
            weight: pokemon.weight / 10,
            // Habilidades
            abilities: pokemon.abilities.map(ability => ability.ability.name),
            // Descripción
            description: description,
            // Categoría/género
            genus: speciesData.genera.find(g => g.language.name === 'es')?.genus || 
                   speciesData.genera.find(g => g.language.name === 'en')?.genus || 'Pokémon'
        };
        
        showPokemonDetail(pokemonData);
        
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo cargar la información del Pokémon. Verifica que el nombre o ID sea correcto.');
        closeDetail();
    } finally {
        // No-op, el skeleton del detalle se reemplaza al renderizar
    }
}

// ===========================
// FUNCIONES DE RENDERIZADO
// ===========================

/**
 * Renderiza la lista de Pokémon con paginación
 */
function renderPokemonList() {
    elements.pokemonList.innerHTML = '';
    
    if (displayedPokemon.length === 0) {
        elements.pokemonList.innerHTML = `
            <div class="no-results">
                <h3>No se encontraron Pokémon</h3>
                <p>Intenta con otro nombre o número</p>
            </div>
        `;
        updatePaginationInfo();
        return;
    }
    
    // Calcular el rango de Pokémon a mostrar
    const startIndex = (currentPage - 1) * POKEMON_PER_PAGE;
    const endIndex = startIndex + POKEMON_PER_PAGE;
    const pokemonToShow = displayedPokemon.slice(startIndex, endIndex);
    
    // Crear las tarjetas de Pokémon con animación escalonada
    pokemonToShow.forEach((pokemon, index) => {
        const card = createPokemonCard(pokemon);
        card.style.animationDelay = `${index * 0.05}s`;
        elements.pokemonList.appendChild(card);
    });
    
    // Cargar las imágenes y tipos de cada Pokémon
    pokemonToShow.forEach(pokemon => {
        loadPokemonCardData(pokemon);
    });
    
    // Agregar efecto de seguimiento del mouse en las tarjetas
    addCardMouseEffect();
    
    updatePaginationInfo();
}

/**
 * Crea una tarjeta de Pokémon (inicialmente sin imagen ni tipos)
 */
function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.className = 'pokemon-card';
    card.dataset.pokemonId = pokemon.id;
    
    card.innerHTML = `
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png" 
             alt="${pokemon.name}"
             loading="lazy">
        <div class="pokemon-number">#${String(pokemon.id).padStart(3, '0')}</div>
        <div class="pokemon-name">${pokemon.name}</div>
        <div class="pokemon-types" data-pokemon-id="${pokemon.id}">
            <span style="color: #999;">Cargando...</span>
        </div>
    `;
    
    card.addEventListener('click', () => fetchPokemonDetails(pokemon.id));
    
    return card;
}

/**
 * Carga los datos adicionales de la tarjeta (tipos)
 */
async function loadPokemonCardData(pokemon) {
    try {
        const response = await fetch(`${API_BASE_URL}/pokemon/${pokemon.id}`);
        const data = await response.json();
        
        // Actualizar los tipos
        const typesContainer = document.querySelector(`.pokemon-types[data-pokemon-id="${pokemon.id}"]`);
        if (typesContainer) {
            typesContainer.innerHTML = data.types
                .map(typeInfo => `<span class="type-badge type-${typeInfo.type.name}">${typeInfo.type.name}</span>`)
                .join('');
        }
    } catch (error) {
        console.error(`Error al cargar datos de ${pokemon.name}:`, error);
    }
}

/**
 * Muestra los detalles completos de un Pokémon
 */
function showPokemonDetail(pokemon) {
    const statsHTML = pokemon.stats.map((stat, index) => {
        const percentage = (stat.value / 255) * 100; // Max stat es ~255
        return `
            <div class="stat-item" style="animation: fadeInUp 0.4s ease-out ${0.1 + index * 0.05}s both;">
                <div class="stat-header">
                    <span class="stat-name">${formatStatName(stat.name)}</span>
                    <span class="stat-value">${stat.value}</span>
                </div>
                <div class="stat-bar">
                    <div class="stat-bar-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    }).join('');
    
    elements.detailContent.innerHTML = `
        <div class="detail-header-info" style="animation: fadeInUp 0.4s ease-out;">
            <div class="detail-pokemon-name">${pokemon.name}</div>
            <div class="detail-pokemon-number">#${String(pokemon.id).padStart(4, '0')}</div>
            <div class="detail-pokemon-genus">${pokemon.genus}</div>
        </div>
        
        <img src="${pokemon.image}" alt="${pokemon.name}" class="detail-pokemon-image" style="animation: fadeInUp 0.4s ease-out 0.1s both;">
        
        <div class="detail-types">
            ${pokemon.types.map(type => `<span class="type-badge type-${type}">${type}</span>`).join('')}
        </div>
        
        <div class="detail-description" style="animation: fadeInUp 0.4s ease-out 0.15s both;">
            <div class="rotom-screen">
                <p>${pokemon.description}</p>
            </div>
        </div>
        
        <div class="detail-info-grid" style="animation: fadeInUp 0.4s ease-out 0.2s both;">
            <div class="info-item">
                <div class="info-label">Altura</div>
                <div class="info-value">${pokemon.height} m</div>
            </div>
            <div class="info-item">
                <div class="info-label">Peso</div>
                <div class="info-value">${pokemon.weight} kg</div>
            </div>
        </div>
        
        <div class="detail-stats" style="animation: fadeInUp 0.4s ease-out 0.3s both;">
            <h3>📊 Estadísticas Base</h3>
            ${statsHTML}
        </div>
    `;
    
    elements.pokemonDetail.classList.remove('hidden');
}

/**
 * Formatea los nombres de las estadísticas
 */
function formatStatName(statName) {
    const statNames = {
        'hp': 'HP',
        'attack': 'Ataque',
        'defense': 'Defensa',
        'special-attack': 'Atq. Esp.',
        'special-defense': 'Def. Esp.',
        'speed': 'Velocidad'
    };
    return statNames[statName] || statName;
}

// ===========================
// FUNCIONES DE BÚSQUEDA
// ===========================

/**
 * Busca un Pokémon por nombre o ID
 */
function searchPokemon() {
    const searchTerm = elements.searchInput.value.trim().toLowerCase();
    
    if (!searchTerm) {
        // Si está vacío, mostrar todos
        displayedPokemon = [...allPokemon];
        currentPage = 1;
        renderPokemonList();
        return;
    }
    
    // Verificar si es un número (ID) o un nombre
    const isNumeric = /^\d+$/.test(searchTerm);
    
    if (isNumeric) {
        const pokemonId = parseInt(searchTerm);
        if (pokemonId >= 1 && pokemonId <= 151) {
            // Buscar por ID directamente
            fetchPokemonDetails(pokemonId);
        } else {
            alert('Por favor, ingresa un número entre 1 y 151');
        }
    } else {
        // Buscar por nombre en la lista local
        const filtered = allPokemon.filter(p => p.name.includes(searchTerm));
        
        if (filtered.length === 1) {
            // Si hay solo un resultado, mostrar el detalle
            fetchPokemonDetails(filtered[0].id);
        } else if (filtered.length > 1) {
            // Si hay varios, mostrar la lista filtrada
            displayedPokemon = filtered;
            currentPage = 1;
            renderPokemonList();
        } else {
            // Intentar buscar directamente en la API
            fetchPokemonDetails(searchTerm);
        }
    }
}

/**
 * Limpia la búsqueda y muestra todos los Pokémon
 */
function clearSearch() {
    elements.searchInput.value = '';
    displayedPokemon = [...allPokemon];
    currentPage = 1;
    renderPokemonList();
}

// ===========================
// FUNCIONES DE PAGINACIÓN
// ===========================

/**
 * Actualiza la información de paginación
 */
function updatePaginationInfo() {
    const totalPages = Math.ceil(displayedPokemon.length / POKEMON_PER_PAGE);
    const startPokemon = (currentPage - 1) * POKEMON_PER_PAGE + 1;
    const endPokemon = Math.min(currentPage * POKEMON_PER_PAGE, displayedPokemon.length);
    
    elements.pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    elements.paginationInfo.textContent = `Mostrando ${startPokemon}-${endPokemon} de ${displayedPokemon.length} Pokémon`;
    
    elements.prevBtn.disabled = currentPage === 1;
    elements.nextBtn.disabled = currentPage >= totalPages;
}

/**
 * Navega a la página anterior
 */
function goToPreviousPage() {
    if (currentPage > 1) {
        currentPage--;
        renderPokemonList();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * Navega a la página siguiente
 */
function goToNextPage() {
    const totalPages = Math.ceil(displayedPokemon.length / POKEMON_PER_PAGE);
    if (currentPage < totalPages) {
        currentPage++;
        renderPokemonList();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ===========================
// FUNCIONES DE UI
// ===========================

/**
 * Agrega efecto de seguimiento del mouse en las tarjetas
 */
function addCardMouseEffect() {
    const cards = document.querySelectorAll('.pokemon-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });
}

/**
 * Muestra un mensaje de error
 */
function showError(message) {
    elements.pokemonList.innerHTML = `
        <div class="error-message">
            <h3>⚠️ Error</h3>
            <p>${message}</p>
        </div>
    `;
}

/**
 * Cierra la vista de detalle
 */
function closeDetail() {
    elements.pokemonDetail.classList.add('hidden');
}

// ===========================
// SKELETON LOADERS (Profesional)
// ===========================

function showListLoading(show) {
    if (show) {
        const count = POKEMON_PER_PAGE;
        const frag = document.createDocumentFragment();
        for (let i = 0; i < count; i++) {
            const card = document.createElement('div');
            card.className = 'skeleton-card';
            card.innerHTML = `
                <div class="skeleton skeleton-img"></div>
                <div class="skeleton skeleton-line" style="width:40%"></div>
                <div class="skeleton skeleton-line" style="width:60%"></div>
            `;
            frag.appendChild(card);
        }
        elements.pokemonList.innerHTML = '';
        elements.pokemonList.appendChild(frag);
    } else {
        // no-op; la lista real se renderiza en renderPokemonList
    }
}

function showDetailLoading() {
    elements.detailContent.innerHTML = `
        <div class="detail-header-info">
            <div class="skeleton" style="height:28px; width:200px; margin:0 auto 8px; border-radius:8px;"></div>
            <div class="skeleton" style="height:16px; width:120px; margin:0 auto; border-radius:8px;"></div>
        </div>
        <div class="skeleton" style="width:220px; height:220px; margin:20px auto; border-radius:12px;"></div>
        <div class="detail-types" style="gap:8px;">
            <div class="skeleton" style="height:28px; width:90px; border-radius:999px;"></div>
            <div class="skeleton" style="height:28px; width:90px; border-radius:999px;"></div>
        </div>
        <div class="detail-info-grid">
            <div class="info-item"><div class="skeleton" style="height:18px; width:60%; border-radius:6px;"></div><div class="skeleton" style="height:24px; width:80%; margin-top:8px; border-radius:6px;"></div></div>
            <div class="info-item"><div class="skeleton" style="height:18px; width:60%; border-radius:6px;"></div><div class="skeleton" style="height:24px; width:80%; margin-top:8px; border-radius:6px;"></div></div>
        </div>
        <div class="detail-stats">
            <h3 style="margin-bottom:12px;">📊 Estadísticas Base</h3>
            ${Array.from({length: 3}).map(() => `
                <div class="stat-item">
                    <div class="stat-header">
                        <span class="skeleton" style="height:14px; width:100px; border-radius:6px;"></span>
                        <span class="skeleton" style="height:14px; width:40px; border-radius:6px;"></span>
                    </div>
                    <div class="stat-bar"><div class="skeleton" style="height:100%; width:100%;"></div></div>
                </div>
            `).join('')}
        </div>
    `;
    elements.pokemonDetail.classList.remove('hidden');
}

// ===========================
// EVENT LISTENERS
// ===========================
elements.searchBtn.addEventListener('click', searchPokemon);
elements.clearBtn.addEventListener('click', clearSearch);
elements.searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchPokemon();
    }
});

elements.prevBtn.addEventListener('click', goToPreviousPage);
elements.nextBtn.addEventListener('click', goToNextPage);
elements.closeDetailBtn.addEventListener('click', closeDetail);

// Filtro de generaciones
if (elements.genFilter) {
    elements.genFilter.addEventListener('change', (e) => {
        currentGeneration = e.target.value;
        fetchKantoPokemonList();
    });
}

// Cerrar detalle al hacer clic fuera del contenido
elements.pokemonDetail.addEventListener('click', (e) => {
    if (e.target === elements.pokemonDetail) {
        closeDetail();
    }
});

// Cerrar detalle con la tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !elements.pokemonDetail.classList.contains('hidden')) {
        closeDetail();
    }
});

// ===========================
// INICIALIZACIÓN
// ===========================

/**
 * Inicializa la aplicación al cargar la página
 */
function init() {
    console.log('🔴 Pokédex Kanto - Iniciando...');
    console.log('📡 Conectando con PokéAPI...');
    fetchKantoPokemonList();
}

// Iniciar la aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
