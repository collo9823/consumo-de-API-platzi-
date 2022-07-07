// const { result } = require("lodash");

async function getTrendigMoviesPreview(){
    const res = await fetch('https://api.themoviedb.org/3/trending/movie/day?api_key=' + API_KEY);
    const data = await res.json();
    const movies = data.results;
    console.log({ data, movies })

    movies.forEach(movie => {
        const trendigPreviewMoviesContainer = document.querySelector('#trendigPreview .trendingPreview-movieList')
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movies.title);
        // const poster_path = movie.poster_path;
        movieImg.setAttribute(  
            'src',  
            `https://image.tmdb.org/t/p/w300/` + movie.poster_path);

        movieContainer.appendChild(movieImg);
        trendigPreviewMoviesContainer.appendChild(movieContainer)
        // movieImg.setAttribute('src', `https://image.tmdb.org/t/p/w300/${movie.poster_path}`);

    })
}

getTrendigMoviesPreview()