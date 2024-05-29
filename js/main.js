url = `http://localhost:8001/books`;
searchFilterInput = "";
favoritesFilterInput = "";
let pageNum = 1;
bookGrid = document.querySelector(".book__grid");
displayBookOnGrid();
const elemSearchInput = document.querySelector("#search");
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
    response = await getLibraryBooks(
      pageNum,
      favoritesFilterInput,
      searchFilterInput
    );
    disablePagesButtons(response.headers.link);
    response.data.forEach((book) => addBookToGrid(book));
    elemCurrentPage.parentElement.style.display = "flex";
  } catch (error) {
    console.log(error);
  }
}

function addBookToGrid(book) {
  console.log(book);
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
  <div class="img-hidden-div">
    <img class="book-img" src=${book.image} alt="" onclick="bookClicked('${
    book.id
  }')"/>
    <div class="hiddenDiv">
      <p class="numCopies">${book.numCopies}</p>
      <i class="fa-solid fa-plus" onclick="updateNumCoppies(this,'${
        book.id
      }',1)" onmouseover="largeIcon(this)" onmouseleave="smallIcon(this)"></i>
      <i class="fa-${book.favorite == "true" ? "solid" : "regular"} fa-heart"
      onclick="changeFavorite(this,'${
        book.id
      }')" onmouseover="largeIcon(this)" onmouseleave="smallIcon(this)"></i>
      <i class="fa-solid fa-trash" onclick="deleteBookFromLirary('${
        book.id
      }')" onmouseover="largeIcon(this)" onmouseleave="smallIcon(this)"></i>
      <i class="fa-solid fa-minus" onclick="updateNumCoppies(this,'${
        book.id
      }',-1)" onmouseover="largeIcon(this)" onmouseleave="smallIcon(this)"></i>
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
  _this.className == "fa-regular fa-heart"
    ? (_this.className = "fa-solid fa-heart")
    : (_this.className = "fa-regular fa-heart");
  changeBookFavorite(
    id,
    _this.className == "fa-solid fa-heart"
  )
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
  icon.style.fontSize = "20px";
}
function smallIcon(icon) {
  icon.style.fontSize = "16px";
}

function bookClicked(id) {
  location.assign(`/bookdetails.html?bookID=${id}&type=local`);
}
