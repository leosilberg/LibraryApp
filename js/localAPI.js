url = `http://localhost:8001/books`;

function getLibraryBooks(pageNum, favoriteFilter, searchFilter) {
  return axios.get(
    `${url}?_page=${pageNum}&_limit=5${favoriteFilter}${searchFilter}`
  );
}
function updateNumCoppiesToJson(id, currentNumCopies, change) {
  axios.patch(`${url}/${id}`, {
    numCopies: currentNumCopies + parseInt(change),
  });
}
function changeBookFavorite(id, bool) {
  axios.patch(`${url}/${id}`, { favorite: bool == "true" ? "true" : "false" });
}
function deleteBookFromLirary(id) {
  axios.delete(`${url}/${id}`);
}
function addNewBook(book) {
  return axios.post(localHostUrl + "books", book);
}
