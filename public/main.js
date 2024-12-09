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
      offerDiv.classList.add("offerDiv")

      offerDiv.innerHTML = `
        <img src="${
          offer.imagePath ? offer.imagePath : "/images/placeholder.png"
        }" alt="${offer.title}" style="max-width: 200px; height: auto;" />
        <p><strong>Title:</strong> ${offer.title}</p>
        <p><strong>Description:</strong> ${offer.description}</p>
        <p><strong>Price:</strong> $${offer.price}</p>
      `

      offersContainer.appendChild(offerDiv)
    })
  } catch (error) {
    console.error("Error fetching offers:", error)
  }
}

getrOffers()
