// Modular Project Architecture & Client-Side Routing Logics
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Client-Side Router Handler
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.view-page');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = e.target.getAttribute('data-page');

            pages.forEach(page => {
                page.classList.remove('active-view');
                if (page.id === `page-${targetPage}`) {
                    page.classList.add('active-view');
                }
            });
        });
    });

    // 2. Weather Async/Await Component Module
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-weather-btn');
    const weatherDisplay = document.getElementById('weather-display');
    const weatherCity = document.getElementById('weather-city');
    const weatherTemp = document.getElementById('weather-temp');
    const weatherHumidity = document.getElementById('weather-humidity');
    const weatherError = document.getElementById('weather-error');

    if (searchBtn) {
        searchBtn.addEventListener('click', async () => {
            const city = cityInput.value.trim();
            if (!city) return;

            weatherError.style.display = 'none';
            weatherDisplay.style.display = 'none';

            try {
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=13.0827&longitude=80.2707&current=temperature_2m,relative_humidity_2m`);
                if (!res.ok) throw new Error('Data transmission broken.');
                const data = await res.json();
                
                if (data && data.current) {
                    weatherCity.innerText = `E-Store Logistics Weather Context (${city})`;
                    weatherTemp.innerText = data.current.temperature_2m;
                    weatherHumidity.innerText = data.current.relative_humidity_2m;
                    weatherDisplay.style.display = 'block';
                }
            } catch (err) {
                weatherError.innerText = 'Service down. Please try again.';
                weatherError.style.display = 'block';
            }
        });
    }
});
