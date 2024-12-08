const offerForm = document.getElementById("offerForm")

offerForm.addEventListener("submit", async function (event) {
  event.preventDefault()

  const formData = new FormData(event.target)

  formData.append("title", document.getElementById("title").value)
  formData.append("price", document.getElementById("price").value)
  formData.append("description", document.getElementById("description").value)

  try {
    const response = await fetch("http://localhost:3000/upload", {
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
  }
})
