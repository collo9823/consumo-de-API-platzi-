let historial = []
searchFormBtn.addEventListener('click', ()=> {
    
    location.hash = '#search=' + searchFormInput.value;
    // location.hash = '#search=' + searchFormInput.value;
    const [_, query] = location.hash.split('=');
    historial.push(query);
    console.log(['HISTOIAL'],query)

})
trendingBtn.addEventListener('click', ()=> {
    location.hash = '#trends';
})

function backHistory(query){
    console.log('back')
    console.log(query)

    // encodeURI = '%20'
    const decoName = decodeURI(query)
    getMoviesBySearch(decodeURI(decoName))
    headerCategoryTitle.innerHTML = decodeURI((decoName.toUpperCase()))
}

arrowBtn.addEventListener('click', ()=> {
    if(historial.length >= 2){
        function resolve(){
            historial.pop();
            const ultimoElem = historial[historial.length -1];
            return ultimoElem;
        }
        backHistory(resolve())
    }else{
        location.hash = '#home'
    }
    
    //     location.hash = '#search=' + historial[historial.length-1]
    // }else{
    //     location.hash = '#home'
})

// arrowBtn.addEventListener('click', ()=> {
//     history.back()
//     // location.hash = '#home';
// })

window.addEventListener('DOMContentLoaded', navigator, false)
window.addEventListener('hashchange', navigator, false)


function navigator(){
    console.log({ location })

    if(location.hash.startsWith('#trends')) {
        trendsPage();
    }else if(location.hash.startsWith('#search=')){
        searchPage();
    }else if(location.hash.startsWith('#movie=')){
        movieDetailsPage();
    }else if(location.hash.startsWith('#category=')){
        categoriesPage();
    }else{
        homePage();
    }

    location.hash;
}



function homePage(){
    console.log('Estás en el Home');
    
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow-white');

    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');

    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    //Seccion, adentro un article y adentro los categories containers

    getTrendigMoviesPreview();
    getCategoriesPreview();
}

function categoriesPage(){
    window.scrollTo(0,0)
    console.log('Estás en Categories');
        
    headerSection.classList.remove ('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow-white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
        
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');

    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    //['#category', 'id-name']
    const [typeOfLocation, categoryData] = location.hash.split('=');

    //['categoryId', 'categoryName]
    const [categoryId, categoryName] = categoryData.split('-');
    const newName2 = decodeURI(categoryName);

    headerCategoryTitle.innerHTML = newName2
    //LO DE ARRIBA ES LO MISMO QUE LO DE ABAJO PERO CON DESTRUCTURACION
    // const ids = (location.hash.split('='));
    // const id = ids[1].split('-')
    // console.log(id[0])
    // console.log(categoryId)
    getMoviesByCategory(categoryId)
}

// }


function movieDetailsPage(){
    window.scrollTo(0,0)

    // window.scrollTo(0,0)
    console.log('Estás en Movies detail');
    headerSection.classList.add('header-container--long');
    // headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');

    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');
    
    // #movie, id
    const [movie, idValue] = location.hash.split('=');
    
    // console.log(movie, decodeURI(searchValue))
    console.log(movie, idValue)

    //['categoryId', 'categoryName]
    const [_, idMovie] = idValue.split('#');

    console.log(idMovie)
    // const newName2 = decodeURI(categoryName);
    
    // headerCategoryTitle.innerHTML = decodeURI((searchValue.toUpperCase()))
    // getMoviesBySearch(decodeURI(searchValue))
    
    getMovieById(idMovie)
}

function searchPage(){
    console.log('Estás en Search movies');
    headerSection.classList.remove ('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow-white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.remove('inactive');
        
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');

    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    // ['#search', 'BUSCADO']
    const [search, searchValue] = location.hash.split('=');

    console.log(search, decodeURI(searchValue))
    //['categoryId', 'categoryName]
    // const [categoryId, categoryName] = categoryData.split('-');
    // const newName2 = decodeURI(categoryName);

    headerCategoryTitle.innerHTML = decodeURI((searchValue.toUpperCase()))
    getMoviesBySearch(decodeURI(searchValue)) 
    
}
function trendsPage(){
    window.scrollTo(0,0)

    console.log('Estás en Trends');
    headerSection.classList.remove ('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow-white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
        
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');

    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    
    getTrendigMovies()
}