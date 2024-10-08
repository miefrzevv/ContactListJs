/* Модальное окно при нажатии на Add */
const btnAdd = document.querySelector(".header__controls-btn--plus");
const modalForm = document.querySelector(".form");

btnAdd.addEventListener("click", () => {
  modalForm.show();
});

/* Рендер одной лишки */
const inputName = document.querySelector(".form__input-content-name");
const inputSurname = document.querySelector(".form__input-content-surname");
const inputVacancy = document.querySelector(".form__input-content-vacancy");
const inputNumber = document.querySelector(".form__input-content-phone");

const btnCreate = document.querySelector(".form__button-add");
const contactList = document.querySelector(".contact-list");
let usersName = [];

/* Функция для обновления счетчиков букв */
const updateNameCounts = () => {
  const nameCount = {};
  usersName.forEach((user) => {
    const firstLetter = user.name.charAt(0).toUpperCase();
    if (nameCount[firstLetter]) {
      nameCount[firstLetter]++;
    } else {
      nameCount[firstLetter] = 1;
    }
  });

  /* Фильтрация по букве -> счетчик */
  document.querySelectorAll(".header__search-item").forEach((item) => {
    const letter = item.getAttribute("data-id");
    item.textContent = `${letter}: ${nameCount[letter] || 0}`;
  });
};

/* Отображения карточек по выбранной букве */
const filterByLetter = (selectedLetter) => {
  const contactItems = document.querySelectorAll(".contact-list__item");
  contactItems.forEach((contact) => {
    const contactName = contact.querySelector(
      ".contact-list__name"
    ).textContent;
    const firstLetter = contactName.charAt(0).toUpperCase();

    if (firstLetter !== selectedLetter) {
      contact.classList.add("hide");
    } else {
      contact.classList.remove("hide");
    }
  });
};

/* Загрузка контактов из localStorage */
const loadContactsFromLocalStorage = () => {
  const parsedContacts = JSON.parse(localStorage.getItem("contacts")) || [];
  usersName = parsedContacts;
  usersName.forEach((user) => {
    renderContact(user);
  });
};

/* рендеринг контакта */
const renderContact = (user) => {
  /* Создаем новую лишку */
  let listItem = document.createElement("li");
  listItem.classList.add("contact-list__item");
  listItem.innerHTML = `
    <div class="contact-list__fullname">
      <span class="contact-list__name">${user.name}</span>
      <span class="contact-list__surname">${user.surname}</span>
    </div>
    <div class="contact-list__vacancy">${user.vacancy}</div>
    <div class="contact-list__phone-number">${user.phone}</div>
    <button class="btn contact-list__btn-edit">Edit</button>
    <button class="btn contact-list__btn-delete"></button>
  `;
  contactList.appendChild(listItem);

  /* Кнопка удаления 1ой лишки */
  const btnDelete = listItem.querySelector(".contact-list__btn-delete");
  btnDelete.addEventListener("click", () => {
    listItem.remove();
    usersName = usersName.filter((contact) => contact.name !== user.name);
    updateLocalStorage();
    updateNameCounts();
  });

  /* Редактирование данных */
  const btnEdit = listItem.querySelector(".contact-list__btn-edit");
  btnEdit.addEventListener("click", () => {
    const modalFormEdit = document.querySelector(".form-edit");

    const inputNameEdit = document.querySelector(
      ".form__input-content-name-edit"
    );
    const inputSurnameEdit = document.querySelector(
      ".form__input-content-surname-edit"
    );
    const inputVacancyEdit = document.querySelector(
      ".form__input-content-vacancy-edit"
    );
    const inputNumberEdit = document.querySelector(
      ".form__input-content-phone-edit"
    );

    inputNameEdit.value = user.name;
    inputSurnameEdit.value = user.surname;
    inputVacancyEdit.value = user.vacancy;
    inputNumberEdit.value = user.phone;

    modalFormEdit.showModal();

    const btnSave = modalFormEdit.querySelector(".form__button-save");
    btnSave.onclick = () => {
      user.name = inputNameEdit.value;
      user.surname = inputSurnameEdit.value;
      user.vacancy = inputVacancyEdit.value;
      user.phone = inputNumberEdit.value;
      updateLocalStorage();

      listItem.querySelector(".contact-list__name").textContent = user.name;
      listItem.querySelector(".contact-list__surname").textContent =
        user.surname;
      listItem.querySelector(".contact-list__vacancy").textContent =
        user.vacancy;
      listItem.querySelector(".contact-list__phone-number").textContent =
        user.phone;

      modalFormEdit.close();
      updateNameCounts();
    };
  });
};

/* Функция для обновления localStorage */
const updateLocalStorage = () => {
  localStorage.setItem("contacts", JSON.stringify(usersName));
};

btnCreate.addEventListener("click", () => {
  let inputNameValue = inputName.value;
  let inputSurnameValue = inputSurname.value;
  let inputVacancyValue = inputVacancy.value;
  let inputNumberValue = inputNumber.value;

  const nameRegEx =
    /^[a-zA-Z]{2,}(\s[a-zA-Z]{1,}[-']?[a-zA-Z]{2,})?\s?([a-zA-Z]{1,})?$/;

  if (!nameRegEx.test(inputNameValue) || !nameRegEx.test(inputSurnameValue)) {
    alert(
      "The first and last name must contain only letters and only in English"
    );
    return;
  }

  const phoneRegEx = /^\d+$/;
  if (!phoneRegEx.test(inputNumberValue)) {
    alert("The number must contain only numbers");
    return;
  }

  // Создаем объект пользователя и добавляем его в массив
  const newUser = {
    name: inputNameValue,
    surname: inputSurnameValue,
    vacancy: inputVacancyValue,
    phone: inputNumberValue,
  };

  usersName.push(newUser);
  renderContact(newUser);
  updateLocalStorage();
  updateNameCounts();

  /* Очистка инпутов */
  inputName.value = "";
  inputSurname.value = "";
  inputVacancy.value = "";
  inputNumber.value = "";
});

/* Очистка всего списка */
const btnClearList = document.querySelector(".header__controls-btn--minus");
btnClearList.addEventListener("click", () => {
  contactList.innerHTML = "";
  usersName.length = 0;
  localStorage.removeItem("contacts");
  updateNameCounts();
});

/* Поиск */
document.querySelector(".header__search-input").oninput = function () {
  let searchValue = this.value.trim();
  let searchItems = document.querySelectorAll("li");
  if (searchValue !== "") {
    searchItems.forEach(function (element) {
      if (element.innerText.search(searchValue) === -1) {
        element.classList.add("hide");
      } else {
        element.classList.remove("hide");
      }
    });
  } else {
    searchItems.forEach(function (element) {
      element.classList.remove("hide");
    });
  }
};

/* Фильтрация по букве */
document.querySelectorAll(".header__search-item").forEach((item) => {
  item.addEventListener("click", () => {
    const selectedLetter = item.getAttribute("data-id");
    filterByLetter(selectedLetter);
  });
});

// Загрузка контактов
loadContactsFromLocalStorage();
