const elemBookContainer = document.querySelector(".book__container");
const elemBookImage = elemBookContainer.querySelector(".book__image");
const elemBookName = elemBookContainer.querySelector(".book__name");
const elemBookAuthors = elemBookContainer.querySelector(".book__authors");
const elemBookCategories = elemBookContainer.querySelector(".book__categories");
const elemBookDescription =
  elemBookContainer.querySelector(".book__description");
const elemBookPages = elemBookContainer.querySelector(".book__pages");
const elemBookISBN = elemBookContainer.querySelector(".book__ISBN");
const elemBookActions = elemBookContainer.querySelector(".book__actions");
let book;
async function displayBookDetails(id, type) {
  try {
    const result =
      type == "google" ? await getGoogleBook(id) : await getGoogleBook();
    book = type == "google" ? mapToJsonBook(result) : book;
    elemBookImage.src = book.image;
    elemBookName.innerText = book.bookName;
    elemBookAuthors.innerHTML = book.authorsName
      .map((author) => `<h3>${author}</h3>`)
      .join("");
    elemBookCategories.innerHTML = book.categories
      .map((category) => `<p>${category}</p>`)
      .join("");
    elemBookDescription.innerHTML = book.shortDescription;
    elemBookPages.innerText = `${book.numPages} pages`;
    elemBookISBN.innerText = `ISBN: ${book.ISBN}`;
    elemBookActions.innerHTML =
      type == "google"
        ? `
      <button onclick="addToLibrary()">Add to library</button>
  `
        : `<button>-</button>
    <p>${book.numCopies}
    <button>+</button>
    `;
  } catch (error) {
    console.log(error);
  }
}
async function addToLibrary() {
  try {
    const result = await addNewBook(book);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}
function init() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  displayBookDetails(urlParams.get("bookID"), urlParams.get("type"));
}
init();
