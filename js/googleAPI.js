const GOOGLE_URL = "https://www.googleapis.com/books/v1/volumes";
function searchGoogleBooks(searchQuery, startIndex, maxResults) {
  return axios.get(
    `${GOOGLE_URL}?q=${searchQuery}&startIndex=${startIndex}&maxResults=${maxResults}`
  );
}

function getGoogleBook(bookID) {
  return axios.get(`${GOOGLE_URL}/${bookID}`);
}

function mapToJsonBook(googleBook) {
  const data = googleBook.data.volumeInfo;
  console.log(data.imageLinks)
  return {
    bookName: data.title,
    authorsName: data.authors ? data.authors : [],
    numPages: data.pageCount,
    shortDescription: data.description ? data.description : "",
    image: data.imageLinks.thumbnail,
    numCopies: 1,
    categories: data.categories ? data.categories : [],
    ISBN: data.industryIdentifiers
      ? data.industryIdentifiers[0].identifier
      : "",
  };
}
