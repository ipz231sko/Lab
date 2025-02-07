class Timer{
    constructor(displayElement){
        this.displayElement = displayElement;
        this.timeSpent = 0;
        this.timerInterval = null;
    }

    start(){
        this.timerInterval = setInterval(() => {
            this.timeSpent++;
            this.updateDisplay();
        }, 1000);
    }

    stop(){
        clearInterval(this.timerInterval);
    }

    updateDisplay(){
        const minutes = Math.floor(this.timeSpent/60);
        const seconds = this.timeSpent % 60;
        this.displayElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
}
const gallery = document.getElementById('gallery');
const galleryContainer = document.getElementById('gallery-container');
const fetchBtn = document.getElementById('fetch-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');

const timerDisplay = document.getElementById('timer');

const timer = new Timer(timerDisplay);

document.addEventListener('visibilitychange', () => {
    if(document.hidden){
        timer.stop();
    }else{
        timer.start();
    }
});

window.addEventListener('load', () => {
    if(!document.hidden){
        timer.start();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const savedImages = JSON.parse(localStorage.getItem('galleryImages')) || [];
    if (savedImages.length > 0) {
        savedImages.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            gallery.appendChild(img);
        });
    } else {
        console.log('Галерея порожня.');
    }
});


function saveGalleryToLocalStorage(){
    const images = Array.from(gallery.querySelectorAll('img')).map(img => img.src);
    localStorage.setItem('galleryImages', JSON.stringify(images));
}

async function fetchRandomImage(){
    try{
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        const data = await response.json();
        return data;
    }
    catch(error){
        console.error("Помилка Fetch API:", error);
        throw new Error("Щось пішло не так. Перевірте консоль!");
    }
}

function updateGalleryWithImage(imageUrl)
{
    const img = document.createElement('img');
    img.src = imageUrl;
    gallery.appendChild(img);
}

async function handleFetchButtonClick(){
    try{
        const imageData = await fetchRandomImage();

        if(imageData.status === "success"){
            updateGalleryWithImage(imageData.message);
            saveGalleryToLocalStorage();
        }
        else{
            alert("Не вдалося завантажити зображення.");
        }
    }
    catch(error){
        alert(error.message);
    }
}

fetchBtn.addEventListener('click', handleFetchButtonClick);

fullscreenBtn.addEventListener("click", () => {
    if (galleryContainer.requestFullscreen) {
        galleryContainer.requestFullscreen()
            .then(() => {
                galleryContainer.classList.add("fullscreen-active");
            })
            .catch((err) =>
                console.error("Помилка при вході в повноекранний режим:", err)
            );
    }
});

document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
        galleryContainer.classList.remove("fullscreen-active");
    }
});

class Geolocation {
    constructor(displayElement) {
        this.displayElement = displayElement;
    }

    startTracking(){
        if("geolocation" in navigator){
            navigator.geolocation.getCurrentPosition(
                (position) => this.updateLocation(position),
                (error) => alert("Не вдалося отримати ваше місцезнаходження.")
            );
            navigator.geolocation.watchPosition((position) => this.updateLocation(position));
        }
        else{
            alert("Geolocation API не підтримується вашим браузером.");
        }
    }

    updateLocation(position) {
        const latitude = position.coords.latitude.toFixed(4);
        const longitude = position.coords.longitude.toFixed(4);
        this.displayElement.textContent = `${latitude}${longitude}`;
    }
}

const locationDiv = document.getElementById('location');
const geolocation = new Geolocation(locationDiv);
geolocation.startTracking();