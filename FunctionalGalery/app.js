const apiKey = 'CaI0ZzBOZXzo88UejqHxL9RqnCDYJk9ngki5UBiFghxBwHgzA6jXZnZ6'
const perPage = 15
let currPage = 1
let searchTerm = null
const imagesCon = document.querySelector('.images')
const loadMoreBtn = document.querySelector('.load-more')
const searchInput = document.querySelector('.search-box input')
const lightBox = document.querySelector('.lightbox')
const closeBtn = lightBox.querySelector('.fa-x')
const downloadBtn = lightBox.querySelector('.fa-download')

getImages(`https://api.pexels.com/v1/curated?page=${currPage}per_page=${perPage}`)
loadMoreBtn.addEventListener('click', loadMoreImages)
searchInput.addEventListener('keyup', searchMoreImages)
closeBtn.addEventListener('click', closelightBox)

function getImages(url) {
    loadMoreBtn.innerText = 'Loading...'
    loadMoreBtn.classList.add('disabled')
    fetch(url, {
        headers: { Authorization: apiKey }
    }).then((response) => response.json()).then((data) => {
        console.log(data.photos);
        generateHTML(data.photos)
        loadMoreBtn.innerText = 'Load More'
        loadMoreBtn.classList.remove('disabled')
    }).catch(() =>{
        alert('Failed to load images!')
    })
}

function generateHTML(item) {
    item.forEach(data => {
        imagesCon.innerHTML += `<li class="card" onclick = "showLightBox('${data.photographer}', '${data.src.large2x}')">
        <img src="${data.src.large2x}" alt="Just Image">
        <div class="details">
            <div class="photographer">
                <i class="fa-solid fa-camera"></i>
                <span>${data.photographer}</span>
            </div>
            <button onclick = "downloadImg('${data.src.large2x}');event.stopPropagation();">
                <i class="fa-solid fa-download"></i>
            </button>
        </div>
    </li>`
    })
}

function showLightBox(name, img){
    lightBox.querySelector('img').src = img
    lightBox.querySelector('span').innerText = name
    downloadBtn.setAttribute('data-img', img)
    lightBox.classList.add('show')
    document.body.style.overflow = 'hidden'
}

downloadBtn.addEventListener('click', (e) => downloadImg(e.target.dataset.img))

function closelightBox(){
    lightBox.classList.remove('show')
    document.body.style.overflow = 'auto'
}

function loadMoreImages() {
    currPage++
    let apiUrl = `https://api.pexels.com/v1/curated?page=${currPage}&per_page=${perPage}`
    apiUrl = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currPage}&per_page=${perPage}` : apiUrl
    getImages(apiUrl)
}

function searchMoreImages(e) {
    if(e.target.value === "") return searchTerm = null
    if (e.key === 'Enter') {
        currPage = 1
        searchTerm = e.target.value;
        imagesCon.innerHTML = ""
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currPage}&per_page=${perPage}`)
        e.target.value = ""
    }
}

function downloadImg(url){
    fetch(url).then((item) => item.blob()).then((data) =>{
        const a = document.createElement('a')
        a.href = URL.createObjectURL(data)
        a.download = new Date().getTime()
        a.click()
    }).catch(() =>{
        alert('Failed to download image!')
    })
}