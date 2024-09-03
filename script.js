// Fetch JSON files and combine data
let movies = [];

fetch('./data/movies-2000s.json')
    .then(response => response.json())
    .then(data => movies = movies.concat(data))
    .then(() => fetch('./data/movies-2010s.json'))
    .then(response => response.json())
    .then(data => movies = movies.concat(data))
    .then(() => fetch('./data/movies-2020s.json'))
    .then(response => response.json())
    .then(data => {
        movies = movies.concat(data);
        initializeGenres();
        initializeYears();
    })
    .catch(error => console.error('Error loading JSON files:', error));

// Initialize genres dynamically from movie data
function initializeGenres() {
    const genres = new Set();
    movies.forEach(movie => movie.genres.forEach(genre => genres.add(genre)));

    const genresFilter = document.getElementById('genres-filter');
    genres.forEach(genre => {
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'genre';
        radio.value = genre;
        radio.id = `genre-${genre}`;

        const label = document.createElement('label');
        label.htmlFor = radio.id;
        label.textContent = genre;

        genresFilter.appendChild(radio);
        genresFilter.appendChild(label);
    });
}

// Initialize years dynamically from 2001 to 2020
function initializeYears() {
    const yearsFilter = document.getElementById('years-filter');
    for (let year = 2001; year <= 2020; year++) {
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'year';
        radio.value = year;
        radio.id = `year-${year}`;

        const label = document.createElement('label');
        label.htmlFor = radio.id;
        label.textContent = year;

        yearsFilter.appendChild(radio);
        yearsFilter.appendChild(label);
    }
}

// Event listeners for search button
document.getElementById('search-button').addEventListener('click', filterMovies);

// Filter movies based on search input and selected radio buttons
function filterMovies() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const selectedGenre = document.querySelector('input[name="genre"]:checked')?.value;
    const selectedYear = document.querySelector('input[name="year"]:checked')?.value;

    let filteredMovies = movies.filter(movie => {
        const matchesTitle = movie.title.toLowerCase().includes(searchTerm);
        const matchesCast = movie.cast.some(cast => cast.toLowerCase().includes(searchTerm));
        const matchesGenre = !selectedGenre || movie.genres.includes(selectedGenre);
        const matchesYear = !selectedYear || movie.year.toString() === selectedYear;

        return (matchesTitle || matchesCast) && matchesGenre && matchesYear;
    });

    displayMovies(filteredMovies);
}

// Display filtered movies
function displayMovies(filteredMovies) {
    const moviesContainer = document.getElementById('movies-container');
    moviesContainer.innerHTML = '';

    filteredMovies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.className = 'movie';

        const thumbnail = document.createElement('img');
        thumbnail.src = movie.thumbnail;
        thumbnail.alt = movie.title;

        const title = document.createElement('h4');
        title.textContent = movie.title;

        movieElement.appendChild(thumbnail);
        movieElement.appendChild(title);
        moviesContainer.appendChild(movieElement);
    });
}
