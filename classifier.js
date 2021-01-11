let classifier;
let net;

let trainingSets = [0, 0];
changeImage();

const loadClassifier = async () => {
  classifier = knnClassifier.create();
  net = await mobilenet.load();

  document.querySelector(".loading").classList.add("hidden");
};

const addExample = label => {
  const image = tf.browser.fromPixels(canvas);
  const feature = net.infer(image, "conv_preds");

  classifier.addExample(feature, label);


    if (label == "bad") {
        canvas.classList.add('animate__animated', 'animate__fadeOutTopLeft');
        const preloadImage = newImage();
        preloadImage.onload = () => {
        canvas.addEventListener('animationend', () => {
          canvas.classList.remove('animate__animated', 'animate__fadeOutTopLeft');
              context.clearRect(0, 0, canvas.width, canvas.height);
              context.drawImage(preloadImage, 0, 0, 480, 480);
              image.dispose();
        });
        badButton.innerText = `Bad (${++trainingSets[0]})`;
        };
    } else {
         canvas.classList.add('animate__animated', 'animate__fadeOutTopRight');
        const preloadImage = newImage();
        preloadImage.onload = () => {
        canvas.addEventListener('animationend', () => {
          canvas.classList.remove('animate__animated', 'animate__fadeOutTopRight');
              context.clearRect(0, 0, canvas.width, canvas.height);
              context.drawImage(preloadImage, 0, 0, 480, 480);
              image.dispose();
        });
        goodButton.innerText = `Good (${++trainingSets[1]})`;
        };
    }

    document.querySelector(".info").innerText = ``;

};

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

const predict = async () => {
  if (classifier.getNumClasses() > 0) {
    const image = tf.browser.fromPixels(canvas);
    const feature = net.infer(image, "conv_preds");

    const result = await classifier.predictClass(feature);

    document.querySelector(".info").innerText = `picture predicted to be ${result.label}`;
  }
};

loadClassifier();
