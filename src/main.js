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

function createMovies(movies, container){
    container.innerHTML = '';
    movies.forEach(movie => {
        console.log([movie.id])
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click', ()=>{
            location.hash = `#movie=#${movie.id}`
        });

        const movieImg = document.createElement('img'); //Imagen de la peli creada dinámicamente
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movies.title);
        // const poster_path = movie.poster_path;
        movieImg.setAttribute(  
            'src',  
            `https://image.tmdb.org/t/p/w300/` + movie.poster_path);

        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer)
    })
}

function createCategories(categories, container){
container.innerHTML = '';


categories.forEach(category => {
    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category-container');

    const categoryTitle = document.createElement('h3');
    categoryTitle.classList.add('category-title');
    categoryTitle.setAttribute('id', 'id' + category.id);
    categoryTitle.addEventListener('click',() =>{
        location.hash = `#category=${category.id}-${category.name}`;
    })
    // categoryTitle.setAttribute('id', category.name);
    // const poster_path = movie.poster_path;
    const categoryTitleText = document.createTextNode(category.name);
    
    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle);
    container.appendChild(categoryContainer);

    // movieImg.setAttribute(  
    //     'src',  
    //     `https://image.tmdb.org/t/p/w300/` + movie.poster_path);

    // movieContainer.appendChild(movieImg);
    // trendigPreviewMoviesContainer.appendChild(movieContainer)
    // movieImg.setAttribute('src', `https://image.tmdb.org/t/p/w300/${movie.poster_path}`);

})
}

async function getTrendigMoviesPreview(){
    const { data } = await api('trending/movie/day');
    const movies = data.results;    
    createMovies(movies, trendingMoviesPreviewList);
    console.log(movies)
}

// const { result } = require("lodash");

async function getCategoriesPreview(){

    const {data} = await api('genre/movie/list');
    
    const categories = data.genres;
    console.log({ data, categories })
    console.log({ data })
    console.log('Categorias', categories)


createCategories(categories, categoriesPreviewList)    
    
    
    
}


async function getMoviesByCategory(id){
    // // ACA HAGO EL LLAMADO CON AXIOS (api); 
    const { data } = await api('discover/movie', {
        params: {
            with_genres: id,
        },
    });
    const movies = data.results;
    console.log(movies);
    console.log(movies[0].poster_path)
    createMovies(movies, genericSection);
}
async function getMoviesBySearch(searchValue){
    // // ACA HAGO EL LLAMADO CON AXIOS (api); 
    const { data } = await api('search/movie', {
        params: {
            query: searchValue,
            include_adult: true,
        },
    });
    const movies = data.results;
    console.log(movies);
    console.log(movies[0].poster_path)
    createMovies(movies, genericSection);
}

async function getTrendigMovies(){
    const { data } = await api('trending/movie/day');
    const movies = data.results;    
    const categoryData = location.hash;
    console.log(categoryData);
    headerCategoryTitle.innerHTML = 'TRENDING MOVIES'
    createMovies(movies, genericSection);
}


// getMovieById(idMovie)  
async function getMovieById(id){
    const { data } = await api(`movie/${id}`);
    console.log(['MOVIEEEEE'], data)
    // const movies = data.results;    
    console.log(data.title)
    console.log(data.overview)
    

    const movieImg = document.createElement('img');
    movieImg.setAttribute('alt', data.title);
    
    const movieImgUrl = `https://image.tmdb.org/t/p/w500/` + data.poster_path;

    headerSection.style.background = `
    linear-gradient(
        180deg, 
        rgba(0, 0, 0, 0.35) 19.27%, 
        rgba(0, 0, 0, 0) 29.17%),
    url(${movieImgUrl})
    `;
    
   
    movieDetailTitle.textContent = data.title;
    movieDetailScore.textContent = data.vote_average
    movieDetailDescription.textContent = data.overview

    createCategories(data.genres, movieDetailCategoriesList);
    
    getRelatedMoviesId(id);

}

async function getRelatedMoviesId(id){
    const { data } = await api(`movie/${id}/recommendations` );
    const relatedMovies = data.results
    console.log(['RELATED MOVIES'], relatedMovies);

    createMovies(relatedMovies, relatedMoviesContainer)
    // history.back(location.hash -1)
    // relatedMovies.forEach(movie => {
    //     console.log([movie])

    //     const movieContainer = document.createElement('div');
    //     movieContainer.classList.add('movie-container');
    //     // movieContainer.addEventListener('click', ()=>{
    //         // location.hash = `#movie=#${movie.id}`
    //     // });

    //     const movieImg = document.createElement('img'); //Imagen de la peli creada dinámicamente
    //     movieImg.classList.add('movie-img');
    //     // movieImg.setAttribute('alt', relatedMovies.title);
    //     // const poster_path = movie.poster_path;
    //     movieImg.setAttribute(  
    //         'src',  
    //         `https://image.tmdb.org/t/p/w300/` + movie.poster_path);

    //     relatedMoviesContainer.movieContainer
            
    //         movieContainer.appendChild(movieImg);
    //         relatedMoviesContainer.appendChild(movieContainer);
            
    // })

}






// getTrendigMoviesPreview()
// getCategoriesPreview()

//UTILES











// async function getTrendigMoviesPreview(){

//     // // ACA HAGO EL LLAMDO A LA API ON FETCH, CREO EL res Y EL data
    
//     // const res = await fetch('https://api.themoviedb.org/3/trending/movie/day?api_key=' + API_KEY);
//     // const data = await res.json();
    
    
    
//     // // ACA HAGO EL LLAMADO CON AXIOS (api); 
//     const { data } = await api('trending/movie/day');
//     const movies = data.results;
//     // console.log({ data, movies })
    
//     createMovies(movies, trendingMoviesPreviewList)

//     //ERROR CARGA DUPLICADA DEL TRENDING;
//     trendingMoviesPreviewList.innerHTML = '';
//     // const trendingMoviesPreviewList = document.querySelector('#trendingPreview .trendingPreview-movieList')

//     movies.forEach(movie => {
    
//         const movieContainer = document.createElement('div');
//         movieContainer.classList.add('movie-container');

//         const movieImg = document.createElement('img');
//         movieImg.classList.add('movie-img');
//         movieImg.setAttribute('alt', movies.title);
//         // const poster_path = movie.poster_path;
//         movieImg.setAttribute(  
//             'src',  
//             `https://image.tmdb.org/t/p/w300/` + movie.poster_path);

//         movieContainer.appendChild(movieImg);
//         trendingMoviesPreviewList.appendChild(movieContainer)
//         // movieImg.setAttribute('src', `https://image.tmdb.org/t/p/w300/${movie.poster_path}`);



//     })





        // async function getMoviesByCategory(id){
        //     // // ACA HAGO EL LLAMADO CON AXIOS (api); 
        //     const { data } = await api('discover/movie', {
        //         params: {
        //             with_genres: id,
        //         },
        //     });
        //     const movies = data.results;
        //     console.log(movies);
        //     console.log(movies[0].poster_path)
        //     createMovies(movies, genericSection);
        
        //     //ERROR CARGA DUPLICADA DEL TRENDING;
        //     genericSection.innerHTML = '';
        //     // const trendingMoviesPreviewList = document.querySelector('#trendingPreview .trendingPreview-movieList')
        
        //     movies.forEach(movie => {
            
        //         const movieContainer = document.createElement('div');
        //         movieContainer.classList.add('movie-container');
        
        //         const movieImg = document.createElement('img');
        //         movieImg.classList.add('movie-img');
        //         movieImg.setAttribute('alt', movies.title);
        //         // const poster_path = movie.poster_path;
        //         movieImg.setAttribute(  
        //             'src',  
        //             `https://image.tmdb.org/t/p/w300/` + movie.poster_path);
        
        //         movieContainer.appendChild(movieImg);
        //         genericSection.appendChild(movieContainer)
        //         // movieImg.setAttribute('src', `https://image.tmdb.org/t/p/w300/${movie.poster_path}`);
        
        //     })
        // }
// }






// async function getCategoriesPreview(){
//     // //SACO EL RES Y LUEGO EL DATA CON FETCH.


//     // const res = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=' + API_KEY);    
    
//     // const data = await res.json();
    

//     // //SACO EL DATA CON AXIOS (no hace falta sacar el res y ya lo pasa al data en .json())
//     const {data} = await api('genre/movie/list');
    


    
//     const categories = data.genres;
//     console.log({ data, categories })
//     console.log({ data })
//     console.log('Categorias', categories)


//     //ERROR CARGA DUPLICADA DE CATEGORIAS;
//     categoriesPreviewList.innerHTML = ""
//     // const categoriesPreviewList = document.querySelector('#categoriesPreview .categoriesPreview-list')
    
    
    
//     categories.forEach(category => {
//         const categoryContainer = document.createElement('div');
//         categoryContainer.classList.add('category-container');

//         const categoryTitle = document.createElement('h3');
//         categoryTitle.classList.add('category-title');
//         categoryTitle.setAttribute('id', 'id' + category.id);
//         categoryTitle.addEventListener('click',() =>{
//             location.hash = `#category=${category.id}-${category.name}`;
//         })
//         // categoryTitle.setAttribute('id', category.name);
//         // const poster_path = movie.poster_path;
//         const categoryTitleText = document.createTextNode(category.name);
        
//         categoryTitle.appendChild(categoryTitleText);
//         categoryContainer.appendChild(categoryTitle);
//         categoriesPreviewList.appendChild(categoryContainer);

//         // movieImg.setAttribute(  
//         //     'src',  
//         //     `https://image.tmdb.org/t/p/w300/` + movie.poster_path);

//         // movieContainer.appendChild(movieImg);
//         // trendigPreviewMoviesContainer.appendChild(movieContainer)
//         // movieImg.setAttribute('src', `https://image.tmdb.org/t/p/w300/${movie.poster_path}`);

//     })
// }