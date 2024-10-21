import {
  inputName,
  inputSurname,
  inputVacancy,
  inputNumber,
} from "./components/constants.js";

import { openModal } from "./components/modal.js";
import { search } from "./components/search.js";
search();


function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

class ContactManager {
  constructor() {
    this.usersName = [];
    this.contactList = document.querySelector(".contact-list");
    this.modalFormEdit = document.querySelector(".form-edit");
    this.inputNameEdit = this.modalFormEdit.querySelector(
      ".form__input-content-name-edit"
    );
    this.inputSurnameEdit = this.modalFormEdit.querySelector(
      ".form__input-content-surname-edit"
    );
    this.inputVacancyEdit = this.modalFormEdit.querySelector(
      ".form__input-content-vacancy-edit"
    );
    this.inputNumberEdit = this.modalFormEdit.querySelector(
      ".form__input-content-phone-edit"
    );

    this.init();
  }

  init() {
    this.loadContactsFromLocalStorage();
    this.bindEvents();
    this.updateNameCounts();
  }

  bindEvents() {
    document
      .querySelector(".header__controls-btn--plus")
      .addEventListener("click", () => this.showModal());

    document
      .querySelector(".form__button-add")
      .addEventListener("click", () => this.addContact());

    document
      .querySelector(".header__controls-btn--minus")
      .addEventListener("click", () => this.clearList());

    document.querySelector(".header__search-input").oninput = debounce(
      (event) => this.searchContacts(event.target.value),
      300
    );

    document
      .querySelectorAll(".header__search-item")
      .forEach((item) =>
        item.addEventListener("click", () =>
          this.filterByLetter(item.getAttribute("data-id"))
        )
      );
  }

  loadContactsFromLocalStorage() {
    const parsedContacts = JSON.parse(localStorage.getItem("contacts")) || [];
    this.usersName = parsedContacts;
    this.renderContacts();
  }

  renderContacts() {
    this.contactList.innerHTML = ""; 
    this.usersName.forEach((user) => this.renderContact(user));
  }

  renderContact(user) {
    const listItem = document.createElement("li");
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

    const btnDelete = listItem.querySelector(".contact-list__btn-delete");
    btnDelete.addEventListener("click", () =>
      this.deleteContact(user, listItem)
    );

    const btnEdit = listItem.querySelector(".contact-list__btn-edit");
    btnEdit.addEventListener("click", () => this.editContact(user, listItem));

    this.contactList.appendChild(listItem);
  }

  addContact() {

    if (this.validateInputs()) {
      const name = inputName.value.trim();
      const surname = inputSurname.value.trim();
      const vacancy = inputVacancy.value.trim();
      const phone = inputNumber.value.trim();

      const newUser = { name, surname, vacancy, phone };
      this.usersName.push(newUser);
      this.renderContact(newUser);
      this.updateLocalStorage();
      this.updateNameCounts();

      inputName.value = "";
      inputSurname.value = "";
      inputVacancy.value = "";
      inputNumber.value = "";
    }
  }

  validateInputs() {
    const nameRegEx =
      /^[a-zA-Z]{2,}(\s[a-zA-Z]{1,}[-']?[a-zA-Z]{2,})?\s?([a-zA-Z]{1,})?$/;
    const phoneRegEx = /^\d+$/;

    const name = inputName.value.trim();
    const surname = inputSurname.value.trim();
    const vacancy = inputVacancy.value.trim();
    const phone = inputNumber.value.trim();

    if (
      !nameRegEx.test(name) ||
      !nameRegEx.test(surname) ||
      !nameRegEx.test(vacancy) ||
      !phoneRegEx.test(phone)
    ) {
      alert(
        "The first, last name and vacancy must contain only letters and only in English. The phone number must contain only numbers"
      );
      return false;
    }

    return true;
  }

  deleteContact(user, listItem) {
    listItem.remove();
    this.usersName = this.usersName.filter(
      (contact) => contact.name !== user.name
    );
    this.updateLocalStorage();
    this.updateNameCounts();
  }

  editContact(user, listItem) {
    this.inputNameEdit.value = user.name;
    this.inputSurnameEdit.value = user.surname;
    this.inputVacancyEdit.value = user.vacancy;
    this.inputNumberEdit.value = user.phone;

    this.modalFormEdit.showModal();

    const btnSave = this.modalFormEdit.querySelector(".form__button-save");
    btnSave.onclick = () => {
      user.name = this.inputNameEdit.value;
      user.surname = this.inputSurnameEdit.value;
      user.vacancy = this.inputVacancyEdit.value;
      user.phone = this.inputNumberEdit.value;

      this.updateLocalStorage();
      this.updateRenderedContact(user, listItem);
      this.modalFormEdit.close();
      this.updateNameCounts();
    };
  }

  updateRenderedContact(user, listItem) {
    listItem.querySelector(".contact-list__name").textContent = user.name;
    listItem.querySelector(".contact-list__surname").textContent = user.surname;
    listItem.querySelector(".contact-list__vacancy").textContent = user.vacancy;
    listItem.querySelector(".contact-list__phone-number").textContent =
      user.phone;
  }

  updateLocalStorage() {
    localStorage.setItem("contacts", JSON.stringify(this.usersName));
  }

  updateNameCounts() {
    const nameCount = {};
    this.usersName.forEach((user) => {
      const firstLetter = user.name.charAt(0).toUpperCase();
      nameCount[firstLetter] = (nameCount[firstLetter] || 0) + 1;
    });

    document.querySelectorAll(".header__search-item").forEach((item) => {
      const letter = item.getAttribute("data-id");
      item.textContent = `${letter}: ${nameCount[letter] || 0}`;
    });
  }

  clearList() {
    this.contactList.innerHTML = "";
    this.usersName = [];
    this.updateLocalStorage();
    this.updateNameCounts();
  }

  searchContacts(searchValue) {
    const lowercasedSearchValue = searchValue.toLowerCase();
    const contactItems = document.querySelectorAll(".contact-list__item");
    contactItems.forEach((contact) => {
      const contactName = contact
        .querySelector(".contact-list__name")
        .textContent.toLowerCase();
      const contactSurname = contact
        .querySelector(".contact-list__surname")
        .textContent.toLowerCase();
      contact.style.display =
        contactName.includes(lowercasedSearchValue) ||
        contactSurname.includes(lowercasedSearchValue)
          ? ""
          : "none";
    });
  }

  filterByLetter(selectedLetter) {
    const contactItems = document.querySelectorAll(".contact-list__item");
    contactItems.forEach((contact) => {
      const contactName = contact.querySelector(
        ".contact-list__name"
      ).textContent;
      contact.style.display =
        contactName.charAt(0).toUpperCase() === selectedLetter ? "" : "none";
    });
  }
}

const contactManager = new ContactManager();
