console.clear();
const elemGrid = document.querySelector(".book__grid");
const elemSearchInput = document.querySelector("#search");
const elemCurrentPage = document.querySelector("#currentPage");
let maxResults = 20;
let currentPage = 1;
async function search() {
  var queryParams = new URLSearchParams(window.location.search);
  queryParams.set("search", elemSearchInput.value);
  history.replaceState(null, null, "?" + queryParams.toString());
  elemGrid.innerHTML = "";
  try {
    let result = await searchGoogleBooks(
      elemSearchInput.value,
      maxResults * currentPage,
      maxResults
    );
    result.data.items.forEach((book) => {
      const data = book.volumeInfo;
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
    <img class="book__image-card" src="${
      data.imageLinks ? data.imageLinks.thumbnail : ""
    }" onclick="bookClicked('${book.id}')"/>
    <div class="book__actions-card">
    <i class="fa-solid fa-plus" onclick="addBook('${book.id}')"></i>
    </div>
    </div>
    <h3 class="book__name-card">${data.title}</h3>
    <div class="book__authors-card">
    ${
      data.authors
        ? data.authors
            .map((author) => {
              return `<p>${author}</p>`;
            })
            .join("")
        : ""
    }
    </div>
    </div>`;
      elemGrid.appendChild(newBookDiv);
    });
    elemCurrentPage.parentElement.style.display = "flex";
  } catch (error) {
    console.log(error);
  }
}

function bookClicked(id) {
  console.log(id);
  location.assign(`/bookdetails.html?bookID=${id}&type=google`);
}

async function addBook(id) {
  try {
    const result = await getGoogleBook(id);
    const book = mapToJsonBook(result);
    console.log(book);
    await addNewBook(book);
  } catch (error) {
    console.log(error);
  }
}

function nextPage() {
  currentPage += 1;
  elemCurrentPage.innerText = currentPage;
  search();
}

function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    elemCurrentPage.innerText = currentPage;
    search();
  }
}

function init() {
  elemSearchInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      search();
    }
  });
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  if (urlParams.has("search")) {
    elemSearchInput.value = urlParams.get("search");
    search();
  }
}
init();
