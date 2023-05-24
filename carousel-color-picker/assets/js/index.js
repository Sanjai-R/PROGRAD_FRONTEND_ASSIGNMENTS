const carousel = document.querySelector(".root");

for (let i = 1; i <= 5; i++) {
  const colorPicker = document.getElementById(`colorPicker${i}`);
  const container = document.querySelector(`.div${i}`);
  const left = document.querySelector(`.left${i}`);
  const right = document.querySelector(`.right${i}`);

  //   Color Changer
  colorPicker.addEventListener("change", (e) => {
    container.style.backgroundColor = e.target.value;
  });

  //   Carousel
  if (i === 1) {
    left.remove();
  } else if (i === 5) {
    right.remove();
  }

  right.addEventListener("click", () => {
    carousel.style.transform = `translateX(-${i}00vw)`;
  });

  left.addEventListener("click", () => {
    carousel.style.transform = `translateX(-${i - 2}00vw)`;
  });
}
