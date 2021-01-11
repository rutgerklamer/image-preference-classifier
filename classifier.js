let classifier;
let net;
let prevImageLoc;
let prevChoice = 0;
let mustRateTwice = 1;

let trainingSets = [0, 0];

const loadClassifier = async () => {
  classifier = knnClassifier.create();
  net = await mobilenet.load();

  document.querySelector(".loading").classList.add("hidden");
  document.getElementById("rating").classList.remove("hidden");
};

const addExample = label => {
  // Improve ugly design
  mustRateTwice++;
  prevButton.addEventListener("click", () => prevImage());
  const image = tf.browser.fromPixels(canvas);
  const feature = net.infer(image, "conv_preds");

  if (label != "super") {
    classifier.addExample(feature, label);
  } else {
    classifier.addExample(feature, "good");
  }
  const preloadImage = newImage();
  prevChoice = 0;
  canvas.classList.remove('animate__animated', 'animate__fadeOutUp', 'animate__fadeOutTopLeft', 'animate__fadeOutTopRight');


  // Definitly improve this design
  if (label == "bad") {
        canvas.classList.add('animate__animated', 'animate__fadeOutTopLeft');
        preloadImage.onload = () => {
        canvas.addEventListener('animationend', () => {
          canvas.classList.remove('animate__animated', 'animate__fadeOutTopLeft');
              clearCanvas();
              context.drawImage(preloadImage, 0, 0, 480, 480);
              image.dispose();
        });
        ++trainingSets[0];
        };
    } else if (label == "good") {
        prevChoice++;
        canvas.classList.add('animate__animated', 'animate__fadeOutTopRight');
        preloadImage.onload = () => {
        canvas.addEventListener('animationend', () => {
          canvas.classList.remove('animate__animated', 'animate__fadeOutTopRight');
              clearCanvas();
              context.drawImage(preloadImage, 0, 0, 480, 480);
              image.dispose();
        });
        ++trainingSets[1];
        };
    } else {
      prevChoice++;
      canvas.classList.add('animate__animated', 'animate__fadeOutUp');
      preloadImage.onload = () => {
      canvas.addEventListener('animationend', () => {
        canvas.classList.remove('animate__animated', 'animate__fadeOutUp');
            clearCanvas();
            context.drawImage(preloadImage, 0, 0, 480, 480);
            image.dispose();
      });
      trainingSets[1]+=2;
      };
    }

    document.querySelector(".info").innerText = ``;
};

function prevImage() {
  if (mustRateTwice >= 2) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(prevImageLoc, 0, 0, 480, 480);
    prevButton.removeEventListener("click", () => prevImage());
    revertLearning();
    mustRateTwice = 0;
  }
}

function revertLearning() {
  //Cleanup
  const image = tf.browser.fromPixels(canvas);
  const feature = net.infer(image, "conv_preds");
  if (prevChoice == 0) {
    classifier.addExample(feature, "bad");
    trainingSets[prevChoice]--;
  } else if (prevChoice == 1) {
    classifier.addExample(feature, "good");
    trainingSets[prevChoice]--;
  } else {
    classifier.addExample(feature, "good");
    trainingSets[1]-=2;
  }
}

function changeImage() {
    const preloadImage = newImage();
      preloadImage.onload = () => {
        context.drawImage(preloadImage, 0, 0, 480, 480);
    };
}

function newImage() {
    var randomImageNumber = Math.floor(Math.random() * 10000);
    const img = new Image();
    img.src = './img/' + getCorrectString(randomImageNumber) + '.jpg';
    console.log(img);
    img.crossOrigin = "anonymous";
    return img;
}

function getCorrectString(randomNumber) {
    if (randomNumber < 10) {
        return '00000' + randomNumber.toString();
    } else if (randomNumber < 100) {
        return '0000' + randomNumber.toString();
    } else if (randomNumber < 1000) {
        return '000' + randomNumber.toString();
    } else if (randomNumber < 10000) {
        return '00' + randomNumber.toString();
    }else if (randomNumber < 100000) {
        return '0' + randomNumber.toString();
    } else {
        return randomNumber.toString();
    }
}


function clearCanvas() {
  var imageUrl = canvas.toDataURL("image/png");
  prevImageLoc = new Image();
  prevImageLoc.src = imageUrl;
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function changeCursor() {
  if (mustRateTwice < 2) {
    prevButton.style.cursor = 'not-allowed';
  } else {
    prevButton.style.cursor = 'pointer';
  }
}

const predict = async () => {
  if (classifier.getNumClasses() > 0) {
    const image = tf.browser.fromPixels(canvas);
    const feature = net.infer(image, "conv_preds");

    const result = await classifier.predictClass(feature);

    document.querySelector(".info").innerText = `picture predicted to be ${result.label}`;
  }
};

loadClassifier();
