const apiKey  = "16b5aeed6e40f48303b937f356e61d48"
const apiCountryURL = "https://countryflagsapi.com/png/";
const apiUnsplash = "https://source.unsplash.com/1600x900/?";


const apiKeyUf = "http://www.geonames.org/childrenJSON?geonameId=3469034";
const apiKeyCity = "http://educacao.dadosabertosbr.com/api/cidades/"


const randomNumber = (valueMax) => parseInt(Math.random()*valueMax)



const initShowWeather = async() =>{

    const dataUF = await fetch(apiKeyUf)


    const responseUF = await dataUF.json()
    console.log(responseUF.geonames[randomNumber(responseUF.totalResultsCount)].adminCodes1.ISO3166_2)
    const UF = responseUF.geonames[randomNumber(responseUF.totalResultsCount)].adminCodes1.ISO3166_2

 
    const dataCity = await fetch(apiKeyCity + UF.toLowerCase(),{
        method: 'GET' 
    })

    
    const responseCity = await dataCity.json()
   


    const city = responseCity[randomNumber(responseCity.length)]

    console.log(city.split(""))
    const newCity = city
        .split("")
        .map((ele, index)=>{
            return (/[a-zA-Z\u00C0-\u00FF ]+/i.test(ele))?ele: "";
        })
        .filter(el=>el)
        .join("")
        .toLowerCase()

        showWeatherData(newCity)
}



const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");

const cityElement = document.querySelector("#city");
const tempElement = document.querySelector("#temperature span");
const descElement = document.querySelector("#description");
const weatherIconElement = document.querySelector("#weather-icon");
const countryElement = document.querySelector("#country");
const umidityElement = document.querySelector("#umidity span");
const windElement = document.querySelector("#wind span");

const weatherContainer = document.querySelector("#weather-data");

const errorMessageContainer = document.querySelector("#error-message");
const loader = document.querySelector("#loader");



// Loader
const toggleLoader = () => {
  loader.classList.toggle("hide");
};

const getWeatherData = async (city) => {


  toggleLoader();

  const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;

  const res = await fetch(apiWeatherURL);
  

    const data = await res.json();

  toggleLoader();

  return data;
};

// Tratamento de erro
const showErrorMessage = () => {
  errorMessageContainer.classList.remove("hide");
};

const hideInformation = () => {
  errorMessageContainer.classList.add("hide");
  weatherContainer.classList.add("hide");


};

const showWeatherData = async (city) => {
  hideInformation();

  const data = await getWeatherData(city);


  if (data.cod === "404") {
    showErrorMessage();
    
    setTimeout(()=>{
        window.location.reload();
    }, 5000)
    
    return;
  }

  cityElement.innerText = data.name;
  tempElement.innerText = parseInt(data.main.temp);
  descElement.innerText = data.weather[0].description;
  weatherIconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
  );
  countryElement.setAttribute("src", apiCountryURL + data.sys.country);
  umidityElement.innerText = `${data.main.humidity}%`;
  windElement.innerText = `${data.wind.speed}km/h`;

  // Change bg image
  document.body.style.backgroundImage = `url("${apiUnsplash + city}")`;

  weatherContainer.classList.remove("hide");
};

searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const city = cityInput.value;

  showWeatherData(city);
});

cityInput.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    const city = e.target.value;

    showWeatherData(city);
  }
});



