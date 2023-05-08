let container = document.querySelector(".container");
let yourInfo = document.querySelector(".your-info");
let infoCountry = document.querySelector(".info-country");
let listNeighbors = document.querySelector(".list");

let borders = [];

//render for your-info
const renderYourIP = function (result) {
  let data = `
  <h2>My IPv4 Address</h2>
  <span class="ip" id="myIP">${result.ip}</span>
  <p>Your Location</p>
  <span class="location">${result.country.name}, ${result.city.name} ${result.country.flag}</span>
  <p class="test"></p>
`;
  yourInfo.innerHTML = data;
};

//render for info-country
const renderInfoCountry = function (result) {
  let data = `<div class="img"><img src="${result[0].flags.svg}" alt="" /></div>
  <ul>
    <li><span class="cN">${result[0].name.common}, ${
    result[0].capital[0]
  }</span></li>
    <li>Population: <span>${(result[0].population / 1000000).toFixed(
      1
    )}M poeple</span></li>
    <li>Timezone: <span>${result[0].timezones[0]}</span></li>
    <li>Concrency: <span>${Object.keys(result[0].currencies)[0]}</span></li>
  </ul>`;
  infoCountry.innerHTML = data;
};
//get Ip Address
function getIP() {
  fetch(
    "https://api.geoapify.com/v1/ipinfo?&apiKey=677f2c8db3534f2cae4c870925acac9f"
  )
    .then((response) => response.json())
    .then((result) => {
      renderYourIP(result);
      //new fetch to get info about the country
      return fetch(
        `https://restcountries.com/v3.1/name/${result.country.name}`
      );
    })
    .then((response) => response.json())
    .then((result) => {
      renderInfoCountry(result);
      if (result[0].borders.length > 0) {
        borders = result[0].borders;
        if (borders.indexOf("ISR") > -1) {
          borders.splice(borders.indexOf("ISR"), 1);
        }
      } else {
        listNeighbors.innerHTML = "There is no neighbor for this country";
      }
    })
    .then(function () {
      if (borders) {
        for (const border of borders) {
          listNeighbors.innerHTML = "";
          const nei = fetch(`https://restcountries.com/v3.1/alpha/${border}`)
            .then((response) => response.json())
            .then((result) => {
              console.log(result);
              let data = `<span>${result[0].flag} ${result[0].name.common} </span>`;
              listNeighbors.innerHTML += data;
            });
        }
      }
    })
    .finally(() => {
      container.style.opacity = 1;
    });
}

getIP();
