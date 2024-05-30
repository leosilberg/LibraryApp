const url = `http://localhost:8001/books`;
let searchFilterInput = "";
let favoritesFilterInput = "";
let pageNum = 1;
bookGrid = document.querySelector(".book__grid");
displayBookOnGrid();
const elemSearchInput = document.querySelector("#search");
const elemCurrentPage = document.querySelector("#currentPage");
elemSearchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    filterBySearch();
  }
});

function disablePagesButtons(links) {
  document.querySelector(".NextPage").style.pointerEvents = links.includes(
    "next"
  )
    ? "all"
    : "none";
  document.querySelector(".BackPage").style.pointerEvents = links.includes(
    "prev"
  )
    ? "all"
    : "none";
}

async function displayBookOnGrid() {
  bookGrid.innerHTML = "";
  try {
    const response = await getLibraryBooks(
      pageNum,
      favoritesFilterInput,
      searchFilterInput
    );
    elemCurrentPage.parentElement.style.display = "flex";
    disablePagesButtons(response.headers.link);
    response.data.forEach((book) => addBookToGrid(book));
  } catch (error) {
    console.log(error);
  }
}

function addBookToGrid(book) {
  console.log(book);
  const newBookDiv = document.createElement("div");
  newBookDiv.addEventListener("mouseover", (event) => {
    newBookDiv.querySelector(".book__actions-card").style.display = "flex";
  });
  newBookDiv.addEventListener("mouseleave", (e) => {
    newBookDiv.querySelector(".book__actions-card").style.display = "none";
  });
  newBookDiv.className = "book__card";
  newBookDiv.innerHTML = `
  <div class="book__hidden-container " onclick="bookClicked('${book.id}')">
    <img class="book__image-card" src=${book.image} alt="" />
    <div class="book__actions-card">
    <i class="fa-solid fa-trash" onclick="deleteBookFromLirary(event,'${
      book.id
    }')" onmouseover="largeIcon(this)" onmouseleave="smallIcon(this)"></i>
    <i class="fa-solid fa-minus" onclick="updateNumCoppies(event,this,'${
      book.id
    }',-1)" onmouseover="largeIcon(this)" onmouseleave="smallIcon(this)"></i>
      <span class="numCopies">${book.numCopies}</span>
      <i class="fa-solid fa-plus" onclick="updateNumCoppies(event,this,'${
        book.id
      }',1)" onmouseover="largeIcon(this)" onmouseleave="smallIcon(this)"></i>
      <i class="fa-${book.favorite == "true" ? "solid" : "regular"} fa-heart"
      onclick="changeFavorite(event,this,'${
        book.id
      }')" onmouseover="largeIcon(this)" onmouseleave="smallIcon(this)"></i>
    </div>
  </div>
  <h3 class="book__name-card">${book.bookName}</h3>
  <p class="author">by ${book.authorsName[0]}</p>
`;
  bookGrid.appendChild(newBookDiv);
}
function updateNumCoppies(event, _this, id, change) {
  event.preventDefault();
  event.stopPropagation();
  const elem = _this.parentNode.parentNode.querySelector(".numCopies");
  const currentNumCopies = parseInt(elem.innerText);
  if (currentNumCopies == 0 && change == "-1") return;
  elem.innerText = currentNumCopies + parseInt(change);
  updateNumCoppiesToJson(id, currentNumCopies, change);
}
function changeFavorite(event, _this, id) {
  event.preventDefault();
  event.stopPropagation();
  changeBookFavorite(id, _this.className == "fa-solid fa-heart");
  _this.className == "fa-regular fa-heart"
    ? (_this.className = "fa-solid fa-heart")
    : (_this.className = "fa-regular fa-heart");
}

function deleteBookFromLirary(event, id) {
  event.preventDefault();
  event.stopPropagation();
  deleteLocalBook(id);
}
function filterBySearch() {
  pageNum = 1;
  elemCurrentPage.innerText = pageNum;
  searchFilterInput =
    `&bookName_like=${document.querySelector("#search").value}` || "";
  displayBookOnGrid();
}

function favoritesFilter() {
  pageNum = 1;
  elemCurrentPage.innerText = pageNum;
  favoritesFilterInput = document.querySelector(".favoritesSelector").checked
    ? "&favorite=true"
    : "";
  displayBookOnGrid();
}
function switchPage(action) {
  pageNum += parseInt(action);
  elemCurrentPage.innerText = pageNum;
  displayBookOnGrid();
}
function largeIcon(icon) {
  icon.style.fontSize = "24px";
}
function smallIcon(icon) {
  icon.style.fontSize = "";
}

function bookClicked(id) {
  location.assign(`/bookdetails.html?bookID=${id}&type=local`);
}
