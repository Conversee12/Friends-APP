const url = "https://randomuser.me/api/?results=20&nat=ua&inc=name,picture,dob,gender,location";
const FormUsers = document.querySelector(".menu__form");
let usersData = [];
const searchInput = document.querySelector(".menu__input");
const cards = document.querySelector(".cards");
const resetUsers = document.querySelector(".menu__button_reset");
const sort_age = document.getElementsByName("sort_age");
const sort_name = document.getElementsByName("sort_name");

const preventMultiSort = (e) => {
  if (e.target.for || e.target.id) {
    if (e.target.name === 'sort_name' && FormUsers.sort_age.value) {
      sort_age.forEach((el) => {
        el.checked = false;
      })
    }
    if (e.target.name === 'sort_age' && FormUsers.sort_name.value) {
      sort_name.forEach((el) => {
        el.checked = false;
      })
    }
  }
}

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
  const SortAge = sortByAge(data);
  const sortName = sortByName(SortAge);
  const filterSex = filterBySex(sortName);
  const sortSearch = SortBySearch(filterSex);
  return sortSearch;
};

function filterBySex(data) {
  return data.filter(
    (user) => user.gender === FormUsers.filter_sex.value || FormUsers.filter_sex.value === 'all'
  );
};

function sortByAge(data) {
  if (FormUsers.sort_age.value === 'old') {
    return usersData.sort((a, b) => b.dob.age - a.dob.age);
  }
  if (FormUsers.sort_age.value === 'young') {
    return usersData.sort((a, b) => a.dob.age - b.dob.age);
  }
  return data;
};

function sortByName(data) {
  if (FormUsers.sort_name.value === 'A-Z') {
    return usersData.sort((a, b) => a.name.first.charAt(0) < b.name.first.charAt(0) ? -1 : 1);
  }
  if (FormUsers.sort_name.value === 'Z-A') {
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
FormUsers.addEventListener('click', preventMultiSort);

fetchHandler();

resetUsers.addEventListener("click", () => {
  FormUsers.reset();
  cards.innerHTML = renderUserData(usersData);
});
