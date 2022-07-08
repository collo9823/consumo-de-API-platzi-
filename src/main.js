// const { result } = require("lodash");

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    Headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': API_KEY,
    }
})

async function getTrendigMoviesPreview(){

    // // ACA HAGO EL LLAMDO A LA API ON FETCH, CREO EL res Y EL data
    
    // const res = await fetch('https://api.themoviedb.org/3/trending/movie/day?api_key=' + API_KEY);
    // const data = await res.json();
    
    

    // // ACA HAGO EL LLAMADO CON AXIOS (api); 
    const { data } = await api('trending/movie/day');
    
    
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

// const { result } = require("lodash");

async function getCategoriesPreview(){
    // //SACO EL RES Y LUEGO EL DATA CON FETCH.


    // const res = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=' + API_KEY);    
    
    // const data = await res.json();
    

    // //SACO EL DATA CON AXIOS (no hace falta sacar el res y ya lo pasa al data en .json())
    const {data} = await api('genre/movie/list');
    



    const categories = data.genres;
    console.log({ data, categories })
    console.log({ data })

    categories.forEach(category => {
        const categoryPreviewMoviesContainer = document.querySelector('#categoriesPreview .categoriesPreview-list')
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id' + category.id);
        // categoryTitle.setAttribute('id', category.name);
        // const poster_path = movie.poster_path;
        const categoryTitleText = document.createTextNode(category.name);
        
        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        categoryPreviewMoviesContainer.appendChild(categoryContainer);

        // movieImg.setAttribute(  
        //     'src',  
        //     `https://image.tmdb.org/t/p/w300/` + movie.poster_path);

        // movieContainer.appendChild(movieImg);
        // trendigPreviewMoviesContainer.appendChild(movieContainer)
        // movieImg.setAttribute('src', `https://image.tmdb.org/t/p/w300/${movie.poster_path}`);

    })
}

getTrendigMoviesPreview()
getCategoriesPreview()