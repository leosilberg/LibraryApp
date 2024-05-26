let pageNum = 1;
url = `http://localhost:8001/books`;
favoritefilter = "";
bookGrid = document.querySelector(".book-grid");
function getPageNum(currentPageNum) {
  pageNum = currentPageNum;
  displayBookOnGrid();
}
function disableButtons(pages) {
  if (pages == pageNum) document.querySelector(".NextPage").disabled = true;
  else document.querySelector(".NextPage").disabled = false;
  if (pageNum == 1) document.querySelector(".BackPage").disabled = true;
  else document.querySelector(".BackPage").disabled = false;
}
function displayBookOnGrid(userSearch = "") {
  //   url = `http://localhost:8001/books?_page=${pageNum}&_per_page=5`;
  bookGrid.innerHTML = "";
  if (document.querySelector(".favoritesSelector").checked)
    favoritefilter = "&favorite=true";
  else favoritefilter = "";
  axios
    .get(`${url}?_page=${pageNum}&_per_page=5${favoritefilter}`)
    .then(function (response) {
      disableButtons(response.data.pages);
      response.data.data.forEach((book) => addToTable(book));
    })
    .catch(function (error) {
      console.error("Error fetching data:", error);
    });
}
function filtrBySearch() {
  userSearch = document.querySelector(".search-bar").value;
  displayBookOnGrid(userSearch);
}
function addToTable(book) {
  const newBookDiv = document.createElement("div");
  newBookDiv.className = "book";
  newBookDiv.innerHTML = `
    <img class="book-img" src=${book.image} alt="" />
    <p class="book-name">${book.bookName}</p>
    <p class="author">by ${book.authorsName[0]}</p>
    <p class="numCopies">${book.numCopies}</p>
    <button onclick="updateNumCoppies(this,${
      book.id
    },1)" class="addCopy">+</button>
    <input type="checkbox" class="favorate" 
    ${book.favorite == "true" ? "checked" : ""}
    onclick="changeFavorite(this,${book.id})"/>
    <button onclick="deleteBook(${book.id})" class="delete-book">delete</button>
    <button onclick="updateNumCoppies(this,${
      book.id
    },-1)" class="reduceCopy">-</button>
    `;
  bookGrid.appendChild(newBookDiv);
}
function updateNumCoppies(_this, id, change) {
  event.preventDefault();

  const elem = _this.parentNode.querySelector(".numCopies");
  const currentNumCopies = parseInt(elem.innerText);
  if (currentNumCopies == 0 && change == "-1") return;
  elem.innerText = currentNumCopies + parseInt(change);

  axios.patch(`${url}/${id}`, {
    numCopies: currentNumCopies + parseInt(change),
  });
}

function deleteBook(id) {
  axios.delete(`${url}/${id}`);
}
displayBookOnGrid();
function changeFavorite(_this, id) {
  if (_this.checked) axios.patch(`${url}/${id}`, { favorite: "true" });
  else axios.patch(`${url}/${id}`, { favorite: "false" });
}
function showFavorites() {
  //   if (document.querySelector(".favoritesSelector").checked)
  //     url += "?favorite=true";
  displayBookOnGrid();
}
