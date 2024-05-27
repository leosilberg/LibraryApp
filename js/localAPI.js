let localHostUrl = "http://localhost:8001/";
function addNewBook(book) {
  return axios.post(localHostUrl + "books", book);
}
