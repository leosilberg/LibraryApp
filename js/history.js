const elemTable = document.querySelector("table");
async function init() {
  try {
    const result = await getAllHistroy();
    result.data.forEach((element) => {
      elemTable.innerHTML += `<td>${new Date(element.time).toLocaleString(
        "en-US",
        {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
        }
      )}</td><td>${element.operation}</td><td>${element.bookName}</td>`;
    });
  } catch (error) {
    console.log(error);
  }
}
init();
