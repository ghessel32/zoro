const Search = () => {
  let filter = document.getElementById("search").value.toUpperCase();
  let course = document.getElementsByClassName("cour_box");
  let head = document.getElementsByTagName("h3");

  for (let i = 0; i < head.length; i++) {
    const a = head[i].getElementsByTagName("a")[0];

    let textValue = a.innerText.toUpperCase(); // Get the inner text of the <a> element and convert it to uppercase

    if (textValue.indexOf(filter) > -1) {
      course[i].style.display = "";
    } else {
      course[i].style.display = "none";
    }
  }
};
