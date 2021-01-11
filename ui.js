const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
changeImage();

const badButton = document.querySelector(".bad");
const goodButton = document.querySelector(".good");
const newButton = document.querySelector(".new");
const superButton = document.querySelector(".super");
const prevButton = document.querySelector(".prev");

const onDrop = e => {
  e.preventDefault();

  const file = e.dataTransfer.files[0];
  const reader = new FileReader();

  reader.onload = file => {
    const img = new Image();

    img.onload = () => {
      context.drawImage(img, 0, 0, 480, 480);
    };

    img.src = file.target.result;
  };

  reader.readAsDataURL(file);
};

canvas.addEventListener("dragover", e => e.preventDefault(), false);
canvas.addEventListener("drop", onDrop, false);

badButton.addEventListener("click", () => addExample("bad"));
goodButton.addEventListener("click", () => addExample("good"));
superButton.addEventListener("click", () => addExample("super"));
newButton.addEventListener("click", () => changeImage());
prevButton.addEventListener("mouseover", () => changeCursor());

document.querySelector(".predict").addEventListener("click", predict);
document.querySelector(".save").addEventListener("click", predict);
