//consts
let apiKey="32928f4d7c61ba7a7c1cb26c9da8915c"
let apiEndpoint="https://api.themoviedb.org/3"
let imgPath = "https://image.tmdb.org/t/p/original";
let apiPath={
    fetchAllCategories:`${apiEndpoint}/genre/movie/list?api_key=${apiKey}`,
    fetchMoviesList: (id) => `${apiEndpoint}/discover/movie?api_key=${apiKey}&with_genres=${id}`,
    fetchTrending:`${apiEndpoint}/trending/all/day?api_key=${apiKey}&language=en-US`,
    fetchYoutubeSearch: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyA5ieQYETykwUj_iPKfnPZwUjQuEj1LX3U`
}


//Booting up
function init(){
    fetchTrendingMovies()
    fetchAndBuildAllSections()
}

function fetchAndBuildAllSections(){
    fetch(apiPath.fetchAllCategories)
    .then(res=>res.json())
    .then(res=>{
        let categories=res.genres
        if(Array.isArray(categories) && categories.length)
        {
            categories.forEach(category=>{
                fetchAndBuildMovieSections(apiPath.fetchMoviesList(category.id),category.name)
            })
        }
        // console.table(categories)
    })
    .catch(err=>console.error(err))
}

function fetchTrendingMovies(){
    fetchAndBuildMovieSections(apiPath.fetchTrending,'Trending Now')
    .then(list=>{
        let randomIndex=parseInt(Math.random()*list.length)
        buildBannerSection(list[randomIndex])
    }).catch(err=>{
        console.error(err)
    })
}

function buildBannerSection(movie){
    let bannerCont=document.getElementById('banner-section')
    bannerCont.style.backgroundImage=`url('${imgPath}${movie.backdrop_path}')`
    
    let div=document.createElement('div')
    div.innerHTML=`
    <h2 class="banner_title"> ${movie.title}</h2>
    <p class="banner_info">Trending in Movies | Released-${movie.release_date}</p>
    <p class="banner_overview">${movie.overview}</p>
    <div class="action-button-cont">
        <button class="action-button play"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard"><path d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z" fill="currentColor"></path></svg>&nbsp;&nbsp;Play</button>
        <button class="action-button more"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z" fill="currentColor"></path></svg>&nbsp;&nbsp;More Info</button>
    </div>  
`
    div.className="banner-cont container"
    bannerCont.append(div)
}


function fetchAndBuildMovieSections(fetchURL,categoryName){
    console.log(fetchURL,categoryName)
    return fetch(fetchURL)
    .then(res=>res.json())
    .then(res=>{
        // console.table(res.results)
        let movies=res.results
        if(Array.isArray(movies) && movies.length)
        {
            buildMoviesSection(movies,categoryName)
        }
        return movies
    })
    .catch(err=>console.error(err))
}

function buildMoviesSection(list,categoryName)
{
    console.log(list,categoryName)
    let moviecont=document.getElementById('movies-cont')

    let moviesListHTML=list.map(item=>{
        return `
        <div class="movies-item" onmouseover="searchMovieTrailer('${item.title}')">
        <img class="movie-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}" >
        <iframe  width="420" height="315" src=""></iframe>
        </div>
        `
    }).join('')

    let moviesSectionHTML=`
     
            <h2 class="movies-section-heading">${categoryName}<span class="explore-nudge">Explore All</span></h2>
                <div class="movies-row">
                    ${moviesListHTML}
                </div>
                `
    console.log(moviesListHTML)

    let div=document.createElement('div')
    div.className="movies-section" 
    div.innerHTML=moviesSectionHTML

    //append div into html
    moviecont.append(div)
}

function searchMovieTrailer(moviename){
    if(!moviename)
    {
        return;
    }
    fetch(apiPath.fetchYoutubeSearch(moviename))
    .then(res=>res.json())
    .then(res=>{
        let bestResult=res.items[0]
        let YoutubeURL=`https://www.youtube.com/watch?v=${bestResult.id.videoId}`
        console.log(YoutubeURL)
        window.open(YoutubeURL,'blank')
    })
    .catch(err=>
        console.error(err))
}






window.addEventListener('load',function(){
    init()
    window.addEventListener('scroll',function(){
        let header=document.getElementById('header')
        if(window.scrollY>5)
        {
            header.classList.add('black-bg')
        }
        else
        {
            header.classList.remove('black-bg')
        }
    })
})
