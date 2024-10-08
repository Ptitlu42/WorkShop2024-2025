function redirect_to_informations() {
  window.location.href = "../html/informations.html";
}

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

function redirect_to_symptomes() {
  window.location.href = "../html/symptomes.html";
}

fetch('../data/symptomes.json')
  .then(response => response.json())
  .then(data => {
    const symptomes = document.getElementById('symptomes');
    data.forEach((symptome, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <input type="checkbox" id="symptome-${index}" name="${symptome.nom}">
        <label for="symptome-${index}">${symptome.nom}</label>
      `;
      symptomes.appendChild(li);
    });
  });

function redirect_to_thermometre() {
  window.location.href = "thermometre.html";
}

function redirect_to_stethoscope() {
  window.location.href = "stethoscope.html";
}

function redirect_to_glucometre() {
  window.location.href = "glucometre.html";
}

function redirect_to_balance() {
  window.location.href = "balance.html";
}

function redirect_to_resultats() {
  window.location.href = "resultats.html";
}

fetch('../data/informations.json')
  .then(response => response.json())
  .then(data => {
    document.getElementById('nom').innerHTML = data.nom;
    document.getElementById('prenom').innerHTML = data.prenom;
    document.getElementById('dateNaissance').innerHTML = data.dateNaissance;
    document.getElementById('taille').innerHTML = data.taille;
    document.getElementById('poids').innerHTML = data.poids;
    document.getElementById('age').innerHTML = data.age;
  });

function imprimerResultats() {
  window.print();
}

function notifierMedecin() {
  alert("Résultats envoyés au medecin");
}

function afficherSymptomesCoches() {
  const symptomesCoches = JSON.parse(localStorage.getItem('symptomesCoches'));
  const symptomesCochesDiv = document.getElementById('symptomes-coches');

  if (symptomesCochesDiv) {
    if (symptomesCoches) {
      symptomesCoches.forEach((symptome) => {
        const p = document.createElement('p');
        p.textContent = symptome;
        symptomesCochesDiv.appendChild(p);
      });
    }
  } else {
    console.log("L'élément symptomes-coches n'est pas disponible");
  }
}