console.log(window.location.pathname === "/stones.html");
const getRandomCoordinates = () => {
  const lat = Math.random() * 180 - 90;
  console.log(lat);
  const lng = Math.random() * 360 - 180;

  return [lat, lng];
};
const getDistance = (location1, location2) => {
  const distance = haversineDistance(location1, location2);
  return distance;
};

const thanosLocation = {
  currentLocation: getRandomCoordinates(),
  targetLocation: [23.0827, 70.2707],
};

if (window.location.pathname === "/stones.html") {
  let nearestStone = null;
  let minDistance = Infinity;
  data.forEach((stone) => {
    const distance = getDistance(
      thanosLocation.currentLocation,
      stone.coordinates
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearestStone = stone;
    }
  });
  document.querySelector(
    ".stone_name"
  ).textContent = `${nearestStone.name} stone`;
  document.querySelector(".stone_img").src = nearestStone.img;
  document.querySelector(".distance").textContent = minDistance.toFixed(3);
  console.log(nearestStone.name);
} else {
  var map = L.map("map").setView(thanosLocation.currentLocation, 1);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  data.map((item, index) => {
    var greenIcon = L.icon({
      iconUrl: item.img,
      iconSize: [20, 20],
    });

    L.marker(item.coordinates, { icon: greenIcon })
      .addTo(map)
      .bindPopup(item.name);
  });
  L.marker(thanosLocation.currentLocation, {
    icon: L.icon({
      iconUrl: "./assets/images/thanos.png",
      iconSize: [20, 20],
    }),
  })
    .addTo(map)
    .bindPopup("Thanos");

  let nearestStone = null;
  let minDistance = Infinity;

  data.forEach((stone) => {
    const distance = getDistance(
      thanosLocation.currentLocation,
      stone.coordinates
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearestStone = stone;
    }
  });

  console.log(nearestStone);

  alert(
    `Thanos, the nearest stone is ${nearestStone.name}. Get ready to react!`
  );

  const targetCoordinates = nearestStone.coordinates;
  const thanosMarker = L.marker(thanosLocation.currentLocation, {
    icon: L.icon({
      iconUrl: "./assets/images/thanos.png",
      iconSize: [20, 20],
    }),
  }).addTo(map);

  const moveThanos = () => {
    const step = 0.08;
    const [currentLat, currentLng] = thanosLocation.currentLocation;
    const [targetLat, targetLng] = targetCoordinates;

    if (currentLat !== targetLat || currentLng !== targetLng) {
      if (currentLat < targetLat) {
        thanosLocation.currentLocation[0] += step;
      } else {
        thanosLocation.currentLocation[0] -= step;
      }

      if (currentLng < targetLng) {
        thanosLocation.currentLocation[1] += step;
      } else {
        thanosLocation.currentLocation[1] -= step;
      }

      thanosMarker.setLatLng(thanosLocation.currentLocation);

      const distance = getDistance(
        thanosLocation.currentLocation,
        targetCoordinates
      );

      if (distance < step) {
        console.log("Thanos has reached the target location!");
        clearInterval(intervalId);
        alert("Thanos has reached the target location!");
      }
    }
  };

  const intervalId = setInterval(moveThanos, 50);
}
