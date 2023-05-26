const BASE_URL = "https://gateway.marvel.com:443/v1/public";
const apiKey = "d700ede90447201db139ef31851dece5";
const publicKey = "d700ede90447201db139ef31851dece5";
const privateKey = "01926b7343e06a149b9d801b98f276ea19de64da";

function generateHash(timestamp) {
  return md5(`${timestamp}${privateKey}${publicKey}`);
}

const hashedApiKey = "0360acb023341c16dd769884da9d35ba";
console.log(window.location.pathname);
const fetchChar = async () => {
  console.log("char fetching");
  const timestamp = Date.now().toString();
  const hash = generateHash(timestamp);
  const url = `${BASE_URL}/characters?ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;
  console.log(url);
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data.data.results);
    const charContainer = document.querySelector(".char-container");
    document.querySelector(".skeleton ").remove();
    data.data.results.forEach((char) => {
      const charContainer = document.createElement("div");
      console.log();
      charContainer.innerHTML = `<div class="rounded-md flex flex-col bg-blue-900">
         <img class="h-48 rounded-t-lg w-full object-cover object-center" src="${char.thumbnail.path}.${char.thumbnail.extension}" alt="${char.name}">
  <div class="p-4">
    <h2 class="text-white text-center font-bold text-xl mb-2">${char.name}</h2>
  </div>
      </div>`;
      document.querySelector(".char-container").appendChild(charContainer);
    });
    // Process the data as needed
  } catch (error) {
    console.log("Error:", error);
  }
};

const fetchStones = () => {
  data.forEach((stone) => {
    const stoneContainer = document.createElement("div");
    stoneContainer.innerHTML = `
         <div class="stone-container__item">
           <div class="stone-card">
             <img class="stone" src="${stone.img}" alt="" />
             <p class="stone-name">Power Stone</p>
           </div>
         </div>
       `;

    document.querySelector(".stone-container").appendChild(stoneContainer);
  });
};

if (window.location.pathname === "/stones.html") {
  fetchStones();
}

if (window.location.pathname === "/char.html") {
  fetchChar();
}
