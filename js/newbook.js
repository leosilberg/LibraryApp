console.clear();
const elemGrid = document.querySelector(".book__grid");
const elemSearchInput = document.querySelector("#search");
let maxResults = 20;
let currentPage = 1;
async function search() {
  elemGrid.innerHTML = "";
  try {
    let result = await searchGoogleBooks(
      elemSearchInput.value,
      maxResults * currentPage,
      maxResults
    );
    result.data.items.forEach((book) => {
      const data = book.volumeInfo;

      let element = `<div class="book__card" onclick="bookClicked('${
        book.id
      }')">
    <img class="book__image" src="${
      data.imageLinks ? data.imageLinks.thumbnail : ""
    }"/>
    <p class="book__name">${data.title}</p>
    <div class="book__authors">
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
      elemGrid.innerHTML += element;
    });
  } catch (error) {
    console.log(error);
  }
}

function bookClicked(id) {
  console.log(id);
  location.assign(
    `http://127.0.01:3000/bookdetails.html?bookID=${id}&type=google`
  );
}

async function addBook(id) {
  try {
    const result = await getGoogleBook(id);
    const book = mapToJsonBook(result);
    console.log(book);
    addNewBook(book);
  } catch (error) {
    console.log(error);
  }
}
