function redirect_to_informations() {
  window.location.href = "informations.html";
}

fetch("informations.json")
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
  window.location.href = "symptomes.html";
}

fetch('symptomes.json')
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