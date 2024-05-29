url = `http://localhost:8001/books`;
searchFilterInput = "";
favoritesFilterInput = "";
let pageNum = 1;
bookGrid = document.querySelector(".book__grid");

displayBookOnGrid();
function getPageNum(currentPageNum) {
  pageNum = currentPageNum;
  displayBookOnGrid();
}
function disablePagesButtons(links) {
  document.querySelector(".NextPage").disabled = !links.includes("next");
  document.querySelector(".BackPage").disabled = !links.includes("prev");
}

async function displayBookOnGrid() {
  //   url = `http://localhost:8001/books?_page=${pageNum}&_per_page=5`;
  bookGrid.innerHTML = "";
  response = await getLibraryBooks(
    pageNum,
    favoritesFilterInput,
    searchFilterInput
  );
  disablePagesButtons(response.headers.link);
  response.data.forEach((book) => addBookToGrid(book));
}

function addBookToGrid(book) {
  const newBookDiv = document.createElement("div");
  newBookDiv.addEventListener("mouseover", (event) => {
    newBookDiv.querySelector(".hiddenDiv").style.display = "block";
    newBookDiv.querySelector(".hiddenDiv").style.transform =
      "translateY(-60px)";
    // newBookDiv.querySelector(".hiddenDiv").style.display = "block";
  });
  newBookDiv.addEventListener("mouseleave", (e) => {
    newBookDiv.querySelector(".hiddenDiv").style.display = "none";
  });
  newBookDiv.className = "book";
  newBookDiv.innerHTML = `
  <div class="img-hidden-div"><img class="book-img" src=${book.image} alt="" />
    <div class="hiddenDiv">
      <p class="numCopies">${book.numCopies}</p>
      <button onclick="updateNumCoppies(this,${
        book.id
      },1)" class="addCopy">+</button>
      <i class="fa-${book.favorite == "true" ? "solid" : "regular"} fa-heart"
      onclick="changeFavorite(this,${book.id})"></i>
      <button onclick="deleteBook(${
        book.id
      })" class="delete-book">delete</button>
      <button onclick="updateNumCoppies(this,${
        book.id
      },-1)" class="reduceCopy">-</button>
    </div>
  </div>
  <p class="book-name">${book.bookName}</p>
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
  changeBookFavorite(id, _this.className == "fa-regular fa-heart");
}

function deleteBook(id) {
  deleteBookFromLirary(id);
}

function filtrBySearch() {
  pageNum = 1;
  searchFilterInput =
    `&bookName_like=${document.querySelector(".search-bar").value}` || "";
  displayBookOnGrid();
}

function favoritesFilter() {
  pageNum = 1;
  if (document.querySelector(".favoritesSelector").checked)
    favoritesFilterInput = "&favorite=true";
  else favoritesFilterInput = "";
  displayBookOnGrid();
}
function switchPage(action) {
  pageNum += parseInt(action);
  displayBookOnGrid();
}
