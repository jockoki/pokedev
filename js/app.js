const search = document.querySelector('#search');
const number = document.querySelector('#number');
const pokemonImage = document.querySelector('#pokemon-image');
const types = document.querySelector('#types');
const statNumber = document.querySelectorAll('.stat-number');
const barInner = document.querySelectorAll('.bar-inner');
const barOuter = document.querySelectorAll('.bar-outer');
const statDesc = document.querySelectorAll('.stat-desc');
const baseStats = document.querySelector('#base-stats');
const pokedex = document.querySelector('#pokedex');
const pokemon = document.querySelector('#name');
const glass = document.querySelector('.search i');
const btn = document.querySelector('#btn');
const pokeball = document.querySelector('#pokedev');
const body = document.querySelector('body');

btn.addEventListener('click', async () => {
    pokeball.classList.toggle('open');
    btn.classList.toggle('open');
    const randomId = Math.floor(Math.random() * 1025) + 1;
    await fetchAndDisplayPokemon(randomId);
});

glass.addEventListener('click', async () => {
    const pkmnName = search.value.trim();
    if (pkmnName) {
        await fetchAndDisplayPokemon(pkmnName);
        search.value = ''; // Limpiar el campo de búsqueda
    }
});

search.addEventListener('change', async (event) => {
    const pkmnName = event.target.value.trim();
    if (pkmnName) {
        await fetchAndDisplayPokemon(pkmnName);
        search.value = ''; // Limpiar el campo de búsqueda
    }
});

search.addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
        const pkmnName = search.value.trim();
        if (pkmnName) {
            await fetchAndDisplayPokemon(pkmnName);
            search.value = ''; // Limpiar el campo de búsqueda
        }
    }
});

const typeColors = {
    "rock": [182, 158, 49],
    "ghost": [112, 85, 155],
    "steel": [183, 185, 208],
    "water": [100, 147, 235],
    "grass": [116, 203, 72],
    "psychic": [251, 85, 132],
    "ice": [154, 214, 223],
    "dark": [117, 87, 76],
    "fairy": [230, 158, 172],
    "normal": [170, 166, 127],
    "fighting": [193, 34, 57],
    "flying": [168, 145, 236],
    "poison": [164, 62, 158],
    "ground": [222, 193, 107],
    "bug": [167, 183, 35],
    "fire": [245, 125, 49],
    "electric": [249, 207, 48],
    "dragon": [112, 55, 255]
};

const fetchApi = async (pkmnNameOrId) => {
    const pkmnNameOrIdApi = pkmnNameOrId.toString().split(' ').join('-');
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/' + pkmnNameOrIdApi);

    if (response.status === 200) {
        const pkmnData = await response.json();
        return pkmnData;
    }

    return false;
};

const fetchAndDisplayPokemon = async (pkmnNameOrId) => {
    const pkmnData = await fetchApi(pkmnNameOrId);

    // Validación cuando el Pokémon no existe
    if (!pkmnData) {
        alert('El Pokémon no existe.');
        return;
    }

    // Color principal del Pokémon, para cambiar el tema de la interfaz de usuario
    const mainColor = typeColors[pkmnData.types[0].type.name];
    const rgb = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;
    const rgbaColor = `rgba(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]}, 0.6)`;

    baseStats.style.color = rgb;
    pokedex.style.backgroundColor = rgb;
    document.body.style.backgroundColor = rgbaColor; // Establece el color de fondo del body


    // Establece el número del Pokémon en la parte superior de la página
    number.innerHTML = '#' + pkmnData.id.toString().padStart(3, '0');

    glass.style.color = rgb;

    pokemon.innerHTML = pkmnData.name;

    // Establece la imagen del Pokémon
    pokemonImage.src = pkmnData.sprites.other.home.front_default;

    // Actualiza los "burbujas" de tipo
    types.innerHTML = '';

    pkmnData.types.forEach((t) => {
        let newType = document.createElement('span');
        let color = typeColors[t.type.name];

        newType.innerHTML = t.type.name;
        newType.classList.add('type');
        newType.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

        types.appendChild(newType);
    });

    // Actualiza estadísticas y barras de estadísticas
    pkmnData.stats.forEach((s, i) => {
        statNumber[i].innerHTML = s.base_stat.toString().padStart(3, '0');
        barInner[i].style.width = `${s.base_stat}%`;
        barInner[i].style.backgroundColor = rgb;
        barOuter[i].style.backgroundColor = `rgba(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]}, 0.3)`;
        statDesc[i].style.color = rgb;
    });
};
