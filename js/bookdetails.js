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
      type == "google" ? await getGoogleBook(id) : await getLocalBook(id);
    book = type == "google" ? mapToJsonBook(result) : result.data;
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
      <button onclick="addToLibrary()" class="button">Add to library</button>
  `
        : `
        <i class="fa-solid fa-trash" onclick="deleteBook('${book.id}')"></i>
        <i class="fa-${book.favorite == "true" ? "solid" : "regular"} fa-heart"
      onclick="changeFavorite(this,'${book.id}')"></i>
        <div class="button-counter"><button class="button" onclick="updateCopies('-1')">-</button>
    <p>${book.numCopies}</p>
    <button class="button" onclick="updateCopies('1')">+</button></div>
    `;
  } catch (error) {
    console.log(error);
  }
}
async function addToLibrary() {
  try {
    const result = await addNewBook(book);
    console.log(result);
    var queryParams = new URLSearchParams(window.location.search);
    queryParams.set("bookID", result.data.id);
    queryParams.set("type", "local");
    history.replaceState(null, null, "?" + queryParams.toString());
  } catch (error) {
    console.log(error);
  }
}
async function updateCopies(change) {
  if (book.numCopies == "0" && change == "-1") {
    console.log("scadfv")
    return;
  }
  try {
    const result = await updateNumCoppiesToJson(
      book.id,
      book.numCopies,
      change
    );
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}
async function changeFavorite(_this, id) {
  try {
    const result = await changeBookFavorite(
      id,
      _this.className == "fa-solid fa-heart"
    );
  } catch (error) {
    console.log(error);
  }
}
async function deleteBook(id) {
  try {
    const result = await deleteBookFromLirary(id);
    console.log(result);
    location.assign(`/index.html`);
  } catch (error) {
    console.log(error);
  }
}
function init() {
  const queryString = window.location.search;
  console.log(location);
  const urlParams = new URLSearchParams(queryString);
  displayBookDetails(urlParams.get("bookID"), urlParams.get("type"));
}
init();
