let container = document.querySelector(".container");
let yourInfo = document.querySelector(".your-info");
let infoCountry = document.querySelector(".info-country");
let listNeighbors = document.querySelector(".list");
let erroR = document.querySelector(".error");

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
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} Error to get IP API`);
      }
      return response.json();
    })
    .then((result) => {
      renderYourIP(result);
      //new fetch to get info about the country
      return fetch(
        `https://restcountries.com/v3.1/name/${result.country.name}`
      );
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} Error to get Country API`);
      }
      return response.json();
    })
    .then((result) => {
      renderInfoCountry(result);
      if (result[0].borders.length > 0) {
        borders = result[0].borders;
      } else {
        listNeighbors.innerHTML = "There is no neighbor for this country";
      }
    })
    .then(function () {
      if (borders !== []) {
        for (const border of borders) {
          listNeighbors.innerHTML = "";
          const nei = fetch(`https://restcountries.com/v3.1/alpha/${border}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error(
                  `${response.status} Error to get neighbors API`
                );
                return;
              }
              return response.json();
            })
            .catch(
              (err) =>
                (erroR.innerHTML = `Somthing Not exptected happened : ${err}`)
            )
            .then((result) => {
              let data = `<span>${result[0].flag} ${result[0].name.common} </span>`;
              listNeighbors.innerHTML += data;
            });
        }
      }
    })
    .catch(
      (err) => (erroR.innerHTML = `Somthing Not exptected happened : ${err}`)
    )
    .finally(() => {
      container.style.opacity = 1;
    });
}

getIP();

document.addEventListener("click", function (e) {
  if (e.target.id === "myIP") {
    let ipValue = e.target.innerHTML;
    navigator.clipboard.writeText(e.target.innerHTML);
    e.target.style.color = "#9e0f0f";
    e.target.style.fontSize = "50px";
    e.target.innerHTML = "Copied!";
    setTimeout(function () {
      e.target.style.color = "#646464";
      e.target.innerHTML = ipValue;
      e.target.style.fontSize = "40px";
    }, 250);
  }
});
