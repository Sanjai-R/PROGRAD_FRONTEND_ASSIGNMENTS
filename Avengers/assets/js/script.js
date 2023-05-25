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

const getClosestAvenger = (location) => {
  let nearestAvenger = null;
  let minDistance = Infinity;
  avengersData.forEach((avenger) => {
    const distance = getDistance(location, avenger.coordinates);
    if (distance < minDistance) {
      minDistance = distance;
      nearestAvenger = avenger;
    }
  });
  console.log(nearestAvenger);
  return nearestAvenger;
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

  const targetCoordinates = nearestStone.coordinates;
  const thanosMarker = L.marker(thanosLocation.currentLocation, {
    icon: L.icon({
      iconUrl: "./assets/images/thanos.png",
      iconSize: [20, 20],
    }),
  }).addTo(map);

  avengersData.forEach((avenger) => {
    const avengerIcon = L.icon({
      iconUrl: avenger.img,
      iconSize: [20, 20],
    });

    L.marker(avenger.coordinates, { icon: avengerIcon })
      .addTo(map)
      .bindPopup(avenger.name);
  });

  var circle = L.circle(nearestStone.coordinates, {
    color: "red",
    fillColor: "#f03",
    fillOpacity: 0.5,
    radius: 1000000,
  }).addTo(map);

  const closestAvenger = getClosestAvenger(nearestStone.coordinates);
  const closestAvengerMarker = L.marker(closestAvenger.coordinates, {
    icon: L.icon({
      iconUrl: closestAvenger.img,
      iconSize: [20, 20],
    }),
  }).addTo(map);
  const moveCloseAvenger = () => {
    const step = 0.1;
    const currentLatLng = closestAvengerMarker.getLatLng();
    const currentLat = currentLatLng.lat;
    const currentLng = currentLatLng.lng;
    const [targetLat, targetLng] = nearestStone.coordinates;
    console.log(getDistance([currentLat, currentLng], nearestStone.coordinates));
    let newLat = currentLat;
    let newLng = currentLng;

    if (currentLat !== targetLat || currentLng !== targetLng) {
      if (currentLat < targetLat) {
        newLat = currentLat + step;
      } else {
        newLat = currentLat - step;
      }

      if (currentLng < targetLng) {
        newLng = currentLng + step;
      } else {
        newLng = currentLng - step;
      }

      closestAvengerMarker.setLatLng([newLat, newLng]);

      const distance = getDistance([newLat, newLng], nearestStone.coordinates);

      if (distance < 10000) {
        console.log("Avenger has reached the stone!");
        clearInterval(intervalId);
        alert("Avenger has reached the stone!");
      }
    }
  };

  const moveThanos = () => {
    const step = 0.1;
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

      if (distance < 10000) {
        console.log("Thanos has reached the target location!");
        clearInterval(intervalId);
        alert("Thanos has reached the target location!");

        // Send Avengers to stop Thanos
        avengersData.forEach((avenger) => {
          const avengerMarker = L.marker(avenger.coordinates, {
            icon: L.icon({
              iconUrl: avenger.img,
              iconSize: [20, 20],
            }),
          }).addTo(map);
          avengerMarker.bindPopup(`Avenger: ${avenger.name}<br>Stop Thanos!`);
        });
      }
    }
  };

  const move = () => {
    moveThanos();
    moveCloseAvenger();
  };
  const intervalId = setInterval(move, 50);
}
