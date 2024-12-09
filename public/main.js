const offerForm = document.getElementById("offerForm")

offerForm.addEventListener("submit", async function (event) {
  event.preventDefault()

  const formData = new FormData(event.target)

  formData.append("title", document.getElementById("title").value)
  formData.append("price", document.getElementById("price").value)
  formData.append("description", document.getElementById("description").value)
  formData.append("image", document.getElementById("image").value)

  try {
    const response = await fetch("/upload", {
      method: "POST",
      body: formData,
    })
    if (!response.ok) {
      throw new Error("Error: Data not saved")
    }
    const responseData = await response.json()
  } catch (error) {
    console.log("Error: ", error)
  } finally {
    console.log("finally")
    getrOffers()
  }
})

async function getrOffers() {
  try {
    const response = await fetch("/offers")
    if (!response.ok) throw new Error("Failed to fetch offers")

    const offers = await response.json()

    offersContainer.innerHTML = ""

    offers.forEach((offer) => {
      const offerDiv = document.createElement("div")
      offerDiv.classList.add("offerDiv", "col", "s12", "m6", "l4")

      const cardDiv = document.createElement("div")
      cardDiv.classList.add("card", "hoverable")

      const cardImageDiv = document.createElement("div")
      cardImageDiv.classList.add("card-image")

      const img = document.createElement("img")
      img.classList.add("responsive-img")
      img.src = offer.imagePath ? offer.imagePath : "/images/placeholder.png"
      img.alt = offer.title

      const spanTitle = document.createElement("span")
      spanTitle.classList.add("card-title")
      spanTitle.textContent = offer.title

      cardImageDiv.appendChild(img)
      cardImageDiv.appendChild(spanTitle)

      const cardContentDiv = document.createElement("div")
      cardContentDiv.classList.add("card-content")

      const descriptionP = document.createElement("p")
      descriptionP.textContent = `Description: ${offer.description}`

      const priceP = document.createElement("p")
      priceP.textContent = `Price: $${offer.price}`

      cardContentDiv.appendChild(descriptionP)
      cardContentDiv.appendChild(priceP)

      cardDiv.appendChild(cardImageDiv)
      cardDiv.appendChild(cardContentDiv)
      offerDiv.appendChild(cardDiv)

      offersContainer.appendChild(offerDiv)
    })
  } catch (error) {
    console.error("Error fetching offers:", error)
  }
}

getrOffers()
