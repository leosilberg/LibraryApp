const elemBookForm = document.querySelector("form");
const elemAuthors = document.querySelector("#authors");
const elemCategories = document.querySelector("#categories");

function addAuthor() {
  elemAuthors.innerHTML += ` <input type="text" name="authorsName[${elemAuthors.childElementCount}]" required />`;
}
function addCategory() {
  elemCategories.innerHTML += ` <input type="text" name="categories[${elemCategories.childElementCount}]" required />`;
}
async function init() {
  elemBookForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(elemBookForm);
    try {
      const result = await axios.post("http://localhost:8001/books", formData, {
        headers: { "Content-Type": "application/json" },
      });
      location.assign(`/bookdetails.html?bookID=${result.data.id}&type=local`);
    } catch (error) {
      console.log(error);
    }
  });
}
init();
