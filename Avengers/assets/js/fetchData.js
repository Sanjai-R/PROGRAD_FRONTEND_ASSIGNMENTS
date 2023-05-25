const BASE_URL = "https://gateway.marvel.com:443/v1/public";
const apiKey = "d700ede90447201db139ef31851dece5";

const hashedApiKey = "0360acb023341c16dd769884da9d35ba";
console.log(window.location.pathname)
const fetchChar = async () => {
  const response = await fetch(
    `${BASE_URL}/characters?apikey=${apiKey}&ts=1&hash=(md5_type_hash)`
  );
  console.log(`${BASE_URL}/characters?apikey=${apiKey}`);
  const data = await response.json();
  console.log(data);
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

if (window.location.pathname === "/Avengers/char.html") {
  fetchChar();
}
