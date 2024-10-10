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

      const informations = group_informations();
      console.log("informations :", informations);
    });
}

function print_results() {
  window.print();
}

function doctor_mail() {
  alert("Résultats envoyés au medecin");
}

function view_symptoms() {
  const checkedSymptomes = JSON.parse(localStorage.getItem("checkedSymptomes"));
  const symptomesCochesDiv = document.getElementById("symptomes-coches");
  checkedSymptomes.forEach((symptome) => {
    const p = document.createElement("p");
    p.textContent = symptome;
    symptomesCochesDiv.appendChild(p);
  });
}

function view_comments() {
  const commentaireInput = document.getElementById("commentaire-patient");
  const commentaire = localStorage.getItem("commentaire");
  commentaireInput.value = commentaire;
}

function redirect_to(url) {
  window.location.href = "../html/loader.html?url=" + encodeURIComponent(url);
}

var url = new URLSearchParams(window.location.search).get("url");
if (url !== null && url !== undefined && url !== "") {
  setTimeout(() => {
    window.location.href = url;
  }, 1500);
}

function update_local_storage() {
  const checkedSymptomes = [];
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkedSymptomes.push(checkbox.value);
    }
  });
  localStorage.setItem("checkedSymptomes", JSON.stringify(checkedSymptomes));
}

function get_size() {
  const tailleInput = document.getElementById("taille");
  const taille = tailleInput.value;
  localStorage.setItem("taille", taille);
}

function get_comment() {
  const commentaireInput = document.getElementById("commentaire");
  const commentaire = commentaireInput.value;
  localStorage.setItem("commentaire", commentaire);
}

function insert_comment() {
  const commentaire = localStorage.getItem("commentaire");
  document.getElementById("commentaire").innerHTML = commentaire;
}

function view_comments() {
  const commentaire = localStorage.getItem("commentaire");
  const commentaireElement = document.getElementById("commentaire-patient");
  commentaireElement.innerHTML = commentaire;
}

function insert_size() {
  const taille = localStorage.getItem("taille");
  document.getElementById("taille").innerHTML = taille + " cm";
}

function IMC_calculator() {
  const poids = localStorage.getItem("poids");
  const taille = localStorage.getItem("taille") / 100;
  const imc = poids / (taille * taille);
  document.getElementById("IMC").innerHTML = "IMC : " + imc.toFixed(2);
}

function random_weight() {
  const poids = Math.floor(Math.random() * (90 - 45 + 1)) + 45;
  localStorage.setItem("poids", poids);
}

function random_BPM() {
  const bpm = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
  localStorage.setItem("bpm", bpm);
}

function random_temp() {
  const temperature = Math.floor(Math.random() * (40 - 36 + 1)) + 36;
  localStorage.setItem("temperature", temperature);
}

function random_gluc() {
  const gluco = Math.floor(Math.random() * (220 - 90 + 1)) + 90;
  localStorage.setItem("gluco", gluco);
}

function group_informations() {
  const informations = {
    dateNaissance: document.getElementById("dateNaissance").innerHTML,
    taille: localStorage.getItem("taille"),
    poids: localStorage.getItem("poids"),
    bpm: localStorage.getItem("bpm"),
    temperature: localStorage.getItem("temperature"),
    gluco: localStorage.getItem("gluco"),
    sexe: document.getElementById("sexe").innerHTML,
    symptomes: [],
    commentaire: localStorage.getItem("commentaire"),
    age: age_calculate(document.getElementById("dateNaissance").innerHTML),
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
    const informations = group_informations();
    const apikey =
      "";

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
                  "Je vais te fournir des informations médicales sur un patient, des valeurs, 
                  son profil, ainsi qu'un commentaire de sa part. 
                  En fonction de ces informations, je souhaite que tu établisses un diagnostic 
                  et que tu me proposes des suspicions de maladie ainsi que des conseils. 
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
        const cleanedMessage = format_response(messageString);
        const conseilElement = document.getElementById("conseil");

        conseilElement.innerHTML = cleanedMessage;
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function format_response(reponse) {
  const message = JSON.parse(reponse).content;
  const messageClarifie = message.replace(/\n/g, "<br><br>").replace(/\r/g, "");
  return messageClarifie;
}

function redirect_to_results() {
  const loaderElement = document.getElementById("loader");
  const resultatsElement = document.getElementById("resultats");

  loaderElement.style.display = "block";
  resultatsElement.style.display = "none";

  diagnostic().then(() => {
    loaderElement.style.display = "none";
    resultatsElement.style.display = "block";
  });
}

window.onload = function () {
  redirect_to_results();
};

function redirect_to_list_results() {
  window.location.href = "../html/results.html";
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

      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
          update_local_storage();
        });
      });

      const searchInput = document.getElementById("search");
      searchInput.addEventListener("input", (e) => {
        const searchValue = e.target.value.toLowerCase();
        const symptomesList = document.getElementById("symptomes");
        const symptomesItems = symptomesList.children;

        Array.from(symptomesItems).forEach((item) => {
          const symptomeName = item
            .querySelector("label")
            .textContent.toLowerCase();
          if (symptomeName.includes(searchValue)) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });
      });
    });
}

function age_calculate(dateNaissance) {
  const today = new Date();
  const birthDate = new Date(dateNaissance);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}