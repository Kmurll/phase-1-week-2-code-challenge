// Define the base URL for the API server
const API_BASE_URL = 'http://127.0.0.1:4000'

// Get a reference to the element with id "animalList" in the HTML
const animalListElement = document.getElementById('animalList')

// Get a reference to the element with id "animalDetails" in the HTML
const animalDetailsElement = document.getElementById('animalDetails')

// Create an empty array to store the animal data fetched from the API
let animalData = [];

// Function to fetch the list of animals and display them in the HTML
async function displayAnimalList() {
  try {
    // Fetch the data from the API endpoint and wait for the response
    const response = await fetch(`${API_BASE_URL}/characters`)

    // Parse the response body as JSON and store it in the animalData array
    animalData = await response.json()

    // Clear any previous list items in the "animalList" element
    animalListElement.innerHTML = ''

    // Loop through each animal in the animalData array
    animalData.forEach(animal => {
      // Create a new list item element for each animal
      const listItem = document.createElement('li')

      // Add a class to the list item element for styling purposes
      listItem.classList.add('animal-item')

      // Set the content of the list item to display the animal name and an image
      listItem.innerHTML = `
        <span>${animal.name}</span>
        <img src="${animal.image}" alt="${animal.name}" width="40" height="40">
      `;

      // Add a click event listener to the list item to show the animal details when clicked
      listItem.addEventListener('click', () => displayAnimalDetails(animal.id))

      // Append the list item to the "animalList" element in the HTML
      animalListElement.appendChild(listItem)
    });
  } catch (error) {
    // If there is an error fetching the data, log the error to the console
    console.error('Error fetching animal list:', error)
  }
}

// Function to display animal details when an animal's name is clicked
function displayAnimalDetails(animalId) {
  // Find the selected animal in the animalData array based on its ID
  const selectedAnimal = animalData.find(animal => animal.id === animalId)

  // If the selected animal is found, update the "animalDetails" element in the HTML
  if (selectedAnimal) {
    animalDetailsElement.innerHTML = `
      <h2>${selectedAnimal.name}</h2>
      <img src="${selectedAnimal.image}" alt="${selectedAnimal.name}" width="200">
      <p>Votes: ${selectedAnimal.votes}</p>
      <button onclick="addVote(${selectedAnimal.id})">Add Vote</button>
    `;
  }
}

// Function to add votes for an animal
async function addVote(animalId) {
  try {
    // Find the selected animal in the animalData array based on its ID
    const selectedAnimal = animalData.find(animal => animal.id === animalId)

    // If the selected animal is found, increment its votes count by 1
    if (selectedAnimal) {
      const newVotes = selectedAnimal.votes + 1

      // Send a PATCH request to the API endpoint to update the votes count for the animal
      await fetch(`${API_BASE_URL}/characters/${animalId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ votes: newVotes }),
      });

      // Update the displayed votes in the "animalDetails" element
      const votesElement = document.querySelector('#animalDetails p')
      votesElement.textContent = `Votes: ${newVotes}`

      // Update the stored data in the animalData array to reflect the new votes count
      selectedAnimal.votes = newVotes
    }
  } catch (error) {
    // If there is an error adding votes, log the error to the console
    console.error('Error adding vote:', error)
  }
}

// Load the initial animal list by calling the displayAnimalList function
displayAnimalList()
