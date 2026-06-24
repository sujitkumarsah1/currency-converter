let dropDown = document.querySelectorAll(".box select");

const callAPI = async(currCode)=>{
    let API = `https://currency-rate-exchange-api.onrender.com/${currCode}`;
    
    let response = await fetch(API);
    let data = await response.json();
    return data;
}

let updateFlag = async (currCode, img) => {
    let data = await callAPI(currCode);

    img.src = data.flagImage;
}

let currencyConverter =  async () => {

    let fromCurrency = document.querySelector(".from .box select").value;
    let toCurrency = document.querySelector(".to .box select").value;

    let fromData = await callAPI(fromCurrency);
    let toData = await callAPI(toCurrency);

    // Actual Rate
    let fromRate = fromData.rates[fromCurrency.toLowerCase()].usd;
    let toRate = toData.rates[toCurrency.toLowerCase()].usd;
    
    //Final Rate based on USD
    const finalRate = fromRate / toRate;
    return finalRate;

}

// Two way communication exchange
let fromVal = document.querySelector(".from .box #fromAmount");
let toVal = document.querySelector(".to .box #toAmount");

fromVal.addEventListener("input", async ()=>{
    
    const rate = await currencyConverter();
    toVal.value = (fromVal.value) * rate.toFixed(3);
})
toVal.addEventListener("input", async()=>{
    
    const rate = await currencyConverter();
    fromVal.value = (toVal.value) * (1/rate).toFixed(3);
})

let showExchangeRate = async ()=> {
    let fromCurrency = document.querySelector(".from .box select").value;
    let toCurrency = document.querySelector(".to .box select").value;
   
    let showRate = document.querySelector(".footer p");
    const rate = await currencyConverter();
    showRate.textContent = `1 ${fromCurrency} = ${rate.toFixed(5)} ${toCurrency}`;
}

dropDown.forEach((select)=>{
    select.addEventListener("change", async (event)=>{
        // console.log(event.target.name);
        let currCode = event.target.value;

        let img = select.parentElement.querySelector(".flag img");
        // console.log(img);
        updateFlag(currCode, img);

        // Convert amount when Changing Flag
        const rate = await currencyConverter();
        toVal.value = (fromVal.value) * rate.toFixed(3);

        showExchangeRate();
    })
})

// show Country currency Code option in select dropdowns
let getCountry = async ()=>{
    let URL = "https://currency-rate-exchange-api.onrender.com/"; 

    let response = await fetch(URL);
    let data = await response.json();
    
    for(let select of dropDown){

        data.codes.forEach((currencyCode) => {
            let option = document.createElement("option");
            option.value = currencyCode;
            option.innerHTML = currencyCode;
            select.appendChild(option);
            // console.log(currencyCode);
        });
    }
    dropDown[0].value = "USD";
    dropDown[1].value = "NPR"; 

    let fromImg = document.querySelector(".from .flag img");
    let toImg = document.querySelector(".to .flag img");
    
    updateFlag("USD", fromImg);
    updateFlag("NPR", toImg);

    // Show default Exchang rate
    const rate = await currencyConverter();
    toVal.value = (fromVal.value) * rate.toFixed(3);

    showExchangeRate();
}
getCountry();

// OnClick on Exchange Logo
let exchangeLogo = document.querySelector(".exchange-logo");
exchangeLogo.addEventListener("click", async ()=> {
    let fromCurrency = document.querySelector(".from .box select").value;
    let toCurrency = document.querySelector(".to .box select").value;

    // Exchange between Currency 
    dropDown[0].value = toCurrency;
    dropDown[1].value = fromCurrency; 

    let fromImg = document.querySelector(".from .flag img");
    let toImg = document.querySelector(".to .flag img");

    // Update flag according to currency Code 
    updateFlag(dropDown[0].value, fromImg);
    updateFlag(dropDown[1].value, toImg);

    // Changing in Amount 
    const rate = await currencyConverter();
    toVal.value = (fromVal.value) * rate.toFixed(3);

    //Change Exchange Rate
    showExchangeRate();
})