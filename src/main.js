import "./css/index.css"

import Imask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg > svg g g:nth-child(1) path")

const ccBgColor02 = document.querySelector(".cc-bg > svg g g:nth-child(2) path")

const setCardType = type => {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#df6f29", "#C69347"],
    default: ["black", "gray"],
  }

  ccBgColor02.setAttribute("fill", colors[type][0])
  ccBgColor01.setAttribute("fill", colors[type][1])
}

const securityCode = document.querySelector("#security-code")

const securityCodePattern = {
  mask: "0000",
}

const securityCodeMasked = Imask(securityCode, securityCodePattern)

const expirationDate = document.querySelector("#expiration-date")

const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: Imask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: Imask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}

const expirationDateMasked = Imask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")

const cardPatter = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1,5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")

    const card = dynamicMasked.compiledMasks.find(({ regex }) => {
      return number.match(regex)
    })

    return card
  },
}

const cardNumberMasked = Imask(cardNumber, cardPatter)

document.querySelector("form").addEventListener("submit", e => {
  e.preventDefault()
  console.log("ola")
})

const cardHolder = document.querySelector("#card-holder")

cardHolder.addEventListener("input", e => {
  const ccHolder = document.querySelector(".cc-holder .value")

  if (e.target.value.length >= 27) return
  ccHolder.text = e.target.value.length < 1 ? "FULANO DA SILVA" : e.target.value
})

// expirationDateMasked.on("accept")

securityCodeMasked.on("accept", () => {
  // updateSecurity(cardNumberMasked.value)
  updateSecurity(securityCodeMasked.value)
})

function updateSecurity(code) {
  const ccSecurity = document.querySelector(".cc-security .value")

  ccSecurity.innerText = code.length < 1 ? "123" : code
}

cardNumberMasked.on("accept", () => {
  // updateSecurity(cardNumberMasked.value)
  setCardType(cardNumberMasked.masked.currentMask.cardtype)

  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(code) {
  const ccNumber = document.querySelector(".cc-number")

  ccNumber.innerText = code.length < 1 ? "1234 5678 9012 3456" : code
}

expirationDateMasked.on("accept", () => {
  // updateSecurity(cardNumberMasked.value)
  updateExpiration(expirationDateMasked.value)
})

function updateExpiration(code) {
  const ccExpiration = document.querySelector(".cc-extra .value")

  ccExpiration.innerText = code.length < 1 ? "02/32" : code
}
