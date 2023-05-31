function generateCaptcha(n) {
  console.log();
  const letters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let captcha = "";
  for (let i = 0; i < n; i++) {
    captcha += letters[Math.floor(Math.random() * letters.length)];
  }

  return captcha;
}

const setData = () => {
  const captchaValue = document.getElementById("captcha");
  document.getElementById("user_captcha").value = "";
  document.getElementById("result").textContent = "";
  const captcha = generateCaptcha(7);
  captchaValue.classList.add("line-through");
  captchaValue.style.userSelect = "none";
  captchaValue.style.filter = "blur(1px)";

  captchaValue.textContent = captcha;
};

const checkCaptcha = () => {
  const captcha = document.getElementById("captcha").textContent;
  const user_captcha = document.getElementById("user_captcha").value;
  console.log(user_captcha);

  if (user_captcha.length == 0) {
    updateResult("fail", "Please Enter Captcha");
    return;
  }
  if (captcha.localeCompare(user_captcha) == 0) {
    updateResult("success", "Captcha Matched");
  } else {
    updateResult("fail", "Captcha Not Matched,Try Again");
  }
};

const updateResult = (flag, result) => {
  const resultDiv = document.getElementById("result");
  resultDiv.className = "";
  if (flag === "success") {
    resultDiv.classList.add("text-green-500");
  } else {
    resultDiv.classList.add("text-red-500");
  }
  resultDiv.textContent = result;
};
// main();
