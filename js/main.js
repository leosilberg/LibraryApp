num_page = 1;

function goToNextPage() {
  num_page++;
  getPageNum(num_page);
}
function goToBackPage() {
  if (num_page > 1) {
    num_page--;
    getPageNum(num_page);
  }
}

function bookClicked(id) {
  location.assign(`/bookdetails.html?bookID=${id}&type=local`);
}
