/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as GeminiService from './gemini.service';
import type {
    FullApiResponse,
    DefaultForecast,
    VacationPlanResponse,
    AgroTipsResponse,
    CoastalInfo,
    HistoricalWeatherResponse,
    HikerInfoResponse,
    AirQualityIndex,
    Pollutant
} from './gemini.service';


// --- DOM Element References ---
const getStartedBtn = document.getElementById(
  'get-started-btn'
) as HTMLButtonElement | null;
const bodyElement = document.body;
const weatherForm = document.getElementById(
  'weather-form'
) as HTMLFormElement | null;
const cityInput = document.getElementById(
  'city-input'
) as HTMLInputElement | null;
const forecastContent = document.getElementById(
  'forecast-content'
) as HTMLElement | null;
const savedLocationsContainer = document.getElementById(
  'saved-locations-container'
) as HTMLElement | null;
const submitButton = weatherForm?.querySelector(
  "button[type='submit']"
) as HTMLButtonElement | null;
const themeToggleButton = document.getElementById('theme-toggle-btn') as HTMLButtonElement | null;
const locationModal = document.getElementById('location-modal') as HTMLElement | null;
const modalOkBtn = document.getElementById('modal-ok-btn') as HTMLButtonElement | null;
const toastContainer = document.getElementById('toast-container') as HTMLElement | null;

// Dashboard Modal
const dashboardModal = document.getElementById('dashboard-modal') as HTMLElement | null;
const modalSaveBtn = document.getElementById('modal-save-btn') as HTMLButtonElement | null;
const modalCloseBtn = document.getElementById('modal-close-btn') as HTMLButtonElement | null;
const metricsOptions = document.getElementById('metrics-options') as HTMLElement | null;

// Add Location Modal
const addLocationBtn = document.getElementById('add-location-btn') as HTMLButtonElement | null;
const addLocationModal = document.getElementById('add-location-modal') as HTMLElement | null;
const modalCloseAddBtn = document.getElementById('modal-close-add-btn') as HTMLButtonElement | null;
const addLocationForm = document.getElementById('add-location-form') as HTMLFormElement | null;
const addCityInput = document.getElementById('add-city-input') as HTMLInputElement | null;

// Alert Banner
const alertBanner = document.getElementById('alert-notification-banner') as HTMLElement | null;
const allowAlertsBtn = document.getElementById('allow-alerts-btn') as HTMLButtonElement | null;
const denyAlertsBtn = document.getElementById('deny-alerts-btn') as HTMLButtonElement | null;

// Vacation Planner
const vacationModal = document.getElementById('vacation-modal') as HTMLElement | null;
const vacationModalCloseBtn = document.getElementById('vacation-modal-close-btn') as HTMLButtonElement | null;
const vacationForm = document.getElementById('vacation-form') as HTMLFormElement | null;
const vacationCityInput = document.getElementById('vacation-city-input') as HTMLInputElement | null;
const vacationStartDateInput = document.getElementById('vacation-start-date') as HTMLInputElement | null;
const vacationDurationInput = document.getElementById('vacation-duration') as HTMLInputElement | null;
const vacationPlanResults = document.getElementById('vacation-plan-results') as HTMLElement | null;
const vacationFormContainer = document.getElementById('vacation-form-container') as HTMLElement | null;

// Agro Tips
const agroModal = document.getElementById('agro-modal') as HTMLElement | null;
const agroModalCloseBtn = document.getElementById('agro-modal-close-btn') as HTMLButtonElement | null;
const agroForm = document.getElementById('agro-form') as HTMLFormElement | null;
const agroCityInput = document.getElementById('agro-city-input') as HTMLInputElement | null;
const agroTipsResults = document.getElementById('agro-tips-results') as HTMLElement | null;
const agroFormContainer = document.getElementById('agro-form-container') as HTMLElement | null;

// Coastal Info
const coastalModal = document.getElementById('coastal-modal') as HTMLElement | null;
const coastalModalCloseBtn = document.getElementById('coastal-modal-close-btn') as HTMLButtonElement | null;
const coastalForm = document.getElementById('coastal-form') as HTMLFormElement | null;
const coastalCityInput = document.getElementById('coastal-city-input') as HTMLInputElement | null;
const coastalInfoResults = document.getElementById('coastal-info-results') as HTMLElement | null;
const coastalFormContainer = document.getElementById('coastal-form-container') as HTMLElement | null;

// History Modal
const historyModal = document.getElementById('history-modal') as HTMLElement | null;
const historyModalCloseBtn = document.getElementById('history-modal-close-btn') as HTMLButtonElement | null;
const historyForm = document.getElementById('history-form') as HTMLFormElement | null;
const historyDateInput = document.getElementById('history-date-input') as HTMLInputElement | null;
const historyResults = document.getElementById('history-results') as HTMLElement | null;
const historyCityName = document.getElementById('history-city-name') as HTMLElement | null;

// Hiker/Trekker Modal
const hikerModal = document.getElementById('hiker-modal') as HTMLElement | null;
const hikerModalCloseBtn = document.getElementById('hiker-modal-close-btn') as HTMLButtonElement | null;
const hikerForm = document.getElementById('hiker-form') as HTMLFormElement | null;
const hikerCityInput = document.getElementById('hiker-city-input') as HTMLInputElement | null;
const hikerInfoResults = document.getElementById('hiker-info-results') as HTMLElement | null;
const hikerFormContainer = document.getElementById('hiker-form-container') as HTMLElement | null;


// Tools Dropdown
const toolsMenuBtn = document.getElementById('tools-menu-btn') as HTMLButtonElement | null;
const toolsDropdown = document.getElementById('tools-dropdown') as HTMLElement | null;
const dropdownVacationBtn = document.getElementById('dropdown-vacation-btn') as HTMLButtonElement | null;
const dropdownAgroBtn = document.getElementById('dropdown-agro-btn') as HTMLButtonElement | null;
const dropdownCoastalBtn = document.getElementById('dropdown-coastal-btn') as HTMLButtonElement | null;
const dropdownHikerBtn = document.getElementById('dropdown-hiker-btn') as HTMLButtonElement | null;


// --- Constants ---
const ALL_METRICS = ['humidity', 'windSpeed', 'pressure', 'visibility', 'feelsLike', 'uvIndex', 'sunrise', 'sunset'];


// --- State ---
let savedLocations: string[] = [];
let currentCity = '';
let currentForecastData: FullApiResponse | null = null;
let visibleMetrics: string[] = [];
let selectedPollutant: string | null = null;
let suggestionsCache = new Map<string, string[]>();


// --- Main Application Logic ---

/**
 * Initializes the application, loads saved data, and sets up event listeners.
 */
const initializeApp = () => {
  // Page transitions
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
        if (locationModal) locationModal.classList.add('visible');
    });
  }
  if (modalOkBtn) {
    modalOkBtn.addEventListener('click', showMainContent);
  }
  // Main form
  if (weatherForm) {
    weatherForm.addEventListener('submit', handleFormSubmit);
  }
  // Header buttons
  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', toggleTheme);
  }
  if (addLocationBtn) {
    addLocationBtn.addEventListener('click', () => addLocationModal?.classList.add('visible'));
  }
  // Tools Dropdown
  if (toolsMenuBtn && toolsDropdown) {
    toolsMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toolsDropdown.classList.toggle('visible');
    });
  }
  // Dashboard Modal
  if (modalSaveBtn) {
    modalSaveBtn.addEventListener('click', handleSaveDashboard);
  }
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => dashboardModal?.classList.remove('visible'));
  }
  // Add Location Modal
  if (addLocationForm) {
    addLocationForm.addEventListener('submit', handleAddLocation);
  }
  if (modalCloseAddBtn) {
    modalCloseAddBtn.addEventListener('click', () => addLocationModal?.classList.remove('visible'));
  }
  // Alert banner
  if (allowAlertsBtn && denyAlertsBtn) {
      initializeAlertBanner();
  }
  // Vacation Planner
    if (dropdownVacationBtn) {
        dropdownVacationBtn.addEventListener('click', () => {
            if (vacationModal) {
                vacationModal.classList.add('visible');
                // Set min date for start date input to today
                if (vacationStartDateInput) {
                    vacationStartDateInput.min = new Date().toISOString().split('T')[0];
                }
            }
        });
    }
  if (vacationModalCloseBtn) {
    vacationModalCloseBtn.addEventListener('click', handleVacationExit);
  }
  if (vacationForm) {
    vacationForm.addEventListener('submit', handleVacationFormSubmit);
  }
  // Agro Tips
  if (dropdownAgroBtn) {
    dropdownAgroBtn.addEventListener('click', () => agroModal?.classList.add('visible'));
  }
  if (agroModalCloseBtn) {
    agroModalCloseBtn.addEventListener('click', handleAgroExit);
  }
  if (agroForm) {
    agroForm.addEventListener('submit', handleAgroFormSubmit);
  }
  // Coastal Info
  if (dropdownCoastalBtn) {
    dropdownCoastalBtn.addEventListener('click', () => coastalModal?.classList.add('visible'));
  }
  if (coastalModalCloseBtn) {
    coastalModalCloseBtn.addEventListener('click', handleCoastalExit);
  }
  if (coastalForm) {
    coastalForm.addEventListener('submit', handleCoastalFormSubmit);
  }
  // Hiker/Trekker Mode
  if (dropdownHikerBtn) {
    dropdownHikerBtn.addEventListener('click', () => hikerModal?.classList.add('visible'));
  }
  if (hikerModalCloseBtn) {
    hikerModalCloseBtn.addEventListener('click', handleHikerExit);
  }
  if (hikerForm) {
    hikerForm.addEventListener('submit', handleHikerFormSubmit);
  }
  // History Modal
  if (historyModalCloseBtn) {
    historyModalCloseBtn.addEventListener('click', handleHistoryExit);
  }
  if (historyForm) {
    historyForm.addEventListener('submit', handleHistoryFormSubmit);
  }

  
  initializeTheme();
  loadDashboardPreferences();
  loadSavedLocations(); // This will run in the background
  setupLocationSuggestions();
  renderWelcomeMessage();

  // Global click to close dropdowns and suggestions
  document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (toolsDropdown && !toolsMenuBtn?.contains(target)) {
          toolsDropdown.classList.remove('visible');
      }
      if (!target.closest('.input-group') && !target.closest('.input-wrapper')) {
          hideAllSuggestions();
      }
  });
};

// --- View Switching Logic ---
const showMainContent = () => {
    if (locationModal) locationModal.classList.remove('visible');
    if (!bodyElement) return;

    if ('geolocation' in navigator) {
        // Success: show main content and get weather
        const successCallback = (position: GeolocationPosition) => {
            bodyElement.classList.remove('show-home');
            bodyElement.classList.add('show-main');
            const { latitude, longitude } = position.coords;
            if (cityInput) {
                cityInput.value = 'Current Location';
                currentCity = 'Current Location';
            }
            getForecast(`${latitude}, ${longitude}`);
        };

        // Error: show toast and stay on home screen
        const errorCallback = (error: GeolocationPositionError) => {
            console.warn(`Geolocation failed (Code ${error.code}): ${error.message}.`);
            showToast('Please enable your location services to continue.');
            // Do NOT transition to main view
        };

        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        // Geolocation not supported
        showToast('Geolocation is not supported by your browser.');
    }
};


/**
 * Fetches and displays the weather forecast for a given location (city name or coordinates).
 * @param {string} location - The city name or coordinates.
 */
const getForecast = async (location: string) => {
  if (!forecastContent || !submitButton) return;
  setLoading(true, location);
  currentForecastData = null;
  selectedPollutant = null;

  try {
      currentForecastData = await GeminiService.fetchForecast(location);

      if (!currentForecastData?.forecast) {
        throw new Error("Invalid data structure from API.");
      }

      const returnedCity = currentForecastData.correctedCity || currentForecastData.forecast.current.city;

      if (cityInput && location.toLowerCase() !== 'current location' && !location.includes(',')) {
          currentCity = returnedCity;
          cityInput.value = currentCity;
      } else {
          currentCity = returnedCity;
      }
      
      flashInputFeedback(true);
      renderForecast();
  } catch (error) {
      console.error('Error fetching weather data:', error);
      const errorMessage = error.toString().includes('429')
        ? 'Too many requests. Please wait a moment and try again.'
        : 'Could not fetch the forecast. The city may not exist or the service is unavailable. Please try another city.';
      renderError(errorMessage);
      flashInputFeedback(false);
  } finally {
      setLoading(false);
  }
};

/**
 * Handles the main form submission.
 * @param {SubmitEvent} event - The form submission event.
 */
const handleFormSubmit = async (event: SubmitEvent) => {
  event.preventDefault();
  hideAllSuggestions();
  if (!cityInput || !cityInput.value) return;
  const city = cityInput.value.trim();
  currentCity = city; // Set current city on manual search
  await getForecast(city);
};

/**
 * Handles the "Use my location" button click from the saved locations bar.
 */
const handleUseMyLocation = () => {
  if ('geolocation' in navigator) {
    setLoading(true, 'your location');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (cityInput) {
          cityInput.value = 'Current Location';
        }
        currentCity = 'Current Location';
        getForecast(`${latitude}, ${longitude}`);
      },
      (error) => {
        console.error('Error getting location:', error);
        renderError(
          'Could not access your location. Please enable location services or enter a city manually.'
        );
        setLoading(false);
      }
    );
  } else {
    renderError('Geolocation is not supported by your browser.');
  }
};


// --- Rendering and UI Update Functions ---

/**
 * Renders the entire forecast display based on the current data and view.
 */
const renderForecast = () => {
    if (!forecastContent || !currentForecastData) {
        renderWelcomeMessage();
        return;
    }
    const { forecast, summary } = currentForecastData;
    const { current, daily, alerts, suggestion, news, localEvents, aqi } = forecast;

    const alertsHTML = alerts && alerts.length > 0 ? `
        <section id="weather-alerts">
            ${alerts.map(alert => `
                <div class="alert-card severity-${alert.severity.toLowerCase().trim().replace(/\s+/g, '-')}">
                    <div class="alert-header">
                        <svg class="alert-icon"><use href="#icon-alert"></use></svg>
                        <h4>${alert.title}</h4>
                    </div>
                    <p class="alert-description"><strong>${alert.severity}:</strong> ${alert.description}</p>
                </div>
            `).join('')}
        </section>
    ` : '';
    
    const suggestionHTML = suggestion ? `
        <section id="ai-suggestion">
            <div class="suggestion-icon">💡</div>
            <p><strong>Today's Tip:</strong> ${suggestion}</p>
        </section>
    ` : '';

    // --- AQI Content (now part of Details) ---
    const aqiContentHTML = aqi ? `
        <h3 class="details-heading" style="margin-top: 2.5rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">Air Quality</h3>
        <div class="aqi-panel-content">
            ${renderAqiPanel(aqi)}
        </div>
    ` : '';

    // --- Details Panel Content ---
    const detailsHeaderHTML = `
        <div class="details-header">
            <h3 class="details-heading">Current Weather Details</h3>
            <button id="customize-btn" aria-label="Customize dashboard" title="Customize dashboard">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
        </div>
    `;
    const metricCards: { [key: string]: string } = {
        humidity: `<div class="detail-card"><p class="detail-label"><svg><use href="#icon-humidity"></use></svg>Humidity</p><p class="detail-value">${current.humidity}<span>%</span></p></div>`,
        windSpeed: `<div class="detail-card"><p class="detail-label"><svg><use href="#icon-wind"></use></svg>Wind Speed</p><p class="detail-value">${current.windSpeed}<span> km/h</span></p></div>`,
        pressure: `<div class="detail-card"><p class="detail-label"><svg><use href="#icon-pressure"></use></svg>Pressure</p><p class="detail-value">${current.pressure}<span> hPa</span></p></div>`,
        visibility: `<div class="detail-card"><p class="detail-label"><svg><use href="#icon-visibility"></use></svg>Visibility</p><p class="detail-value">${current.visibility}<span> km</span></p></div>`,
        feelsLike: `<div class="detail-card"><p class="detail-label"><svg><use href="#icon-thermometer"></use></svg>Feels Like</p><p class="detail-value">${current.feelsLike}<span>°C</span></p></div>`,
        uvIndex: `<div class="detail-card"><p class="detail-label"><svg><use href="#icon-uv"></use></svg>UV Index</p><p class="detail-value">${current.uvIndex}</p></div>`,
        sunrise: `<div class="detail-card"><p class="detail-label"><svg><use href="#icon-sunrise"></use></svg>Sunrise</p><p class="detail-value">${current.sunrise}</p></div>`,
        sunset: `<div class="detail-card"><p class="detail-label"><svg><use href="#icon-sunset"></use></svg>Sunset</p><p class="detail-value">${current.sunset}</p></div>`
    };
    let detailsGridHTML = visibleMetrics.length > 0 ? `<section id="today-details-grid">` : '';
    visibleMetrics.forEach(metric => {
        if (metricCards[metric]) detailsGridHTML += metricCards[metric];
    });
    if (visibleMetrics.length > 0) detailsGridHTML += `</section>`;
    const detailsPanelHTML = `${detailsHeaderHTML}${detailsGridHTML}${aqiContentHTML}`;
    
    // --- Daily Forecast Panel Content ---
    const dailyPanelHTML = daily.map((day, index) => `
        <div class="weather-card" style="animation-delay: ${index * 0.1}s;">
            <h3>${day.day}</h3>
            <svg class="weather-icon-small"><use href="${getWeatherIcon(day.condition)}"></use></svg>
            <p class="condition">${day.condition}</p>
            <p class="temp"><span>H:</span>${day.high}° <span>L:</span>${day.low}°</p>
        </div>
    `).join('');

    // --- News & Events Panel Content ---
    const newsHTML = news ? `
        <h3 class="tab-heading"><svg><use href="#icon-news"></use></svg>Weather News</h3>
        <div class="news-card">
            <h4>${news.title}</h4>
            <p>${news.snippet}</p>
        </div>
    ` : '';
    const eventsHTML = localEvents && localEvents.length > 0 ? `
        <h3 class="tab-heading"><svg><use href="#icon-calendar"></use></svg>Local Events Outlook</h3>
        <div id="local-events-list">
        ${localEvents.map(event => `
            <div class="event-card">
                <h4>${event.title}</h4>
                <p>${event.description}</p>
            </div>
        `).join('')}
        </div>
    ` : '';
    const newsAndEventsPanelHTML = `<div class="news-and-events-panel">${newsHTML}${eventsHTML}</div>`;

    // --- Main Render ---
    forecastContent.innerHTML = `
        <div class="forecast-display">
            <header id="forecast-header">
                <h2 id="forecast-city-name">${current.city}</h2>
                <div id="forecast-header-actions"></div>
            </header>
            ${alertsHTML}
            <p class="ai-summary">${summary}</p>
            ${suggestionHTML}
            <section id="current-weather-spotlight">
                <div class="spotlight-main">
                    <svg class="weather-icon-large"><use href="${getWeatherIcon(current.condition)}"></use></svg>
                    <div class="spotlight-text">
                        <div class="spotlight-temp">${current.temp}°C</div>
                        <p class="spotlight-condition">${current.condition}</p>
                        <p class="spotlight-highlow">High: ${current.high}° / Low: ${current.low}°</p>
                    </div>
                </div>
            </section>

            <section id="forecast-tabs-container">
                <div class="forecast-tabs">
                    <button class="tab-btn active" data-tab="panel-daily" aria-controls="panel-daily"><svg><use href="#icon-calendar"></use></svg>5-Day Forecast</button>
                    <button class="tab-btn" data-tab="panel-details" aria-controls="panel-details"><svg><use href="#icon-info"></use></svg>Details</button>
                    <button class="tab-btn" data-tab="panel-news" aria-controls="panel-news"><svg><use href="#icon-news"></use></svg>News & Events</button>
                </div>
                <div class="tab-content">
                    <div id="panel-daily" class="tab-panel daily-forecast-container active" role="tabpanel">${dailyPanelHTML}</div>
                    <div id="panel-details" class="tab-panel" role="tabpanel">${detailsPanelHTML}</div>
                    <div id="panel-news" class="tab-panel" role="tabpanel">${newsAndEventsPanelHTML}</div>
                </div>
            </section>
        </div>
    `;

    // Add event listeners
    forecastContent.querySelector('#customize-btn')?.addEventListener('click', openCustomizeModal);
    setupTabs();
    if (aqi) {
        setupAqiInteractions(aqi);
    }
    
    renderHeaderActions();
};

/**
 * Sets up the event listeners for the tabbed interface.
 */
const setupTabs = () => {
    const tabContainer = forecastContent?.querySelector('.forecast-tabs');
    if (!tabContainer) return;

    tabContainer.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const clickedTab = target.closest('.tab-btn');
        if (!clickedTab || clickedTab.classList.contains('active')) return;

        const targetPanelId = clickedTab.getAttribute('data-tab');
        if (!targetPanelId) return;

        const forecastDisplay = forecastContent?.querySelector('.forecast-display');

        // Deactivate current tab and panel
        tabContainer.querySelector('.tab-btn.active')?.classList.remove('active');
        forecastDisplay?.querySelector('.tab-panel.active')?.classList.remove('active');
        
        // Activate new tab and panel
        clickedTab.classList.add('active');
        forecastDisplay?.querySelector(`#${targetPanelId}`)?.classList.add('active');
    });
};

const renderSkeletonForecast = () => {
    if (!forecastContent) return;
    forecastContent.innerHTML = `
    <div class="forecast-display skeleton">
      <div class="skeleton-header">
        <div class="skeleton-line" style="width: 40%;"></div>
        <div class="skeleton-circle"></div>
      </div>
      <div class="skeleton-line" style="width: 90%; height: 60px; margin-top: 1rem;"></div>
      <div class="skeleton-line" style="width: 100%; height: 40px; margin-top: 1rem;"></div>
      <div class="skeleton-spotlight">
        <div class="skeleton-circle" style="width: 100px; height: 100px;"></div>
        <div class="skeleton-text-group">
          <div class="skeleton-line" style="width: 120px; height: 50px;"></div>
          <div class="skeleton-line" style="width: 150px;"></div>
          <div class="skeleton-line" style="width: 100px;"></div>
        </div>
      </div>
      <div class="skeleton-tabs">
        <div class="skeleton-line" style="width: 100px; height: 30px;"></div>
        <div class="skeleton-line" style="width: 80px; height: 30px;"></div>
        <div class="skeleton-line" style="width: 110px; height: 30px;"></div>
      </div>
      <div class="skeleton-card-grid">
        ${Array(5).fill(0).map(() => `<div class="skeleton-card"></div>`).join('')}
      </div>
    </div>
  `;
}

/**
 * Renders an animated overlay of weather icons.
 * @returns {HTMLElement} - The overlay element with animated icons.
 */
const renderAnimatedIconLoader = (): HTMLElement => {
    const icons = ['#icon-sun', '#icon-cloud', '#icon-rain', '#icon-snow', '#icon-thunderstorm', '#icon-mist', '#icon-cloud-sun'];
    const overlay = document.createElement('div');
    overlay.id = 'animated-loader-overlay';

    for (let i = 0; i < 20; i++) { // Generate 20 icons for a fuller effect
        const iconId = icons[Math.floor(Math.random() * icons.length)];
        const left = Math.random() * 95 + 2.5;
        const animationDuration = Math.random() * 5 + 4; // 4s to 9s
        const animationDelay = Math.random() * 7; // up to 7s delay for more randomness
        const size = Math.random() * 40 + 20; // 20px to 60px

        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.classList.add('loader-icon');
        svg.style.left = `${left}%`;
        svg.style.width = `${size}px`;
        svg.style.height = `${size}px`;
        svg.style.animationDuration = `${animationDuration}s`;
        svg.style.animationDelay = `${animationDelay}s`;

        const use = document.createElementNS(svgNS, "use");
        use.setAttribute('href', iconId);

        svg.appendChild(use);
        overlay.appendChild(svg);
    }
    return overlay;
};


/**
 * Sets the loading state of the UI.
 * @param {boolean} isLoading - Whether to show the loading state.
 * @param {string} [location=''] - The location being fetched.
 */
const setLoading = (isLoading: boolean, location = '') => {
  if (!forecastContent || !submitButton) return;

  if (isLoading) {
    submitButton.disabled = true;
    submitButton.innerHTML = `<div class="loader" style="width: 24px; height: 24px; border-width: 2px;"></div><span>Fetching...</span>`;
    renderSkeletonForecast();
    const skeletonContainer = forecastContent.querySelector('.forecast-display.skeleton');
    if (skeletonContainer) {
        skeletonContainer.appendChild(renderAnimatedIconLoader());
    }
  } else {
    submitButton.disabled = false;
    submitButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m22 2-7 20-4-9-9-4Z"/>
        <path d="m22 2-11 11"/>
      </svg>
      <span>Get Forecast</span>`;
  }
};


/**
 * Renders an error message in the result container.
 * @param {string} message - The error message to display.
 */
const renderError = (message: string) => {
  if (!forecastContent) return;
  forecastContent.innerHTML = `<p class="message error-message">${message}</p>`;
};

/**
 * Renders a welcome message in the result container.
 */
const renderWelcomeMessage = () => {
  if (!forecastContent) return;
  forecastContent.innerHTML = `<p class="message">Enter a city above to see the weather forecast.</p>`;
};

/**
 * Shows a toast notification.
 * @param {string} message - The message to display.
 */
const showToast = (message: string) => {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.classList.add('visible');
    }, 10);

    // Animate out and remove after a few seconds
    setTimeout(() => {
        toast.classList.remove('visible');
        toast.addEventListener('transitionend', () => toast.remove());
    }, 4000);
};


// --- Dashboard Customization ---

/**
 * Loads user's dashboard preferences from LocalStorage.
 */
const loadDashboardPreferences = () => {
    const stored = localStorage.getItem('visibleMetrics');
    if (stored) {
        visibleMetrics = JSON.parse(stored);
    } else {
        // Default to all metrics being visible
        visibleMetrics = [...ALL_METRICS];
    }
};

/**
 * Opens the dashboard customization modal and populates it.
 */
const openCustomizeModal = () => {
    if (!dashboardModal || !metricsOptions) return;

    metricsOptions.innerHTML = ALL_METRICS.map(metric => {
        const isChecked = visibleMetrics.includes(metric);
        const label = metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        return `
            <div class="metric-option">
                <input type="checkbox" id="metric-${metric}" value="${metric}" ${isChecked ? 'checked' : ''}>
                <label for="metric-${metric}">${label}</label>
            </div>
        `;
    }).join('');

    dashboardModal.classList.add('visible');
};


/**
 * Saves the user's dashboard preferences and re-renders the forecast.
 */
const handleSaveDashboard = () => {
    if (!dashboardModal || !metricsOptions) return;
    
    const selectedMetrics: string[] = [];
    metricsOptions.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        if ((checkbox as HTMLInputElement).checked) {
            selectedMetrics.push((checkbox as HTMLInputElement).value);
        }
    });

    visibleMetrics = selectedMetrics;
    localStorage.setItem('visibleMetrics', JSON.stringify(visibleMetrics));

    dashboardModal.classList.remove('visible');

    // Re-render the forecast if data is available
    if (currentForecastData) {
        renderForecast();
    }
};



// --- Local Storage and Saved Locations ---

/**
 * Reusable logic to add event listeners to a single location card.
 * @param {Element} card - The card element to attach listeners to.
 */
const addCardEventListeners = (card: Element) => {
    card.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const location = card.getAttribute('data-location');
        if (target.classList.contains('remove-btn')) {
            e.stopPropagation();
            removeLocation(target.getAttribute('data-location-remove')!);
        } else if (location) {
            if (cityInput) cityInput.value = location;
            currentCity = location;
            getForecast(location);
        }
    });
};

const loadSavedLocations = async () => {
  const stored = localStorage.getItem('savedLocations');
  if (stored) {
    savedLocations = JSON.parse(stored);
  }
  renderSavedLocations();
  await loadSavedLocationForecasts();
};

const renderSavedLocations = () => {
  if (!savedLocationsContainer) return;
  
  const currentLocationBtnHTML = `
    <button class="saved-location-card current-location-btn" aria-label="Use my current location">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
      <span>Current Location</span>
    </button>
  `;

  const savedLocationsHTML = savedLocations
    .map(
      (loc) => `
    <div class="saved-location-card loading" data-location="${loc}">
      <span class="location-name">${loc}</span>
      <div class="location-weather"></div>
      <button class="remove-btn" data-location-remove="${loc}" aria-label="Remove ${loc}">&times;</button>
    </div>`
    )
    .join('');
    
  savedLocationsContainer.innerHTML = currentLocationBtnHTML + savedLocationsHTML;

  // Add event listeners
  savedLocationsContainer.querySelector('.current-location-btn')?.addEventListener('click', handleUseMyLocation);
  savedLocationsContainer.querySelectorAll('.saved-location-card[data-location]').forEach(addCardEventListeners);
};

const loadSavedLocationForecasts = async () => {
    if (savedLocations.length === 0) return;

    try {
        const forecasts = await GeminiService.fetchMultipleSimpleForecasts(savedLocations);
        const forecastMap = new Map(forecasts.map(f => [f.city, f]));

        savedLocations.forEach(location => {
            const card = savedLocationsContainer?.querySelector(`.saved-location-card[data-location="${location}"]`) as HTMLElement | null;
            if (!card) return;

            const forecast = forecastMap.get(location);
            const weatherEl = card.querySelector('.location-weather');

            if (weatherEl) {
                if (forecast && forecast.temp !== null && forecast.condition) {
                    weatherEl.innerHTML = `
                        <svg class="weather-icon-tiny"><use href="${getWeatherIcon(forecast.condition)}"></use></svg>
                        <span>${forecast.temp}°</span>
                    `;
                } else {
                    weatherEl.innerHTML = `<span>-</span>`;
                }
            }
            card.classList.remove('loading');
        });

    } catch (error) {
        console.error('Could not load forecasts for saved locations', error);
        savedLocationsContainer?.querySelectorAll('.saved-location-card[data-location]').forEach(cardEl => {
            const card = cardEl as HTMLElement;
            card.classList.remove('loading');
            const weatherEl = card.querySelector('.location-weather');
            if (weatherEl) {
                if (error.toString().includes('429')) {
                    weatherEl.innerHTML = `<span title="API rate limit reached.">...</span>`;
                } else {
                    weatherEl.innerHTML = `<span>-</span>`;
                }
            }
        });
    }
};


const renderHeaderActions = () => {
    const wrapper = document.getElementById('forecast-header-actions');
    if (!wrapper || !currentCity || currentCity === 'Current Location') {
        if (wrapper) wrapper.innerHTML = '';
        return;
    }

    const isSaved = savedLocations.includes(currentCity);
    const iconId = isSaved ? 'icon-bookmark-saved' : 'icon-bookmark-add';
    const title = isSaved ? `Remove "${currentCity}" from saved locations` : `Save "${currentCity}"`;
    
    wrapper.innerHTML = `
        <button id="history-btn" aria-label="View weather history" title="View weather history">
            <svg><use href="#icon-history"></use></svg>
        </button>
        <button id="save-location-btn" class="${isSaved ? 'saved' : ''}" aria-label="${title}" title="${title}">
            <svg><use href="#${iconId}"></use></svg>
        </button>`;

    document.getElementById('save-location-btn')?.addEventListener('click', toggleSaveCurrentLocation);
    document.getElementById('history-btn')?.addEventListener('click', openHistoryModal);
};

/**
 * Creates and appends a single location card to the UI, then fetches its weather.
 * @param {string} location - The city name to add.
 */
const addLocationCard = (location: string) => {
    if (!savedLocationsContainer) return;
    const cardHTML = `
        <div class="saved-location-card loading" data-location="${location}">
          <span class="location-name">${location}</span>
          <div class="location-weather"></div>
          <button class="remove-btn" data-location-remove="${location}" aria-label="Remove ${location}">&times;</button>
        </div>`;
    savedLocationsContainer.insertAdjacentHTML('beforeend', cardHTML);
    const newCard = savedLocationsContainer.querySelector(`.saved-location-card[data-location="${location}"]`);
    if (newCard) {
        addCardEventListeners(newCard);
        
        // Asynchronously fetch weather for the new card
        (async () => {
            try {
                const forecasts = await GeminiService.fetchMultipleSimpleForecasts([location]);
                if (forecasts.length > 0) {
                    const forecast = forecasts[0];
                    const weatherEl = newCard.querySelector('.location-weather');
                    if (weatherEl && forecast.temp !== null && forecast.condition) {
                        weatherEl.innerHTML = `
                            <svg class="weather-icon-tiny"><use href="${getWeatherIcon(forecast.condition)}"></use></svg>
                            <span>${forecast.temp}°</span>
                        `;
                    } else if (weatherEl) {
                        weatherEl.innerHTML = `<span>-</span>`;
                    }
                }
            } catch (error) {
                console.error(`Could not load forecast for ${location}`, error);
                const weatherEl = newCard.querySelector('.location-weather');
                if (weatherEl) {
                    if (error.toString().includes('429')) {
                        weatherEl.innerHTML = `<span title="API rate limit reached.">...</span>`;
                    } else {
                        weatherEl.innerHTML = `<span>-</span>`;
                    }
                }
            } finally {
                newCard.classList.remove('loading');
            }
        })();
    }
};

/**
 * Removes a location card from the UI.
 * @param {string} location - The city name to remove.
 */
const removeLocationCard = (location: string) => {
    const card = savedLocationsContainer?.querySelector(`.saved-location-card[data-location="${location}"]`);
    card?.remove();
};


const handleAddLocation = (e: SubmitEvent) => {
    e.preventDefault();
    if (!addCityInput) return;
    const newCity = addCityInput.value.trim();
    if (newCity && !savedLocations.includes(newCity)) {
        savedLocations.push(newCity);
        localStorage.setItem('savedLocations', JSON.stringify(savedLocations));
        addLocationCard(newCity);
        renderHeaderActions(); // Update main bookmark icon if needed
        showToast(`Added "${newCity}" to your locations.`);
    } else if (savedLocations.includes(newCity)) {
        showToast(`"${newCity}" is already in your locations.`);
    }
    addLocationForm?.reset();
    addLocationModal?.classList.remove('visible');
};

const toggleSaveCurrentLocation = () => {
    if (currentCity && currentCity !== 'Current Location') {
        const isSaved = savedLocations.includes(currentCity);
        if (isSaved) {
            savedLocations = savedLocations.filter(l => l !== currentCity);
            removeLocationCard(currentCity);
        } else {
            savedLocations.push(currentCity);
            addLocationCard(currentCity);
        }
        localStorage.setItem('savedLocations', JSON.stringify(savedLocations));
        renderHeaderActions();
    }
};

const removeLocation = (location: string) => {
    savedLocations = savedLocations.filter(l => l !== location);
    localStorage.setItem('savedLocations', JSON.stringify(savedLocations));
    removeLocationCard(location);
    renderHeaderActions();
};

// --- Alert Banner ---
const initializeAlertBanner = () => {
    if (!alertBanner || !allowAlertsBtn || !denyAlertsBtn) return;
    
    const preference = localStorage.getItem('alertNotificationPreference');
    if (!preference) {
        // No preference set, show the banner
        alertBanner.classList.remove('hidden');
    }

    allowAlertsBtn.addEventListener('click', () => {
        localStorage.setItem('alertNotificationPreference', 'allowed');
        alertBanner.classList.add('hidden');
        showToast('Thank you! You will be notified of severe weather alerts.');
    });

    denyAlertsBtn.addEventListener('click', () => {
        localStorage.setItem('alertNotificationPreference', 'denied');
        alertBanner.classList.add('hidden');
    });
};


// --- Vacation Planner ---

const handleVacationExit = () => {
    if (vacationModal) {
        vacationModal.classList.remove('visible');
        // Reset vacation modal view
        if(vacationFormContainer && vacationPlanResults) {
            vacationFormContainer.classList.remove('hidden');
            vacationPlanResults.classList.add('hidden');
            vacationPlanResults.innerHTML = '';
        }
        if(vacationForm) vacationForm.reset();
        if(vacationStartDateInput) vacationStartDateInput.value = '';
    }
};

const handleVacationFormSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    hideAllSuggestions();
    if (!vacationCityInput?.value || !vacationStartDateInput?.value || !vacationDurationInput?.value) {
        showToast("Please fill in all fields: destination, start date, and duration.");
        return;
    }

    const destination = vacationCityInput.value.trim();
    const startDate = new Date(vacationStartDateInput.value + 'T00:00:00'); // Avoid timezone issues
    const duration = parseInt(vacationDurationInput.value, 10);

    if (isNaN(duration) || duration < 1) {
        showToast("Duration must be a number and at least 1 day.");
        return;
    }
    
    // Calculate end date
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + duration - 1);

    // Format dates as YYYY-MM-DD strings
    const startDateString = vacationStartDateInput.value;
    const endDateString = endDate.toISOString().split('T')[0];
    
    await getVacationPlan(destination, startDateString, endDateString);
};

const getVacationPlan = async (destination: string, startDate: string, endDate: string) => {
    if (!vacationPlanResults || !vacationFormContainer) return;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Show loader in results area
    vacationFormContainer.classList.add('hidden');
    vacationPlanResults.classList.remove('hidden');
    vacationPlanResults.innerHTML = `
      <div class="loader-container">
        <div class="loader"></div>
        <p>Crafting your perfect ${duration}-day vacation plan for ${destination}...</p>
        <p style="font-size: 0.9rem; color: var(--text-secondary-color); margin-top: 0.5rem;">This might take a moment!</p>
      </div>`;

    try {
        const planData = await GeminiService.fetchVacationPlan(destination, startDate, endDate);
        renderVacationPlan(planData);

    } catch (error) {
        console.error('Error fetching vacation plan:', error);
        const errorMessage = error.toString().includes('429')
          ? 'Too many requests. Please wait a moment and try again.'
          : 'Could not create a vacation plan. Please try a different destination or check your connection.';
        
        vacationPlanResults.innerHTML = `
            <p class="message error-message">${errorMessage}</p>
            <button id="vacation-back-btn">Try Again</button>
        `;
        vacationPlanResults.querySelector('#vacation-back-btn')?.addEventListener('click', () => {
            if (vacationFormContainer) {
                vacationFormContainer.classList.remove('hidden');
            }
            if (vacationPlanResults) {
                vacationPlanResults.classList.add('hidden');
            }
        });
    }
};

const renderVacationPlan = (planData: VacationPlanResponse) => {
    if (!vacationPlanResults) return;

    const duration = planData.plan.length;
    const planDaysHTML = planData.plan.map((day, index) => `
        <div class="vacation-day-card" style="animation-delay: ${index * 0.15}s;">
            <div class="vacation-day-card-header">
                <h3>${day.day}</h3>
                <div class="vacation-day-weather">
                    <svg class="weather-icon-small"><use href="${getWeatherIcon(day.condition)}"></use></svg>
                    <p class="temp">H:${day.high}° / L:${day.low}°</p>
                </div>
            </div>
            <p class="weather-summary">${day.weatherSummary}</p>
            <h4>Suggested Activities:</h4>
            <ul class="vacation-activities-list">
                ${day.activities.map(activity => `<li>${activity}</li>`).join('')}
            </ul>
        </div>
    `).join('');

    vacationPlanResults.innerHTML = `
        <div class="vacation-plan-header">
            <h2>Your ${duration}-Day Plan for ${planData.destination}</h2>
            <p>Here's a suggested itinerary based on the weather forecast.</p>
            <button id="vacation-reset-btn">Plan Another Trip</button>
        </div>
        <div class="vacation-plan-days">
            ${planDaysHTML}
        </div>
    `;

    vacationPlanResults.querySelector('#vacation-reset-btn')?.addEventListener('click', () => {
        if(vacationFormContainer && vacationForm) {
            vacationFormContainer.classList.remove('hidden');
            if (vacationPlanResults) {
                vacationPlanResults.classList.add('hidden');
                vacationPlanResults.innerHTML = '';
            }
            vacationForm.reset();
            if(vacationStartDateInput) vacationStartDateInput.value = '';
        }
    });
};


// --- Agro Tips ---

const handleAgroExit = () => {
    if (agroModal) {
        agroModal.classList.remove('visible');
        // Reset agro modal view
        if(agroFormContainer && agroTipsResults) {
            agroFormContainer.classList.remove('hidden');
            agroTipsResults.classList.add('hidden');
            agroTipsResults.innerHTML = '';
        }
        if(agroForm) agroForm.reset();
    }
};

const handleAgroFormSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    hideAllSuggestions();
    if (!agroCityInput?.value) return;
    const destination = agroCityInput.value.trim();
    await getAgroTips(destination);
};

const getAgroTips = async (destination: string) => {
    if (!agroTipsResults || !agroFormContainer) return;

    // Show loader
    agroFormContainer.classList.add('hidden');
    agroTipsResults.classList.remove('hidden');
    agroTipsResults.innerHTML = `
      <div class="loader-container">
        <div class="loader"></div>
        <p>Gathering agricultural tips for ${destination}...</p>
      </div>`;

    try {
        const tipsData = await GeminiService.fetchAgroTips(destination);
        renderAgroTips(tipsData);

    } catch (error) {
        console.error('Error fetching agro tips:', error);
        const errorMessage = error.toString().includes('429')
          ? 'Too many requests. Please wait a moment and try again.'
          : 'Could not get agro tips. Please try a different location or check your connection.';

        agroTipsResults.innerHTML = `
            <p class="message error-message">${errorMessage}</p>
            <button id="agro-back-btn">Try Again</button>
        `;
        agroTipsResults.querySelector('#agro-back-btn')?.addEventListener('click', () => {
            if (agroFormContainer) {
                agroFormContainer.classList.remove('hidden');
            }
            if (agroTipsResults) {
                agroTipsResults.classList.add('hidden');
            }
        });
    }
};

const renderAgroTips = (tipsData: AgroTipsResponse) => {
    if (!agroTipsResults) return;

    const tipsHTML = tipsData.tips.map(item => `
        <div class="agro-tip-card">
            <svg class="agro-tip-icon"><use href="${getAgroTipIcon(item.category)}"></use></svg>
            <p>${item.tip}</p>
        </div>
    `).join('');

    agroTipsResults.innerHTML = `
        <div class="vacation-plan-header">
            <h2>Agro Tips for ${tipsData.destination}</h2>
            <p>Here are some suggestions based on the current weather forecast.</p>
            <button id="agro-reset-btn">Check Another Location</button>
        </div>
        <div class="agro-tips-grid">
            ${tipsHTML}
        </div>
    `;

    agroTipsResults.querySelector('#agro-reset-btn')?.addEventListener('click', () => {
        if(agroFormContainer && agroForm) {
            agroFormContainer.classList.remove('hidden');
            if (agroTipsResults) {
                agroTipsResults.classList.add('hidden');
                agroTipsResults.innerHTML = '';
            }
            agroForm.reset();
        }
    });
};

// --- Coastal Info ---

const handleCoastalExit = () => {
    if (coastalModal) {
        coastalModal.classList.remove('visible');
        // Reset coastal modal view
        if(coastalFormContainer && coastalInfoResults) {
            coastalFormContainer.classList.remove('hidden');
            coastalInfoResults.classList.add('hidden');
            coastalInfoResults.innerHTML = '';
        }
        if(coastalForm) coastalForm.reset();
    }
};

const handleCoastalFormSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    hideAllSuggestions();
    if (!coastalCityInput?.value) return;
    const location = coastalCityInput.value.trim();
    await getCoastalInfo(location);
};

const getCoastalInfo = async (location: string) => {
    if (!coastalInfoResults || !coastalFormContainer) return;

    // Show loader
    coastalFormContainer.classList.add('hidden');
    coastalInfoResults.classList.remove('hidden');
    coastalInfoResults.innerHTML = `
      <div class="loader-container">
        <div class="loader"></div>
        <p>Checking the coastline at ${location}...</p>
      </div>`;

    try {
        const infoData = await GeminiService.fetchCoastalInfo(location);

        if (!infoData.isCoastal) {
            coastalInfoResults.innerHTML = `
                <div style="text-align: center; padding: 1rem;">
                    <p class="message">No coastal region found for "${infoData.locationName}". Please try a different location.</p>
                    <button id="coastal-back-btn">Try Again</button>
                </div>
            `;
            coastalInfoResults.querySelector('#coastal-back-btn')?.addEventListener('click', () => {
                 if (coastalFormContainer) coastalFormContainer.classList.remove('hidden');
                 if (coastalInfoResults) {
                    coastalInfoResults.classList.add('hidden');
                    coastalInfoResults.innerHTML = '';
                 }
                 if (coastalForm) coastalForm.reset();
            });
        } else {
            renderCoastalInfo(infoData);
        }

    } catch (error) {
        console.error('Error fetching coastal info:', error);
        const errorMessage = 'Could not fetch coastal information. Please try again.';
        coastalInfoResults.innerHTML = `
            <div style="text-align: center; padding: 1rem;">
              <p class="message error-message">${errorMessage}</p>
              <button id="coastal-back-btn">Try Again</button>
            </div>
        `;
        coastalInfoResults.querySelector('#coastal-back-btn')?.addEventListener('click', () => {
             if (coastalFormContainer) coastalFormContainer.classList.remove('hidden');
             if (coastalInfoResults) {
                coastalInfoResults.classList.add('hidden');
                coastalInfoResults.innerHTML = '';
             }
             if (coastalForm) coastalForm.reset();
        });
    }
};

const renderCoastalInfo = (data: CoastalInfo) => {
    if (!coastalInfoResults) return;

    const tidesHTML = data.tide ? `
        <div class="coastal-detail-card">
            <h4>Tides</h4>
            <ul>
                <li><strong>High:</strong> ${data.tide.highTide.join(', ') || 'N/A'}</li>
                <li><strong>Low:</strong> ${data.tide.lowTide.join(', ') || 'N/A'}</li>
            </ul>
        </div>
    ` : '';

    const detailsHTML = [
        { label: 'Water Temp', value: data.waterTemp !== undefined ? `${data.waterTemp}°C` : 'N/A' },
        { label: 'Wave Height', value: data.waveHeight || 'N/A' },
        { label: 'Wind', value: data.wind || 'N/A' }
    ].map(detail => `
        <div class="coastal-detail-card">
            <h4>${detail.label}</h4>
            <p>${detail.value}</p>
        </div>
    `).join('');

    const safetyTipHTML = data.safetyTip ? `
        <div class="coastal-safety-tip">
            <h4>💡 Safety Tip</h4>
            <p>${data.safetyTip}</p>
        </div>
    ` : '';

    coastalInfoResults.innerHTML = `
        <div class="vacation-plan-header">
            <h2>Coastal Info for ${data.locationName}</h2>
            <button id="coastal-reset-btn">Check Another Location</button>
        </div>
        <div class="coastal-details-grid">
            ${tidesHTML}
            ${detailsHTML}
        </div>
        ${safetyTipHTML}
    `;

    coastalInfoResults.querySelector('#coastal-reset-btn')?.addEventListener('click', () => {
        if(coastalFormContainer && coastalForm) {
            coastalFormContainer.classList.remove('hidden');
            if (coastalInfoResults) {
                coastalInfoResults.classList.add('hidden');
                coastalInfoResults.innerHTML = '';
            }
            coastalForm.reset();
        }
    });
};

// --- Hiker/Trekker Mode ---

const handleHikerExit = () => {
    if (hikerModal) {
        hikerModal.classList.remove('visible');
        if(hikerFormContainer && hikerInfoResults) {
            hikerFormContainer.classList.remove('hidden');
            hikerInfoResults.classList.add('hidden');
            hikerInfoResults.innerHTML = '';
        }
        if(hikerForm) hikerForm.reset();
    }
};

const handleHikerFormSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    hideAllSuggestions();
    if (!hikerCityInput?.value) return;
    const location = hikerCityInput.value.trim();
    await getHikerInfo(location);
};

const getHikerInfo = async (location: string) => {
    if (!hikerInfoResults || !hikerFormContainer) return;

    // Show loader
    hikerFormContainer.classList.add('hidden');
    hikerInfoResults.classList.remove('hidden');
    hikerInfoResults.innerHTML = `
      <div class="loader-container">
        <div class="loader"></div>
        <p>Analyzing conditions at ${location}...</p>
      </div>`;

    try {
        const infoData = await GeminiService.fetchHikerInfo(location);

        if (!infoData.isMountainous) {
            hikerInfoResults.innerHTML = `
                <div style="text-align: center; padding: 1rem;">
                    <p class="message">"${infoData.locationName}" does not appear to be a recognized mountainous region. Please try a different location.</p>
                    <button id="hiker-back-btn">Try Again</button>
                </div>
            `;
            hikerInfoResults.querySelector('#hiker-back-btn')?.addEventListener('click', () => {
                 if (hikerFormContainer) hikerFormContainer.classList.remove('hidden');
                 if (hikerInfoResults) {
                    hikerInfoResults.classList.add('hidden');
                    hikerInfoResults.innerHTML = '';
                 }
                 if (hikerForm) hikerForm.reset();
            });
        } else {
            renderHikerInfo(infoData);
        }
    } catch (error) {
        console.error('Error fetching hiker info:', error);
        const errorMessage = 'Could not fetch hiker information. Please try again.';
        hikerInfoResults.innerHTML = `
            <div style="text-align: center; padding: 1rem;">
              <p class="message error-message">${errorMessage}</p>
              <button id="hiker-back-btn">Try Again</button>
            </div>
        `;
        hikerInfoResults.querySelector('#hiker-back-btn')?.addEventListener('click', () => {
             if (hikerFormContainer) hikerFormContainer.classList.remove('hidden');
             if (hikerInfoResults) {
                hikerInfoResults.classList.add('hidden');
                hikerInfoResults.innerHTML = '';
             }
             if (hikerForm) hikerForm.reset();
        });
    }
};

const renderHikerInfo = (data: HikerInfoResponse) => {
    if (!hikerInfoResults) return;

    const riskClass = getAvalancheRiskClass(data.avalancheRisk || '');

    hikerInfoResults.innerHTML = `
        <div class="vacation-plan-header">
            <h2>Hiker Info for ${data.locationName}</h2>
            <button id="hiker-reset-btn">Check Another Location</button>
        </div>
        <div class="hiker-details-grid">
            <div class="hiker-detail-card avalanche-risk-card ${riskClass}">
                <h4>Avalanche Risk</h4>
                <p class="avalanche-risk-value">${data.avalancheRisk || 'N/A'}</p>
            </div>
             <div class="hiker-detail-card">
                <h4>Wind Chill</h4>
                <p>${data.windChill ?? 'N/A'}<span>°C</span></p>
            </div>
             <div class="hiker-detail-card">
                <h4>Temperature</h4>
                <p>${data.temperature ?? 'N/A'}<span>°C</span></p>
            </div>
             <div class="hiker-detail-card">
                <h4>Wind Speed</h4>
                <p>${data.windSpeed ?? 'N/A'}<span> km/h</span></p>
            </div>
             <div class="hiker-detail-card">
                <h4>Elevation</h4>
                <p>${data.elevation ?? 'N/A'}<span> m</span></p>
            </div>
        </div>
        <div class="hiker-safety-message">
            <h4>💡 Safety Message</h4>
            <p>${data.safetyMessage || 'No specific safety alerts at this time. Always be prepared for changing conditions.'}</p>
        </div>
    `;

    hikerInfoResults.querySelector('#hiker-reset-btn')?.addEventListener('click', () => {
        if(hikerFormContainer && hikerForm) {
            hikerFormContainer.classList.remove('hidden');
            if (hikerInfoResults) {
                hikerInfoResults.classList.add('hidden');
                hikerInfoResults.innerHTML = '';
            }
            hikerForm.reset();
        }
    });
};

// --- Historical Weather ---

const openHistoryModal = () => {
    if (historyModal && historyCityName && historyDateInput) {
        historyCityName.textContent = currentCity;
        // Set max date to today
        historyDateInput.max = new Date().toISOString().split('T')[0];
        historyModal.classList.add('visible');
    }
};

const handleHistoryExit = () => {
    if (historyModal) {
        historyModal.classList.remove('visible');
        if (historyForm) historyForm.style.display = 'flex';
        if (historyResults) historyResults.innerHTML = '';
        if (historyForm) historyForm.reset();
    }
};

const handleHistoryFormSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    if (!historyDateInput?.value || !currentCity) return;
    const date = historyDateInput.value;
    await getHistoricalWeather(currentCity, date);
};

const getHistoricalWeather = async (city: string, date: string) => {
    if (!historyResults || !historyForm) return;

    historyForm.style.display = 'none';
    historyResults.innerHTML = `<div class="loader-container"><div class="loader"></div><p>Looking up the archives for ${date}...</p></div>`;

    try {
        const historyData = await GeminiService.fetchHistoricalWeather(city, date);
        renderHistoricalWeather(historyData);

    } catch (error) {
        console.error('Error fetching historical weather:', error);
        const errorMessage = 'Could not retrieve historical data for that date. Please try another.';
        historyResults.innerHTML = `<p class="message error-message" style="padding: 1rem;">${errorMessage}</p>`;
        setTimeout(() => {
            if (historyForm) historyForm.style.display = 'flex';
            if (historyResults) historyResults.innerHTML = '';
        }, 3000);
    }
};

const renderHistoricalWeather = (data: HistoricalWeatherResponse) => {
    if (!historyResults) return;

    historyResults.innerHTML = `
        <p class="history-summary">${data.summary}</p>
        <div class="history-grid">
            <div class="history-card">
                <p class="label">High / Low</p>
                <p class="value">${data.highTemp}° / ${data.lowTemp}°</p>
            </div>
            <div class="history-card">
                <p class="label">Avg. Temp</p>
                <p class="value">${data.avgTemp}°</p>
            </div>
            <div class="history-card">
                <p class="label">Precipitation</p>
                <p class="value">${data.precipitation}<span> mm</span></p>
            </div>
            <div class="history-card">
                <p class="label">Wind Speed</p>
                <p class="value">${data.windSpeed}<span> km/h</span></p>
            </div>
        </div>
    `;
};


// --- Helper and Utility Functions ---

/**
 * Creates a debounced function that delays invoking the func until after wait milliseconds have elapsed since the last time the debounced function was invoked.
 * @param func The function to debounce.
 * @param wait The number of milliseconds to delay.
 * @returns A new debounced function.
 */
const debounce = <F extends (...args: any[]) => any>(func: F, wait: number): ((...args: Parameters<F>) => void) => {
    let timeout: number;
    return (...args: Parameters<F>): void => {
        clearTimeout(timeout);
        timeout = window.setTimeout(() => func.apply(this, args), wait);
    };
};

/**
 * Returns an SVG icon ID for a given weather condition.
 * @param {string} condition - The weather condition string.
 * @returns {string} - The corresponding SVG icon ID.
 */
const getWeatherIcon = (condition: string): string => {
  const lowerCaseCondition = condition.toLowerCase();
  if (lowerCaseCondition.includes('thunderstorm')) return '#icon-thunderstorm';
  if (lowerCaseCondition.includes('drizzle')) return '#icon-rain';
  if (lowerCaseCondition.includes('rain')) return '#icon-rain';
  if (lowerCaseCondition.includes('snow')) return '#icon-snow';
  if (lowerCaseCondition.includes('mist') || lowerCaseCondition.includes('fog') || lowerCaseCondition.includes('haze')) return '#icon-mist';
  if (lowerCaseCondition.includes('clear')) return '#icon-sun';
  if (lowerCaseCondition.includes('sun')) {
    if (lowerCaseCondition.includes('cloud')) return '#icon-cloud-sun';
    return '#icon-sun';
  }
  if (lowerCaseCondition.includes('cloud')) return '#icon-cloud';
  return '#icon-cloud'; // Default icon
};

/**
 * Maps an agro tip category to an SVG icon ID.
 * @param {string} category - The category string from the API.
 * @returns {string} - The corresponding SVG icon ID.
 */
const getAgroTipIcon = (category: string): string => {
    switch(category.toLowerCase().trim()) {
        case 'planting':
            return '#icon-agro';
        case 'watering':
            return '#icon-humidity';
        case 'protection':
            return '#icon-alert';
        case 'general':
        default:
            return '#icon-info';
    }
}

/**
 * Returns a CSS class based on the avalanche risk level.
 * @param {string} risk - The avalanche risk string.
 * @returns {string} The corresponding CSS class name.
 */
const getAvalancheRiskClass = (risk: string): string => {
    const riskLevel = risk.toLowerCase();
    if (riskLevel.includes('extreme')) return 'risk-extreme';
    if (riskLevel.includes('high')) return 'risk-high';
    if (riskLevel.includes('considerable')) return 'risk-considerable';
    if (riskLevel.includes('moderate')) return 'risk-moderate';
    if (riskLevel.includes('low')) return 'risk-low';
    return '';
};

const flashInputFeedback = (success: boolean) => {
    if (!cityInput) return;
    const className = success ? 'input-success' : 'input-error';
    cityInput.classList.add(className);
    setTimeout(() => {
        cityInput.classList.remove(className);
    }, 1000);
}

// --- Theme Toggling ---
const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        document.body.dataset.theme = savedTheme;
    } else if (systemPrefersDark) {
        document.body.dataset.theme = 'dark';
    } else {
        document.body.dataset.theme = 'light';
    }
};

const toggleTheme = () => {
    const currentTheme = document.body.dataset.theme;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
};

// --- AQI Functions ---

/**
 * Gets a normalization maximum value for a given pollutant.
 * These values are based on the upper bound of the 'Moderate' AQI category.
 * @param pollutantName - The name of the pollutant (e.g., 'PM2.5').
 * @returns A number representing the max value for normalization.
 */
const getPollutantNormalizationMax = (pollutantName: string): number => {
    switch (pollutantName.toUpperCase()) {
        case 'PM2.5': return 35.4;
        case 'PM10': return 154;
        case 'O3': return 70; // in ppb for 8-hr
        case 'NO2': return 100; // in ppb for 1-hr
        case 'SO2': return 75; // in ppb for 1-hr
        case 'CO': return 9.4; // in ppm for 8-hr
        default: return 150; // A generic fallback for unknown pollutants
    }
};

/**
 * Renders the HTML for the Air Quality pollutant bar chart.
 * @param aqi - The Air Quality data.
 * @returns The HTML string for the bar chart.
 */
const renderAqiBarChart = (aqi: AirQualityIndex): string => {
    const barsHTML = aqi.pollutants.map(p => {
        const max = getPollutantNormalizationMax(p.name);
        // Calculate height, ensuring it's between 0 and 100
        const heightPercent = Math.max(0, Math.min(100, (p.value / max) * 100));
        const categoryClass = getPollutantCategoryClass(p.category);

        return `
            <div class="bar-wrapper">
                <div class="bar ${categoryClass}" style="height: ${heightPercent}%;"></div>
                <span class="bar-label">${p.name.replace('.', '')}</span>
            </div>
        `;
    }).join('');

    return `
        <div class="pollutant-barchart-container">
            <h4 class="pollutant-barchart-title">Key Pollutants (Normalized)</h4>
            <div class="pollutant-barchart">
                ${barsHTML}
            </div>
        </div>
    `;
};

/**
 * Renders the HTML for the Air Quality panel.
 * @param aqi - The Air Quality data.
 * @returns The HTML string for the panel.
 */
const renderAqiPanel = (aqi: AirQualityIndex): string => {
    const pollutantCardsHTML = aqi.pollutants.map(p => {
        const pCategoryClass = getPollutantCategoryClass(p.category);
        const iconId = `#icon-${p.name.toLowerCase().replace('.', '')}`;
        return `
            <div class="pollutant-card ${pCategoryClass}" data-pollutant-name="${p.name}">
                <div class="pollutant-card-header">
                    <svg class="pollutant-icon"><use href="${iconId}"></use></svg>
                    <span>${p.name}</span>
                </div>
                <p class="pollutant-value">${p.value}<span> ${p.unit}</span></p>
            </div>
        `;
    }).join('');

    return `
        <div class="aqi-gauge-container">
            <svg class="aqi-gauge-svg" viewBox="0 0 120 120">
                <circle class="aqi-gauge-track" cx="60" cy="60" r="50"></circle>
                <circle class="aqi-gauge-progress" cx="60" cy="60" r="50"></circle>
            </svg>
            <div class="aqi-gauge-text">
                <div class="aqi-gauge-value">${aqi.aqiValue}</div>
                <div class="aqi-gauge-category">${aqi.aqiCategory}</div>
            </div>
            <div id="aqi-tooltip"></div>
        </div>
        <div class="aqi-health-advisory" style="border-color: var(${getAqiColor(aqi.aqiCategory)})">
            <p>${aqi.healthAdvisory}</p>
        </div>
        <div class="pollutant-grid">
            ${pollutantCardsHTML}
        </div>
        ${renderAqiBarChart(aqi)}
        <div id="pollutant-details-panel"></div>
    `;
};

/**
 * Sets up the AQI gauge and event listeners after the panel is rendered.
 * @param aqi - The Air Quality data.
 */
const setupAqiInteractions = (aqi: AirQualityIndex) => {
    updateAqiGauge(aqi.aqiValue, aqi.aqiCategory);

    const aqiContainer = forecastContent?.querySelector('.aqi-panel-content');
    if (aqiContainer) {
        aqiContainer.addEventListener('click', (e) => handleAqiPanelClick(e, aqi));
    }

    // Tooltip Logic
    const gaugeContainer = forecastContent?.querySelector('.aqi-gauge-container');
    const tooltip = forecastContent?.querySelector('#aqi-tooltip') as HTMLElement | null;

    if (gaugeContainer && tooltip) {
        gaugeContainer.addEventListener('mouseenter', () => {
            const colorVar = getAqiColor(aqi.aqiCategory);
            tooltip.innerHTML = `<div class="tooltip-indicator" style="background-color: var(${colorVar})"></div><p><strong>${aqi.aqiValue}</strong> - ${aqi.aqiCategory}</p>`;
            tooltip.classList.add('visible');
        });
        gaugeContainer.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
    }
};

/**
 * Handles clicks within the AQI panel, specifically on pollutant cards.
 * @param e - The mouse event.
 * @param aqi - The Air Quality data.
 */
const handleAqiPanelClick = (e: Event, aqi: AirQualityIndex) => {
    const target = e.target as HTMLElement;
    const card = target.closest('.pollutant-card');
    if (!card) return;

    const pollutantName = card.getAttribute('data-pollutant-name');
    const pollutant = aqi.pollutants.find(p => p.name === pollutantName);

    if (pollutant) {
        if (selectedPollutant === pollutant.name) {
            // Deselect and hide panel
            selectedPollutant = null;
            updatePollutantDetails(null);
            card.classList.remove('active');
        } else {
            // Select new pollutant
            selectedPollutant = pollutant.name;
            updatePollutantDetails(pollutant);
            // Update active state on cards
            forecastContent?.querySelectorAll('.pollutant-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        }
    }
};

/**
 * Updates the details panel with information about the selected pollutant.
 * @param pollutant - The pollutant to display, or null to hide the panel.
 */
const updatePollutantDetails = (pollutant: Pollutant | null) => {
    const panel = document.getElementById('pollutant-details-panel') as HTMLElement | null;
    if (!panel) return;

    if (pollutant) {
        const categoryClass = getPollutantCategoryClass(pollutant.category);
        panel.innerHTML = `
            <div class="pollutant-details-content">
                <h3 class="pollutant-details-title">${pollutant.name} Details</h3>
                <div class="pollutant-details-category">
                    <span class="category-indicator ${categoryClass}"></span>
                    <span>${pollutant.category}</span>
                </div>
                <p class="pollutant-details-description">${pollutant.description}</p>
                <h4 class="pollutant-details-subtitle">Common Sources</h4>
                <p class="pollutant-details-sources">${pollutant.sources}</p>
            </div>
        `;
        panel.classList.add('visible');
    } else {
        panel.classList.remove('visible');
        // Clear content after transition
        setTimeout(() => { panel.innerHTML = ''; }, 500);
    }
};

/**
 * Updates the visual state of the AQI gauge.
 * @param value - The numerical AQI value.
 * @param category - The AQI category string.
 */
const updateAqiGauge = (value: number, category: string) => {
    const progressCircle = forecastContent?.querySelector('.aqi-gauge-progress') as SVGCircleElement | null;
    if (!progressCircle) return;

    const radius = progressCircle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    // Cap the AQI value at 300 for visualization purposes
    const cappedValue = Math.min(value, 301); 
    const offset = circumference - (cappedValue / 301) * circumference;

    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = String(offset);
    progressCircle.style.stroke = `var(${getAqiColor(category)})`;
};

/**
 * Converts an AQI category string to a CSS variable name.
 * @param category - The AQI category string.
 * @returns The CSS variable name for the color.
 */
const getAqiColor = (category: string): string => {
    const cat = category.toLowerCase().replace(/\s+/g, '-');
    switch (cat) {
        case 'good': return '--aqi-color-good';
        case 'moderate': return '--aqi-color-moderate';
        case 'unhealthy-for-sensitive-groups': return '--aqi-color-unhealthy-sensitive';
        case 'unhealthy': return '--aqi-color-unhealthy';
        case 'very-unhealthy': return '--aqi-color-very-unhealthy';
        case 'hazardous': return '--aqi-color-hazardous';
        default: return '--text-secondary-color';
    }
};

/**
 * Converts a pollutant category string into a CSS-friendly class name.
 * @param category - The pollutant category string.
 * @returns The generated CSS class name.
 */
const getPollutantCategoryClass = (category: string): string => {
  if (!category) return '';
  return 'pollutant-category-' + category.toLowerCase().trim().replace(/\s+/g, '-');
};

// --- Location Suggestions ---

/**
 * Sets up event listeners for all location input fields to provide autocomplete suggestions.
 */
const setupLocationSuggestions = () => {
    const inputs = [
        { input: cityInput, container: document.getElementById('city-suggestions') },
        { input: addCityInput, container: document.getElementById('add-city-suggestions') },
        { input: vacationCityInput, container: document.getElementById('vacation-suggestions') },
        { input: agroCityInput, container: document.getElementById('agro-suggestions') },
        { input: coastalCityInput, container: document.getElementById('coastal-suggestions') },
        { input: hikerCityInput, container: document.getElementById('hiker-suggestions') }
    ];

    const debouncedFetch = debounce(fetchAndShowSuggestions, 300);

    inputs.forEach(({ input, container }) => {
        if (input && container) {
            // Use debounce on input to avoid excessive API calls while typing
            input.addEventListener('input', () => debouncedFetch(input, container));
            // Show suggestions immediately on focus if there's already text
            input.addEventListener('focus', () => fetchAndShowSuggestions(input, container));
        }
    });
};

/**
 * Fetches and displays location suggestions based on the user's input.
 * @param inputEl - The input element being typed into.
 * @param containerEl - The container to display suggestions in.
 */
const fetchAndShowSuggestions = async (inputEl: HTMLInputElement, containerEl: HTMLElement) => {
    const query = inputEl.value.trim();
    if (query.length < 3) {
        containerEl.classList.remove('visible');
        return;
    }

    try {
        let suggestions: string[];
        if (suggestionsCache.has(query)) {
            suggestions = suggestionsCache.get(query)!;
        } else {
            suggestions = await GeminiService.fetchLocationSuggestions(query);
            suggestionsCache.set(query, suggestions);
        }

        if (suggestions.length > 0) {
            containerEl.innerHTML = suggestions.map(s => `<div class="suggestion-item">${s}</div>`).join('');
            containerEl.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('mousedown', (e) => handleSuggestionClick(e, inputEl, containerEl));
            });
            containerEl.classList.add('visible');
        } else {
            containerEl.classList.remove('visible');
        }
    } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        containerEl.classList.remove('visible');
    }
};

/**
 * Handles the click event on a suggestion item.
 * @param event - The mouse event.
 * @param inputEl - The input element to update.
 * @param containerEl - The suggestions container to hide.
 */
const handleSuggestionClick = (event: Event, inputEl: HTMLInputElement, containerEl: HTMLElement) => {
    event.preventDefault(); // Prevents the input from losing focus before the click is registered
    const target = event.target as HTMLElement;
    inputEl.value = target.textContent || '';
    containerEl.classList.remove('visible');
    inputEl.focus(); // Keep focus for form submission
};

/**
 * Hides all visible suggestion containers.
 */
const hideAllSuggestions = () => {
    document.querySelectorAll('.suggestions-container').forEach(container => {
        container.classList.remove('visible');
    });
};


// --- App Initialization ---
document.addEventListener('DOMContentLoaded', initializeApp);