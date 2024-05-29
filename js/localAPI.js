let LOCAL_URL = "http://localhost:8001/";
axios.interceptors.response.use(
  function (response) {
    if (
      response.config.url.includes(LOCAL_URL + "books") &&
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
  return axios.get(LOCAL_URL + "history");
}
function addHistoryAction(action) {
  return axios.post(LOCAL_URL + "history", action);
}
async function addNewBook(book) {
  const result = await axios.get(LOCAL_URL + "books?bookName=" + book.bookName);
  if (result.data.length != 0) {
    console.log("dsfv");
    throw "Book already added to library";
  }
  return axios.post(LOCAL_URL + "books", book);
}

function getLocalBook(id) {
  return axios.get(LOCAL_URL + "books/" + id);
}

function getLibraryBooks(pageNum, favoriteFilter, searchFilter) {
  return axios.get(
    `${LOCAL_URL}books?_page=${pageNum}&_limit=5${favoriteFilter}${searchFilter}`
  );
}
function updateNumCoppiesToJson(id, currentNumCopies, change) {
  return axios.patch(`${LOCAL_URL}books/${id}`, {
    numCopies: parseInt(currentNumCopies) + parseInt(change),
  });
}
function changeBookFavorite(id, favorite) {
  return axios.patch(`${LOCAL_URL}books/${id}`, { favorite: favorite ? "false" : "true" });
}
function deleteBookFromLirary(id) {
  return axios.delete(`${LOCAL_URL}books/${id}`);
}
