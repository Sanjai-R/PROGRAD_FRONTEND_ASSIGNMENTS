const baseUrl = "https://api.openweathermap.org/data/2.5/forecast";
const apiKey = "54863d221db85b9338b326f57a78298f";

const fetchData = async (cityName) => {
  try {
    const url = `${baseUrl}?q=${cityName}&units=metric&appid=${apiKey}`;
    const response = await fetch(url);
    const { list } = await response.json();
    const groupedData = groupDataByDate(list);
    const dateWithDataList = createDataList(groupedData);
    const objectList = setMainData(dateWithDataList);
    return objectList;
  } catch (error) {
    console.log("Error fetching data:", error);
    return null;
  }
};

const groupDataByDate = (data) => {
  return data.reduce((acc, item) => {
    const [date, time] = item.dt_txt.split(" ");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push({ time, ...item });
    return acc;
  }, {});
};

const createDataList = (groupedData) => {
  return Object.entries(groupedData).map(([date, data]) => ({
    date,
    data,
  }));
};

const setMainData = (data) => {
  console.log(data);
  const objectList = {};

  data.forEach((item) => {
    objectList[item.date] = item.data;
  });

  console.log(objectList);
  console.log(objectList);
  const currentItem = getCurrentTimeItem(data);
  const mainData = document.querySelector(".main_weather");
  const main_time = document.querySelector(".main_time");
  const main_temp_desc = document.querySelector(".main_temp_desc");
  const main_temp = document.querySelector(".main_temp");
  const main_feel = document.querySelector(".main_feel");
  const main_pressure = document.querySelector(".main_pressure");
  const main_humidity = document.querySelector(".main_humidity");
  const main_clouds = document.querySelector(".main_clouds");
  const main_windSpeed = document.querySelector(".main_windSpeed");
  const main_icon = document.querySelector(".main_icon");
  console.log(currentItem);

  main_temp.textContent = currentItem.main.temp + "°C";
  main_feel.textContent = currentItem.main.feels_like + "°C";
  main_temp_desc.textContent = currentItem.weather[0].description;
  main_time.textContent = moment(currentItem.time, "HH:mm:ss").format("h:mm A");
  main_pressure.textContent = currentItem.main.pressure + " hPa";
  main_humidity.textContent = currentItem.main.humidity + "%";
  main_windSpeed.textContent = currentItem.wind.speed + " m/s";
  main_clouds.textContent = currentItem.clouds.all + "%";
  main_icon.src = `http://openweathermap.org/img/wn/${currentItem.weather[0].icon}.png`;
  const currentDate = moment().format("YYYY-MM-DD");
  const todayData = data.find((item) => item.date === currentDate);

  if (todayData) {
    const weatherDataContainer = document.querySelector(
      ".weather_data_container"
    );

    // Clear previous data
    weatherDataContainer.innerHTML = "";

    // Iterate over each weather data item for today
    todayData.data.forEach((item) => {
      const time = moment(item.time, "HH:mm:ss").format("h:mm A");
      const temperature = `${item.main.temp}°C`;

      // Create a card for each weather data item
      const card = document.createElement("div");
      card.classList.add(
        "max-w-sm",
        "flex-1",
        "rounded",
        "overflow-hidden",
        "shadow-lg",
        "bg-white",
        
      );

      const cardContent = `
        <div class="px-6 py-4 grid justify-items-center">
          <div class="text-gray-700 text-xl font-semibold mb-4">${time}</div>
          <div class="mt-4">
            <div class="text-gray-700 font-semibold">Temperature</div>
            <img class="w-24 h-24" src="${getWeatherIconUrl(
              item.weather[0].icon
            )}">
            <div class="text-gray-900 text-3xl font-bold main_temp">${temperature}</div>
          </div>
        </div>
      `;

      card.innerHTML = cardContent;
      weatherDataContainer.appendChild(card);
    });
  }

  const nextDaysContainer = document.querySelector(".next_days_container");

  // Clear previous data
  nextDaysContainer.innerHTML = "";

  // Iterate over each day's weather data
  data.forEach((dayData) => {
    const card = createDayCard(dayData);

    nextDaysContainer.appendChild(card);
  });

  return objectList;
};

const getCurrentTimeItem = (data) => {
  const currentTime = moment();
  let closestItem = data[0].data[0];
  let closestTimeDiff = Math.abs(
    currentTime.diff(data[0].data[0].dt_txt, "hours")
  );

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].data.length; j++) {
      const itemTime = moment(data[i].data[j].dt_txt);
      const timeDiff = Math.abs(currentTime.diff(itemTime, "hours"));

      if (timeDiff < closestTimeDiff) {
        closestTimeDiff = timeDiff;
        closestItem = data[i].data[j];
      }
    }
  }

  return closestItem;
};

// Select City

const selectElement = document.querySelector("#citySelect");

selectElement.addEventListener("change", async function () {
  console.log(selectElement.value);
  const city = selectElement.value;
  const mainData = document.querySelector(".city_name");
  mainData.textContent = city;
  const objectList = await fetchData(city);
});

// Initialize with default city

const loadDefaultCity = async () => {
  const defaultCity = selectElement.value;
  const mainData = document.querySelector(".city_name");
  mainData.textContent = defaultCity;
  const objectList = await fetchData(defaultCity);
  console.log(objectList);
};
loadDefaultCity();
function createDayCard(dayData) {
  const card = document.createElement("div");
  card.classList.add(
    "max-w-sm",
    "rounded",
    "overflow-hidden",
    "shadow-lg",
    "bg-white",
    "text-center",
    "grid",
    "justify-items-center",
   
  );

  const date = document.createElement("div");
  date.classList.add("p-4", "text-xl", "font-semibold");
  date.textContent = moment(dayData.date).format("dddd, MMMM D");

  const icon = document.createElement("img");
  icon.classList.add("w-24", "h-24");
  icon.alt = "Weather Icon";
  icon.src = getWeatherIconUrl(dayData.data[0].weather[0].icon);

  const temperature = document.createElement("div");
  temperature.classList.add("p-4", "text-2xl", "font-semibold");
  temperature.textContent = `${dayData.data[0].main.temp}°C`;

  card.appendChild(date);
  card.appendChild(icon);
  card.appendChild(temperature);

  return card;
}
const getWeatherIconUrl = (iconCode) => {
  return `http://openweathermap.org/img/wn/${iconCode}.png`;
};
