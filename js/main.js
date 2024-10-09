function fetch_informations() {
  fetch("../data/informations.json")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("nom").innerHTML = data.nom;
      document.getElementById("prenom").innerHTML = data.prenom;
      document.getElementById("dateNaissance").innerHTML = data.dateNaissance;
      document.getElementById("taille").innerHTML = data.taille;
      document.getElementById("poids").innerHTML = data.poids;
      document.getElementById("age").innerHTML = data.age;
    });
}

function fetch_symptome() {
  fetch("../data/symptomes.json")
    .then((response) => response.json())
    .then((data) => {
      const symptomes = document.getElementById("symptomes");
      data.forEach((symptome, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <input type="checkbox" id="symptome-${index}" name="${symptome.nom}">
          <label for="symptome-${index}">${symptome.nom}</label>
        `;
        symptomes.appendChild(li);
      });
    });
}

function imprimerResultats() {
  window.print();
}

function notifierMedecin() {
  alert("Résultats envoyés au medecin");
}

function afficherSymptomesCoches() {
  const symptomesCoches = JSON.parse(localStorage.getItem("symptomesCoches"));
  const symptomesCochesDiv = document.getElementById("symptomes-coches");

  if (symptomesCochesDiv) {
    if (symptomesCoches) {
      symptomesCoches.forEach((symptome) => {
        const p = document.createElement("p");
        p.textContent = symptome;
        symptomesCochesDiv.appendChild(p);
      });
    }
  } else {
    console.log("L'élément symptomes-coches n'est pas disponible");
  }
}
// fetch(
//   "https://cors-anywhere.herokuapp.com/https://api.disease-ontology.org/api/v2/diseases"
// )
//   .then((response) => response.json())
//   .then((data) => {
//     const diseasesElement = document.getElementById("diseases");

//     data.forEach((disease) => {
//       const diseaseElement = document.createElement("div");
//       diseaseElement.innerHTML = `
//         <h2>${disease.name}</h2>
//         <ul>
//           ${disease.symptoms.map((symptom) => `<li>${symptom}</li>`).join("")}
//         </ul>
//       `;
//       diseasesElement.appendChild(diseaseElement);
//     });
//   })
//   .catch((error) => console.error(error));

function redirectTo(url) {
  window.location.href = "../html/loader.html?url=" + encodeURIComponent(url);
}

var url = new URLSearchParams(window.location.search).get("url");
if (url !== null && url !== undefined && url !== "") {
  setTimeout(() => {
    window.location.href = url;
  }, 4000);
}
