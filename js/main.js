url = `http://localhost:8001/books`;
searchFilterInput = "";
favoritesFilterInput = "";
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
  document.querySelector(".NextPage").disabled = !links.includes("next");
  document.querySelector(".BackPage").disabled = !links.includes("prev");
}

async function displayBookOnGrid() {
  //   url = `http://localhost:8001/books?_page=${pageNum}&_per_page=5`;
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
  <div class="book__hidden-container ">
    <img class="book__image-card" src=${
      book.image
    } alt="" onclick="bookClicked('${book.id}')"/>
    <div class="book__actions-card">
    <i class="fa-solid fa-trash" onclick="deleteBookFromLirary('${
      book.id
    }')" onmouseover="largeIcon(this)" onmouseleave="smallIcon(this)"></i>
    <i class="fa-solid fa-minus" onclick="updateNumCoppies(this,'${
      book.id
    }',-1)" onmouseover="largeIcon(this)" onmouseleave="smallIcon(this)"></i>
      <span class="numCopies">${book.numCopies}</span>
      <i class="fa-solid fa-plus" onclick="updateNumCoppies(this,'${
        book.id
      }',1)" onmouseover="largeIcon(this)" onmouseleave="smallIcon(this)"></i>
      <i class="fa-${book.favorite == "true" ? "solid" : "regular"} fa-heart"
      onclick="changeFavorite(this,'${
        book.id
      }')" onmouseover="largeIcon(this)" onmouseleave="smallIcon(this)"></i>
    </div>
  </div>
  <h3 class="book__name-card">${book.bookName}</p>
  <p class="author">by ${book.authorsName[0]}</p>
`;
  bookGrid.appendChild(newBookDiv);
}
function updateNumCoppies(_this, id, change) {
  const elem = _this.parentNode.parentNode.querySelector(".numCopies");
  const currentNumCopies = parseInt(elem.innerText);
  if (currentNumCopies == 0 && change == "-1") return;
  elem.innerText = currentNumCopies + parseInt(change);
  updateNumCoppiesToJson(id, currentNumCopies, change);
}
function changeFavorite(_this, id) {
  changeBookFavorite(id, _this.className == "fa-solid fa-heart");
  _this.className == "fa-regular fa-heart"
    ? (_this.className = "fa-solid fa-heart")
    : (_this.className = "fa-regular fa-heart");
}

function filterBySearch() {
  pageNum = 1;
  searchFilterInput =
    `&bookName_like=${document.querySelector("#search").value}` || "";
  displayBookOnGrid();
}

function favoritesFilter() {
  pageNum = 1;
  favoritesFilterInput = document.querySelector(".favoritesSelector").checked
    ? "&favorite=true"
    : "";
  displayBookOnGrid();
}
function switchPage(action) {
  pageNum += parseInt(action);
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
