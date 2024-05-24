const baseURL =
  "https://v6.exchangerate-api.com/v6/f167abb2e8949c6817c28872/latest/USD";
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const exchangeIcon = document.querySelector("i");

window.addEventListener("load", () => {
  updateRate();
});

async function fetchData(amountValue) {
  const url = `https://v6.exchangerate-api.com/v6/f167abb2e8949c6817c28872/latest/${fromCurr.value}`;
  console.log(url);

  let response = await fetch(url);
  let data = await response.json();
  let toCurrFinal = toCurr.value;
  let rate = data.conversion_rates[toCurrFinal];
  let semifinalAmount = amountValue * rate;
  let finalAmount = Math.round((semifinalAmount + Number.EPSILON) * 1000) / 1000;
  msg.innerText = `${amountValue} ${fromCurr.value} = ${finalAmount} ${toCurrFinal}`;
}

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    }
    if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (event) => {
    updateFlag(event.target);
  });
}

const updateRate = async () => {
  let amount = document.querySelector("form input");
  let amountValue = amount.value;
  if (amountValue === "" || amountValue < 1) {
    amountValue = 1;
    amount.value = "1";
  }

  await fetchData(amountValue);
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  element.parentElement.querySelector("img").src = newSrc;
};

btn.addEventListener("click", (event) => {
  event.preventDefault();
  updateRate();
});

exchangeIcon.addEventListener("click", () => {
  const temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;

  updateFlag(fromCurr);
  updateFlag(toCurr);

  updateRate();
});