function redirect() {
window.location.href = "informations.html";
}

fetch('informations.json')
  .then(response => response.json())
  .then(data => {
    document.getElementById('nom').innerHTML = data.nom;
    document.getElementById('prenom').innerHTML = data.prenom;
    document.getElementById('dateNaissance').innerHTML = data.dateNaissance;
    document.getElementById('taille').innerHTML = data.taille;
    document.getElementById('poids').innerHTML = data.poids;
    document.getElementById('age').innerHTML = data.age;
  });