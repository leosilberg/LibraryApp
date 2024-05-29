let localHostUrl = "http://localhost:8001/";
axios.interceptors.response.use(
  function (response) {
    if (
      response.config.url.includes(localHostUrl + "books") &&
      response.config.method != "get"
    ) {
      let operation;
      switch (response.config.method) {
        case "post":
          operation = "create";
          break;
        case "delete":
          operation = "delete";
          break;
        case "patch":
          operation = "update";
      }
      const action = {
        operation: operation,
        time: new Date().getTime(),
        bookName: response.data.bookName,
      };
      console.log(action);
      addHistoryAction(action);
    }
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
function getAllHistroy() {
  return axios.get(localHostUrl + "history");
}
function addHistoryAction(action) {
  return axios.post(localHostUrl + "history", action);
}
async function addNewBook(book) {
  const result = await axios.get(
    localHostUrl + "books?bookName=" + book.bookName
  );
  if (result.data.length!=0) {
    console.log("dsfv")
    throw "Book already added to library";
  }
  return axios.post(localHostUrl + "books", book);
}

function getLocalBook(id) {
  return axios.get(localHostUrl + "books/" + id);
}
let pageNum = 1;
url = `http://localhost:8001/books`;
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
function displayBookOnGrid() {
  //   url = `http://localhost:8001/books?_page=${pageNum}&_per_page=5`;
  bookGrid.innerHTML = "";
  console.log(
    `${url}?_page=${pageNum}&_per_page=5${searchFilter()}${favoritesFilter()}`
  );
  axios
    .get(`${url}?_page=${pageNum}&_per_page=5${favoritesFilter()}`)
    .then(function (response) {
      disableButtons(response.data.pages);
      response.data.data.forEach((book) => addBookToGrid(book));
    })
    .catch(function (error) {
      console.error("Error fetching data:", error);
    });
}
function filtrBySearch() {
  displayBookOnGrid();
}

function addBookToGrid(book) {
  const newBookDiv = document.createElement("div");
  newBookDiv.className = "book";
  newBookDiv.innerHTML = `
    <img class="book-img" src=${book.image} alt="" onclick="bookClicked('${
    book.id
  }')"/>
    <p class="book-name">${book.bookName}</p>
    <p class="author">by ${book.authorsName[0]}</p>
    <p class="numCopies">${book.numCopies}</p>
    <button onclick="updateNumCoppies(this,${
      book.id
    },1)" class="addCopy">+</button>
    <input type="checkbox" class="favorate" 
    ${book.favorite == "true" ? "checked" : ""}
    onclick="changeFavorite(this,'${book.id}')"/>
    <button onclick="deleteBook('${
      book.id
    }')" class="delete-book">delete</button>
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
  displayBookOnGrid();
}
function searchFilter() {
  search = `&bookName=${document.querySelector(".search-bar").value}`;
  return search.trim() || "";
}
function favoritesFilter() {
  if (document.querySelector(".favoritesSelector").checked)
    return "&favorite=true";
  return "";
}
