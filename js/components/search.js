/* Поиск */
const searchInput = document.querySelector(".header__search-input");

const search = () => {
  searchInput.oninput = function () {
    let searchValue = this.value.trim().toLowerCase();
    let searchItems = document.querySelectorAll("li");

    if (searchValue !== "") {
      searchItems.forEach(function (element) {
        if (element.innerText.toLowerCase().search(searchValue) === -1) {
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
};

export { search };
