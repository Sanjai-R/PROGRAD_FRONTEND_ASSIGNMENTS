console.log(window.location.pathname);

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

const getClosestObject = (objects, location) => {
  let nearestObject = null;
  let minDistance = Infinity;
  objects.forEach((obj) => {
    const distance = getDistance(location, obj.coordinates);
    if (distance < minDistance) {
      minDistance = distance;
      nearestObject = obj;
    }
  });
  console.log(nearestObject);
  return nearestObject;
};

const moveMarker = (marker, targetLocation, stepSize) => {
  const [currentLat, currentLng] = marker.getLatLng();
  const [targetLat, targetLng] = targetLocation;
  let newLat = currentLat;
  let newLng = currentLng;

  if (currentLat !== targetLat || currentLng !== targetLng) {
    if (currentLat < targetLat) {
      newLat = currentLat + stepSize;
    } else {
      newLat = currentLat - stepSize;
    }

    if (currentLng < targetLng) {
      newLng = currentLng + stepSize;
    } else {
      newLng = currentLng - stepSize;
    }

    marker.setLatLng([newLat, newLng]);

    const distance = getDistance([newLat, newLng], targetLocation);

    if (distance < 10000) {
      console.log("Marker has reached the target location!");
      clearInterval(intervalId);
      alert("Marker has reached the target location!");
    }
  }
};

const setupMap = () => {
  var map = L.map("map").setView(thanosLocation.currentLocation, 1);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  avengersData.forEach((avenger) => {
    const avengerIcon = L.icon({
      iconUrl: avenger.img,
      iconSize: [20, 20],
    });
    L.marker(thanosLocation.targetLocation, { icon: avengerIcon })
      .addTo(map)
      .bindPopup(avenger.name);
  });

  data.map((item, index) => {
    var Icon = L.icon({
      iconUrl: item.img,
      iconSize: [20, 20],
    });

    L.marker(item.coordinates, { icon: Icon }).addTo(map).bindPopup(item.name);
  });

  L.marker(thanosLocation.currentLocation, {
    icon: L.icon({
      iconUrl: "./assets/images/thanos.png",
      iconSize: [20, 20],
    }),
  })
    .addTo(map)
    .bindPopup("Thanos");

  return map;
};

const moveThanosAndAvenger = (map, thanosLocation, targetCoordinates) => {
  const stepSize = 0.1;

  const thanosMarker = L.marker(thanosLocation.currentLocation, {
    icon: L.icon({
      iconUrl: "./assets/images/thanos.png",
      iconSize: [20, 20],
    }),
  }).addTo(map);

  const nearestStone = getClosestObject(data, thanosLocation.currentLocation);
  console.log(nearestStone);

  const targetMarker = L.marker(nearestStone.coordinates, {
    icon: L.icon({
      iconUrl: nearestStone.img,
      iconSize: [20, 20],
    }),
  }).addTo(map);

  const closestAvenger = getClosestObject(
    avengersData,
    nearestStone.coordinates
  );
  const closestAvengerMarker = L.marker(closestAvenger.coordinates, {
    icon: L.icon({
      iconUrl: closestAvenger.img,
      iconSize: [20, 20],
    }),
  }).addTo(map);

  const move = () => {
    moveMarker(thanosMarker, targetCoordinates, stepSize);
    moveMarker(closestAvengerMarker, nearestStone.coordinates, stepSize);
  };

  const intervalId = setInterval(move, 50);
};

if (window.location.pathname === "/stones.html") {
  let nearestStone = getClosestObject(data, thanosLocation.currentLocation);

  document.querySelector(
    ".stone_name"
  ).textContent = `${nearestStone.name} stone`;
  document.querySelector(".stone_img").src = nearestStone.img;
  document.querySelector(".distance").textContent = getDistance(
    thanosLocation.currentLocation,
    nearestStone.coordinates
  ).toFixed(3);
  console.log(nearestStone.name);
} else {
  const map = setupMap();
  moveThanosAndAvenger(map, thanosLocation, targetCoordinates);
}
