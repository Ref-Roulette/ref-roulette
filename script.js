getReferalCodeFromRedisUrl =
  "https://bznotqiqxtautfdyizxvv4mjz40pyitp.lambda-url.us-east-1.on.aws/";
setReferalCodeToRedis =
  "https://k2i62dnuaorjrnfusvak6q3c7q0csbwn.lambda-url.us-east-1.on.aws/";

world_authorize_url = "https://id.worldcoin.org/authorize";

const world_authorize_params = new URLSearchParams({
  response_type: "code",
  scope: "openid",
  client_id: "app_f6c95388795d988ab10b89060e1794cb",
  redirect_uri: "https://ref-roulette.com",
});

document.addEventListener("DOMContentLoaded", () => {
  const authCode = getAuthCode();
  if (authCode == null) {
    setupSignInButton();
    fetchNumber()
      .then((number) => {
        const digits = number.split("");
        animateDigits(digits);
        setupCopyButton(digits.join(""));
      })
      .catch((error) => {
        console.error("Failed to fetch number:", error);
      });
  } else {
    changeSignInButton();
    hideCopyButton();
    setupDigitInputForm();
    setupSubmitButton(authCode);
  }
  setupHomeButton();
});

function animateDigits(digits) {
  digits.forEach((digit, index) => {
    const digitElement = document.getElementById(`digit${index + 1}`);
    const animationDuration = 1 + index / 2; // Longer duration for each subsequent digit

    // Set up the initial state for animation
    digitElement.innerText = " "; // Clear existing content

    // Create an animation element
    let animationElement = document.createElement("div");
    animationElement.textContent = shuffledSequenceString;
    digitElement.appendChild(animationElement);

    // Start the animation
    animationElement.style.animation = `spin ${animationDuration}s steps(100)`;
    animationElement.style.position = "absolute";

    // When the animation is done, set the digit
    animationElement.addEventListener("animationend", () => {
      digitElement.innerText = digit;
      digitElement.removeChild(animationElement); // Clean up the animation element
    });
  });
}

function setupCopyButton(number) {
  const copyButton = document.getElementById("copy-btn");
  copyButton.addEventListener("click", () => {
    navigator.clipboard
      .writeText(number)
      .then(() => {
        alert("The code is copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  });
}

async function fetchNumber() {
  // Replace the URL with your actual API endpoint
  const response = await fetch(getReferalCodeFromRedisUrl);
  const data = await response.json();
  return data.number; // Assuming the API returns an object with a 'number' key
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]]; // swap elements
  }
  return array;
}

// Your sequence
const sequence =
  "Q W E R A S D F Z X C V B N M G H J K T Y U I O P L 1 2 3 4 5 6 7 8 9".split(
    " "
  );

// Shuffle the sequence
const shuffledSequence = shuffleArray(sequence);

// Convert array back to string
const shuffledSequenceString = shuffledSequence.join(" ");

async function setupSignInButton() {
  const signButton = document.getElementById("sign-btn");
  signButton.innerHTML = `<svg
  width="21"
  height="21"
  viewBox="0 0 512 512"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <g clip-path="url(#clip0_499_80323)">
    <path
      d="M491.846 156.358C478.938 125.854 460.489 98.5154 436.987 75.013C413.485 51.5105 386.085 33.0617 355.642 20.1536C324.041 6.75847 290.553 0 255.97 0C221.447 0 187.898 6.75847 156.297 20.1536C125.793 33.0617 98.4545 51.5105 74.9521 75.013C51.4496 98.5154 33.0008 125.915 20.0928 156.358C6.75847 187.898 0 221.447 0 255.97C0 290.493 6.75847 324.041 20.1536 355.642C33.0617 386.146 51.5105 413.485 75.013 436.987C98.5154 460.489 125.915 478.938 156.358 491.846C187.959 505.181 221.447 512 256.03 512C290.553 512 324.102 505.242 355.703 491.846C386.207 478.938 413.545 460.489 437.048 436.987C460.55 413.485 478.999 386.085 491.907 355.642C505.242 324.041 512.061 290.553 512.061 255.97C512 221.447 505.181 187.898 491.846 156.358ZM170.971 231.919C181.626 191.003 218.889 160.742 263.154 160.742H440.884C452.331 182.844 459.637 206.895 462.499 231.919H170.971ZM462.499 280.02C459.637 305.045 452.27 329.095 440.884 351.197H263.154C218.95 351.197 181.687 320.936 170.971 280.02H462.499ZM108.988 108.988C148.26 69.7158 200.44 48.1008 255.97 48.1008C311.499 48.1008 363.679 69.7158 402.951 108.988C404.169 110.206 405.326 111.423 406.483 112.641H263.154C224.856 112.641 188.872 127.559 161.777 154.653C140.467 175.964 126.706 202.815 121.774 231.98H49.5012C54.7984 185.523 75.4392 142.537 108.988 108.988ZM255.97 463.899C200.44 463.899 148.26 442.284 108.988 403.012C75.4392 369.463 54.7984 326.477 49.5012 280.081H121.774C126.645 309.246 140.467 336.097 161.777 357.408C188.872 384.502 224.856 399.42 263.154 399.42H406.543C405.387 400.637 404.169 401.855 403.012 403.073C363.74 442.223 311.499 463.899 255.97 463.899Z"
      fill="currentColor"
    ></path>
  </g>
  <defs>
    <clipPath id="clip0_499_80323">
      <rect width="512" height="512" fill="white"></rect>
    </clipPath>
  </defs>
</svg>
Sign in with World ID`;
  signButton.addEventListener("click", () => {
    // Append parameters to the base URL
    const url = `${world_authorize_url}?${world_authorize_params.toString()}`;
    window.location.href = url;
  });
}

function getAuthCode() {
  const queryString = window.location.search;

  // Initialize URLSearchParams with the query string
  const params = new URLSearchParams(queryString);

  // Get individual parameters
  const authCode = params.get("code");

  return authCode;
}

function changeSignInButton() {
  const signButton = document.getElementById("sign-btn");
  signButton.innerText = "You are logged in";
  return;
}

function hideCopyButton() {
  const copyButton = document.getElementById("copy-btn");
  copyButton.style.display = "none";
}
function setupSubmitButton(authCode) {
  const submitButton = document.getElementById("submit-btn");
  submitButton.style.display = "block";

  submitButton.addEventListener("click", () => {
    const Http = new XMLHttpRequest();
    Http.open("POST", setReferalCodeToRedis);
    Http.send(
      JSON.stringify({
        authCode: authCode,
        referalCode: getReferalCode(),
      })
    );
    Http.onreadystatechange = (e) => {
      if (Http.readyState === XMLHttpRequest.DONE && Http.status === 200) {
        console.log(Http.response);
        submitButton.innerText = "Submitted Well";
      } else {
        submitButton.innerText = "Session Time out.";
        setupSignInButton();
      }
    };
  });
}

function setupDigitInputForm() {
  const digits = document.querySelectorAll(".digit input");
  const regex = /^[0-9\A-z]$/;

  digits.forEach((input, index) => {
    input.style.display = "block";

    input.addEventListener("keyup", (event) => {
      if (regex.test(event.key)) {
        digits[index].value = event.key;
        if (index < digits.length - 1) {
          digits[index + 1].focus();
        }
      } else if (event.key === "ArrowLeft") {
        if (index > 0) {
          digits[index - 1].focus();
        }
      } else if (event.key === "ArrowRight") {
        if (index < digits.length - 1) {
          digits[index + 1].focus();
        }
      } else if (event.key === "Backspace") {
        if (index >= 0) {
          // Focus on the previous input field
          digits[index - 1].focus();

          // Erase the value of the current input field
          event.preventDefault(); // Prevents the default backspace behavior (e.g., navigating back in history)
          digits[index].value = "";
        }
      }
    });
  });
}

function getReferalCode() {
  inputs = document.getElementsByTagName("input");

  return Array.from(inputs)
    .reduce((accumulator, currentValue) => accumulator + currentValue.value, "")
    .toUpperCase();
}

function setupHomeButton() {
  setupHomeButton = document.getElementById("home-btn");
  setupHomeButton.addEventListener("click", () => {
    window.location.href = "https://ref-roulette.com";
  });
}
