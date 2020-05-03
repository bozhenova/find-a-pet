import { isValidZip, showAlert } from './validate';

const petForm = document.querySelector('#pet-form');
const key = `XQoLm6GVFNlsC7Mbm4XlckzQCnfAIIbbPAsYtqwPpY9BxsrxO1`;
const secretKey = `g413WzIqICtUegwUJmnroRXm8QaNbyauvy3vJjiz`;
let token;

petForm.addEventListener('submit', fetchAnimals);

fetch("https://api.petfinder.com/v2/oauth2/token", {
  body: `grant_type=client_credentials&client_id=${key}&client_secret=${secretKey}`,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  },
  method: "POST"
})
  .then(response => response.json())
  .then(data => {
    token = data.access_token;
  });

function fetchAnimals(e) {
  e.preventDefault();

  const animal = document.querySelector('#animal').value;
  const zip = document.querySelector('#zip').value;

  if (!isValidZip(zip)) {
    showAlert('Please Enter A Valid Zipcode', 'danger');
    return;
  }

  fetch(`https://api.petfinder.com/v2/animals/?type=${animal}&contact.address.postcode=${zip}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => showAnimals(data.animals))
    .catch(err => console.log(err));
}

function showAnimals(pets) {
  const results = document.querySelector('#results');

  results.innerHTML = '';
  pets.forEach((pet) => {
    console.log(pet)
    const div = document.createElement('div');
    div.classList.add('card', 'card-body', 'mb-3');
    div.innerHTML = `
    <div class="row">
    <div class="col-6">
    <h4>${pet.name} (${pet.age})</h4>
    <h6>${pet.gender}</h6>
    <p class="text-secondary">${pet.breeds.primary}</p>
    <p>${pet.contact.address.city} ${pet.contact.address.state} ${pet.contact.address.postcode}</p>
    <ul class="list-group">
    ${pet.contact.phone ? `<li class="list-group-item">Phone: ${pet.contact.phone}</li>` : ``}
    ${pet.contact.email ? `<li class="list-group-item">Email: ${pet.contact.email}</li>` : ``}
    <li class="list-group-item">Shelter ID: ${pet.organization_id}</li>
    </ul>
    </div>
    <div class="col-6 text-center">
    ${pet.photos.length > 0 ? `<img class="img-fluid rounded-circle mt-2" src="${pet.photos[0].medium}"` : ``}
    </div>
    </div>
    `;

    results.append(div);
  });
}

