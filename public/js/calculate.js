const symptomsList = [
    "Fièvre",
    "Toux",
    "Essoufflement",
    "Fatigue",
    "Douleur",
    "Nausée",
    // Add more symptoms as needed
  ];

  let selectedSymptoms = []; // To keep track of selected symptoms

  function showSuggestions(value) {
    const suggestionsDiv = document.getElementById("suggestions");
    suggestionsDiv.innerHTML = ""; // Clear previous suggestions
    if (value) {
      const filteredSymptoms = symptomsList.filter(symptom =>
        symptom.toLowerCase().includes(value.toLowerCase()) && !selectedSymptoms.includes(symptom) // Exclude already selected symptoms
      );
      if (filteredSymptoms.length) {
        suggestionsDiv.style.display = "block"; // Show suggestions
        filteredSymptoms.forEach(symptom => {
          const suggestionItem = document.createElement("div");
          suggestionItem.classList.add("suggestion-item");
          suggestionItem.textContent = symptom;
          suggestionItem.onclick = () => selectSymptom(symptom);
          suggestionsDiv.appendChild(suggestionItem);
        });
      } else {
        suggestionsDiv.style.display = "none"; // Hide if no suggestions
      }
    } else {
      suggestionsDiv.style.display = "none"; // Hide if input is empty
    }
  }

  function selectSymptom(symptom) {
    // Add selected symptom to the array
    if (!selectedSymptoms.includes(symptom)) {
      selectedSymptoms.push(symptom);
      
      // Create a list item for the selected symptom
      const symptomItem = document.createElement("span");
      symptomItem.className = "badge bg-primary me-2";
      symptomItem.textContent = symptom;

      const removeButton = document.createElement("button");
      removeButton.className = "btn-close btn-close-white ms-2";
      removeButton.onclick = () => removeSymptom(symptomItem, symptom);
      symptomItem.appendChild(removeButton);
      
      document.getElementById("selected-symptoms").appendChild(symptomItem);

      // Clear input and suggestions
      document.getElementById("symptomes-input").value = "";
      document.getElementById("suggestions").innerHTML = "";
      document.getElementById("suggestions").style.display = "none";
    }
  }

  function removeSymptom(symptomItem, symptom) {
    // Remove the symptom from the selected list and from the displayed list
    selectedSymptoms = selectedSymptoms.filter(s => s !== symptom);
    document.getElementById("selected-symptoms").removeChild(symptomItem);
  }

  function calculateBMI(idpoids,idtaille,idimc) {
    const poids = parseFloat(document.getElementById(idpoids).value);
    const tailleCm = parseFloat(document.getElementById(idtaille).value);
    const tailleM = tailleCm / 100; // Convert cm to m
  
    if (poids && tailleCm) {
      const imc = (poids / (tailleM * tailleM)).toFixed(2);
      console.log("TRUE")
      document.getElementById(idimc).value = imc;
    } else {
      console.log("FALSE")
      document.getElementById(idimc).value = '';
    }
  }