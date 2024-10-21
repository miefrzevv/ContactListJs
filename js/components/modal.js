/* Модальное окно при нажатии на Add */
const btnAdd = document.querySelector(".header__controls-btn--plus");
const modalForm = document.querySelector(".form");

const openModal = () => {
  modalForm.showModal();
};

btnAdd.addEventListener("click", openModal);

export { openModal };
