function fetch_informations() {
  fetch("../data/informations.json")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("nom").innerHTML = data.nom;
      document.getElementById("prenom").innerHTML = data.prenom;
      document.getElementById("dateNaissance").innerHTML = data.dateNaissance;
      document.getElementById("sexe").innerHTML = data.sexe;
      const taille = localStorage.getItem("taille");
      document.getElementById("taille").innerHTML =
        "Taille : " + taille + " cm";
      const poids = localStorage.getItem("poids");
      document.getElementById("poids").innerHTML = "Poids : " + poids + " kg";
      const bpm = localStorage.getItem("bpm");
      document.getElementById("bpm").innerHTML = "BPM : " + bpm;
      const temperature = localStorage.getItem("temperature");
      document.getElementById("temperature").innerHTML =
        "Temperature : " + temperature + "°";
      const gluco = localStorage.getItem("gluco");
      document.getElementById("gluco").innerHTML =
        "Glycemie : " + gluco + " mg/dl";

      const informations = regrouperInformations();
      console.log("informations :", informations);
    });
}

function fetch_symptomes() {
  fetch("../data/symptomes.json")
    .then((response) => response.json())
    .then((data) => {
      const symptomes = document.getElementById("symptomes");
      data.forEach((symptome, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <input type="checkbox" id="symptome-${index}" name="${symptome.nom}" value="${symptome.nom}">
          <label for="symptome-${index}">${symptome.nom}</label>
        `;
        symptomes.appendChild(li);
      });

      symptomes.addEventListener("change", updateLocalStorage);
    });
}

function imprimerResultats() {
  window.print();
}

function notifierMedecin() {
  alert("Résultats envoyés au medecin");
}

function afficherSymptomesCoches() {
  const checkedSymptomes = JSON.parse(localStorage.getItem("checkedSymptomes"));
  const symptomesCochesDiv = document.getElementById("symptomes-coches");
  checkedSymptomes.forEach((symptome) => {
    const p = document.createElement("p");
    p.textContent = symptome;
    symptomesCochesDiv.appendChild(p);
  });
}

function redirectTo(url) {
  window.location.href = "../html/loader.html?url=" + encodeURIComponent(url);
}

var url = new URLSearchParams(window.location.search).get("url");
if (url !== null && url !== undefined && url !== "") {
  setTimeout(() => {
    window.location.href = url;
  }, 1500);
}

function updateLocalStorage() {
  const checkedSymptomes = [];
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkedSymptomes.push(checkbox.value);
    }
  });
  localStorage.setItem("checkedSymptomes", JSON.stringify(checkedSymptomes));
}

function recoverTaille() {
  const tailleInput = document.getElementById("taille");
  const taille = tailleInput.value;
  localStorage.setItem("taille", taille);
}

function getTaille() {
  const taille = localStorage.getItem("taille");
  document.getElementById("taille").innerHTML = taille + " cm";
}

function calculerIMC() {
  const poids = localStorage.getItem("poids");
  const taille = localStorage.getItem("taille") / 100;
  const imc = poids / (taille * taille);
  document.getElementById("IMC").innerHTML = "IMC : " + imc.toFixed(2);
}

function randomPoids() {
  const poids = Math.floor(Math.random() * (100 - 35 + 1)) + 35;
  localStorage.setItem("poids", poids);
}

function randomBPM() {
  const bpm = Math.floor(Math.random() * (250 - 20 + 1)) + 20;
  localStorage.setItem("bpm", bpm);
}

function randomTemperature() {
  const temperature = Math.floor(Math.random() * (45 - 32 + 1)) + 32;
  localStorage.setItem("temperature", temperature);
}

function randomGluco() {
  const gluco = Math.floor(Math.random() * (300 - 40 + 1)) + 40;
  localStorage.setItem("gluco", gluco);
}

function regrouperInformations() {
  const informations = {
    dateNaissance: document.getElementById("dateNaissance").innerHTML,
    taille: localStorage.getItem("taille"),
    poids: localStorage.getItem("poids"),
    bpm: localStorage.getItem("bpm"),
    temperature: localStorage.getItem("temperature"),
    gluco: localStorage.getItem("gluco"),
    sexe: document.getElementById("sexe").innerHTML,
    symptomes: [],
  };

  const checkedSymptomes = JSON.parse(localStorage.getItem("checkedSymptomes"));
  checkedSymptomes.forEach((symptome) => {
    informations.symptomes.push(symptome);
  });

  return informations;
}

function diagnostic() {
  return new Promise((resolve, reject) => {
    const url = "https://api.openai.com/v1/chat/completions";
    const informations = regrouperInformations();
    const apikey = "";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apikey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: [
              {
                type: "text",
                text: `
                  "Je vais te fournir des informations médicales sur un patient. 
                  En fonction de ces informations, je souhaite que tu établisses un diagnostic 
                  et que tu me proposes des suspicions de maladie ainsi que des conseils de traitement. 
                  Il est important de noter que je veux une réponse sous forme de chaîne de caractères pure, 
                  sans mise en forme en markdown. Et il faut que tu t'adresse au patient en le vouvoyant.
                `,
              },
            ],
          },
          {
            role: "user",
            content:
              "Voici les informations du patient : " +
              JSON.stringify(informations),
          },
        ],
        max_tokens: 2048,
        temperature: 0.7,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const message = data.choices[0].message;
        console.log("Output:", message);
        const messageString = JSON.stringify(message);
        const cleanedMessage = clarifierReponse(messageString);
        const conseilElement = document.getElementById("conseil");

        conseilElement.innerHTML = cleanedMessage;
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function clarifierReponse(reponse) {
  const message = JSON.parse(reponse).content;
  const messageClarifie = message.replace(/\n/g, "<br><br>").replace(/\r/g, "");
  return messageClarifie;
}

// Dans la page resultats.html
function redirectToResultats() {
  const loaderElement = document.getElementById("loader");
  const resultatsElement = document.getElementById("resultats");

  loaderElement.style.display = "block";
  resultatsElement.style.display = "none";

  diagnostic().then(() => {
    loaderElement.style.display = "none";
    resultatsElement.style.display = "block";
  });
}

window.onload = function() {
  redirectToResultats();
}

function redirectToListeResultats() {
  window.location.href = "../html/resultats.html";
}