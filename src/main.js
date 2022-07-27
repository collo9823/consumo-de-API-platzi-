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

function likedMoviesList(){
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;

    if(item){
        movies = item
    }else{
        movies = {};
    }
    return movies
}
 //Recibe la info del createMovies
function likeMovie(movie){
    console.log('Llamaste a likeMovie ');
    //Llamo la funcion likedMoviesList ((LS))
    const likedMovies = likedMoviesList();
    console.log(likedMovies)
    //Si LS en la funcion likedMovies tiene la movie.id recibe el valr undefined así lo saca
    if(likedMovies[movie.id]){
        likedMovies[movie.id] = undefined;
    }else{
        //Sino (si no lo tiene al movie.id en su LS, le paso el movie.id)
        likedMovies[movie.id] = movie;
    }

    localStorage.setItem('liked_movies',JSON.stringify(likedMovies))
    if(location.hash == ''){
        getLikedMovies();
        getTrendigMoviesPreview();
    }
}

// // function createObserver(){
// //     return new IntersectionObserver((elements)=>{
// //         elements.forEach(element=>{
// //             if(element.isIntersecting)element.target.setAttribute('src',
// //             element.target.dataset.img)
            
// //         })
// //     })
// // }

// // let observer = createObserver()




const lazyLoader = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
        console.log(entry.target.setAttribute)
        if(entry.isIntersecting)  {
            const url = entry.target.getAttribute('data-img');

            entry.target.setAttribute('src', url);
        } 

    })
});


function createMovies(movies, container, 
    {
        lazyLoad = false, 
        clean = true
    } = {},
    ){
        console.log('createMovies')
        console.log(movies)
     if(clean){
        container.innerHTML = '';
    }
    movies.forEach(movie => {
        console.log([movie.id])
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        

        const movieImg = document.createElement('img'); //Imagen de la peli creada dinámicamente
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movies.title);
        // const poster_path = movie.poster_path;
        movieImg.setAttribute(  
            // 'src',
            lazyLoad ? 'data-img' : 'src',  
            `https://image.tmdb.org/t/p/w300/` + movie.poster_path);
        
        movieImg.addEventListener('click', ()=>{
            location.hash = `#movie=#${movie.id}`
        });
            movieImg.addEventListener('error',()=> {
                movieImg.setAttribute('src', 'https://static.platzi.com/static/images/error/img404.png')
            });
            
            
            const movieBtn = document.createElement('button');
            movieBtn.classList.add('movie-btn')
            //Le pregunto al objeto devuelto por la función si tiene la movie.id; Si está en el local storage le add el button
            likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked');

            movieBtn.addEventListener('click', () =>{
                movieBtn.classList.toggle('movie-btn--liked')
                //Se agrega la pelicula al LS
                likeMovie(movie);
                //PARA CARGAR EN AUTOMATICO EL FAV A LA LISTA
                // getLikedMovies();

            })
            movieContainer.appendChild(movieImg);
            movieContainer.appendChild(movieBtn);
            container.appendChild(movieContainer)
            // // observer.observe(movieImg)
            if(lazyLoad){
                lazyLoader.observe(movieImg)
            }
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
    const { data } = await api('trending/movie/day', {
        params:{
            include_adult: true,
        },
    });
    const movies = data.results;    
    createMovies(movies, trendingMoviesPreviewList, true);
    console.log(movies)
}

// const { result } = require("lodash");

async function getCategoriesPreview(){

    const {data} = await api('genre/movie/list', {
        params: {
            language: 'es-spa',
        }
    });
    
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
            // page: 1,
            with_genres: id,
            include_adult: true,
            // total_results: 60,
            // total_pages: 3,
        },
    });
    const movies = data.results;

    maxPage = data.total_pages;
    console.log(movies, ['Estas en movies por categoria']);
    console.log(data)
    console.log(movies[0].poster_path)
    createMovies(movies, genericSection, {lazyLoad: true});
}

function getPaginatedMoviesByCategory(id){


    return async function () {
        const {
            scrollTop, 
            scrollHeight,  
            clientHeight
        } = document.documentElement;
        
        //Valida el scroll
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
        
        //Valida la página máxima
        const pageIsNotMax = page < maxPage 
        //Si se validan sumo otra página
        if(scrollIsBottom && pageIsNotMax){
            page ++;
            //Le paso a los parámetros la página y el query
            const { data } = await api('discover/movie', {
                params: {
                    // page: 1,
                    with_genres: id,
                    include_adult: true,
                    page,
                },
            });
            const movies = data.results;

            console.log(movies);
            console.log(movies[0].poster_path)
            //A la funcion createMovies le paso los parámetros
            createMovies(
                movies, 
                genericSection, 
                {lazyLoad: true, clean: false}
            ) ;
        }
    } 


}
async function getMoviesBySearch(query){
    // // ACA HAGO EL LLAMADO CON AXIOS (api); 
    const { data } = await api('search/movie', {
        params: {
            query,
            include_adult: true,
        },
    });
    const movies = data.results;
    maxPage = data.total_pages;
    console.log(maxPage)
    console.log(movies);
    createMovies(movies, genericSection);
}



function getPaginatedMoviesBySearch(query){

    return async function () {
        const {
            scrollTop, 
            scrollHeight,  
            clientHeight
        } = document.documentElement;
        
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
        const pageIsNotMax = page < maxPage 

        if(scrollIsBottom && pageIsNotMax){
            page ++;
            const { data } = await api('search/movie', {
                params: {
                    query,
                    // include_adult: true,
                    page,
                },
            });
            const movies = data.results;
            console.log(movies);
            console.log(movies[0].poster_path)

            createMovies(
                movies, 
                genericSection, 
                {lazyLoad: true, clean: false}
            ) ;
        }
    } 


    //     const btnLoadMore = document.createElement('button');
    // btnLoadMore.innerText = 'Cargar mas';
    // btnLoadMore.addEventListener('click', getPaginatedTrendingMovies)
    // genericSection.appendChild(btnLoadMore);

}

async function getTrendigMovies(){

    const { data } = await api('trending/movie/day',{
        params: {
            include_adult: true,
        }
    });
    const movies = data.results;    
    maxPage = data.total_pages
    const categoryData = location.hash;
    console.log(categoryData);
    headerCategoryTitle.innerHTML = 'TRENDING MOVIES'
    createMovies(movies, genericSection, {lazyLoad: true, clean: true});

    // const btnLoadMore = document.createElement('button');
    // btnLoadMore.innerText = 'Cargar mas';
    // btnLoadMore.addEventListener('click', getPaginatedTrendingMovies)
    // genericSection.appendChild(btnLoadMore);
}

// let page = 1;

async function getPaginatedTrendingMovies(){

    const {
        scrollTop, 
        scrollHeight, 
        clientHeight
    } = document.documentElement;
    
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);

    const pageIsNotMax = page < maxPage 

    if(scrollIsBottom && pageIsNotMax){
        page ++;
        const { data } = await api('trending/movie/day', {
            params: {
                page,
            },
        });
        const movies = data.results;

        createMovies(
            movies, 
            genericSection, 
            {lazyLoad: true, clean: false}
        ) ;
    }


    //     const btnLoadMore = document.createElement('button');
    // btnLoadMore.innerText = 'Cargar mas';
    // btnLoadMore.addEventListener('click', getPaginatedTrendingMovies)
    // genericSection.appendChild(btnLoadMore);

}


// getMovieById(idMovie)  
async function getMovieById(id){
    const { data } = await api(`movie/${id}`
    , {
        params: {
            include_adult: true,
            // language: 'es-spa',
        }
    }
    );
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
    const { data } = await api(`movie/${id}/recommendations`
    // , {
    //     params: {
    //         include_adult: true,
    //     }
    // } 
    );
    const relatedMovies = data.results
    console.log(['RELATED MOVIES'], relatedMovies);

    createMovies(relatedMovies, relatedMoviesContainer, true)
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

function getLikedMovies(){
    const likedMovies = likedMoviesList();
    const moviesArray = Object.values(likedMovies)
    createMovies(moviesArray, likedMoviesListArticle,{ lazyLoad: false, clean: true })
    console.log(likedMovies);
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