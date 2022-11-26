const locationBtnRef = document.querySelector(".location-btn");
const saveBtnRef = document.querySelector(".save-btn");
const closeBtnRef = document.querySelector(".close-btn");
const inputWrapperRef = document.querySelector(".input-wrapper");
const cityInpRef = document.querySelector(".city-input");
let counter = 0;

locationBtnRef.addEventListener("click", changeLocation);
closeBtnRef.addEventListener("click", closeInputContainer);
saveBtnRef.addEventListener("click", updatelocation);

getDefaultCity();


function changeLocation(e) {
    //show location changing container
    console.log(e);
    ++counter;
    if (counter % 2 == 0) {
        inputWrapperRef.style.display = "none";
        locationBtnRef.innerHTML= "New Location &#127757;";
    } else {
        inputWrapperRef.style.display = "block";
        locationBtnRef.innerText = "CANCEL";
    }

}

function closeInputContainer() {
    inputWrapperRef.style.display = "none";
    locationBtnRef.innerHTML = "New Location &#127757;";
    cityInpRef.value = "";
    resetCounter();
}

function updatelocation(e) {
    const city = cityInpRef.value;
    inputWrapperRef.style.display = "none";
    getWeather(city).
    then((responseData) => {
        console.log(responseData);
        const filteredData = getFilteredData(responseData);
        updateUI(filteredData);
    }).catch(err => {
        window.localStorage.clear();
        alert("Please enter correct city");
    });

    window.localStorage.setItem("city", city);
    locationBtnRef.innerHTML = "New Location &#127757;";
    cityInpRef.value = "";
    resetCounter();
}

function getFilteredData(apiData) {
    let dataObj = {};
    dataObj["wind"] = apiData.wind.speed;
    dataObj["name"] = apiData.name;
    dataObj["weather"] = apiData.weather[0].main;
    dataObj["temperature"] = getTempValue(apiData.main.temp);
    dataObj["humidity"] = apiData.main.humidity;
    dataObj["visibility"] = apiData.visibility;
    dataObj["feels-like"] = getTempValue(apiData.main.feels_like);
    return dataObj;
}


function getTempValue(temperature) {
    return Math.round(Number(temperature - 273) * 10) / 10;
}

async function getWeather(city) {
    const apiKey = getApiKey();
    const promise = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
    const data = await promise.json();
    return data;
}

function updateUI(data) {
    document.querySelector(".city-name").innerText = data.name + " City";
    document.querySelector(".city-weather").innerText = "The weather is: " + (data.weather);
    document.querySelector(".city-temp").innerHTML = `Current Temperature: ${data.temperature} &#xb0;C`;
    document.querySelector(".humidity").innerText = "Humidity: " + (data.humidity) + "%";
    document.querySelector(".visibility").innerText = "Visibility: " + (data.visibility) + "m";
    document.querySelector(".feels-like").innerHTML = `Temperature Feels like: ${data.temperature} &#xb0;C`;
    document.querySelector(".wind-speed").innerText = "Wind speed: " + (data.wind) + " mph";
}

async function getDefaultCity() {
    let defaultCity;
    if (window.localStorage.getItem("city") === null) {
        defaultCity = "Mumbai";
    } else {
        defaultCity = window.localStorage.getItem("city");
    }
    const apiData = await getWeather(defaultCity).then((responseData) => responseData);
    const filteredData = getFilteredData(apiData);
    updateUI(filteredData);
}

function resetCounter() {
    counter = 0;
}

function getApiKey() {
    return 'a332c6f86e783841e5617882dfe41b01';
}