const url = "https://randomuser.me/api/?results=20&nat=ua&inc=name,picture,dob,gender,location";
const FormUsers = document.querySelector(".menu__form");
let usersData = [];
const searchInput = document.querySelector(".menu__input");
const cards = document.querySelector(".cards");
const resetUsers = document.querySelector(".menu__button_reset");

async function fetchHandler() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    usersData = data.results;
    showMain(usersData);
  } catch (error) {
    alert("Error");
  }
}

function showMain(data) {
  cards.innerHTML = renderUserData(filterUsers(data));
}

function renderUserData(data) {
  return data.map(({ picture, name, location, dob }) =>
    `<div class="card">
        <div class="card__image">
          <img src="${picture.large}" alt="${name.first} ${name.last}">
        </div>
        <div class="card__discription">
          <p class="card__name">${name.first} ${name.last}, ${dob.age}</p>
          <p class="card__city">${location.city}</p>
          <p class="card__street">(${location.street.name}, ${location.street.number})</p>
        </div>
      </div>`
  )
    .join('');
};

function filterUsers(data) {
  console.log(data);
  const SortAge = sortByAge(data);
  console.log(SortAge);
  const sortName = sortByName(SortAge);
  console.log(sortName);
  const filterSex = filterBySex(sortName);
  console.log(filterSex);
  const sortSearch = SortBySearch(filterSex);
  console.log(sortSearch);
  return sortSearch;
};

function filterBySex(data) {
  return data.filter(
    (user) => user.gender === FormUsers.filter_sex.value || FormUsers.filter_sex.value === 'all'
  );
};

function sortByAge(data) {
  if (FormUsers.filter_age.value === 'old') {
    return usersData.sort((a, b) => b.dob.age - a.dob.age);
  }
  if (FormUsers.filter_age.value === 'young') {
    return usersData.sort((a, b) => a.dob.age - b.dob.age);
  } console.log(data);

  return data;
};

function sortByName(data) {
  if (FormUsers.filter_name.value === 'A-Z') {
    return usersData.sort((a, b) => a.name.first.charAt(0) < b.name.first.charAt(0) ? -1 : 1);
  }
  if (FormUsers.filter_name.value === 'Z-A') {
    return usersData.sort((a, b) => a.name.first.charAt(0) > b.name.first.charAt(0) ? -1 : 1);
  }
  return data;
};


function SortBySearch(data) {
  if (searchInput.value) {
    return usersData.filter((user) =>
      (user.name.first + ' ' + user.name.last)
        .toLowerCase()
        .includes(searchInput.value.toLowerCase())
    );
  }
  return data;
};

FormUsers.addEventListener('input', () => showMain(usersData));
document.addEventListener('DOMContentLoaded', fetchHandler);