// Dark Mode Toggle
const toggleButton = document.getElementById("toggleButton");
const body = document.body;
toggleButton.addEventListener("click", function () {
  body.classList.toggle("dark");

  const icon = toggleButton.querySelector("i");
  if (body.classList.contains("dark")) {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
    Swal.fire({
      icon: "success",
      title: "Dark Mode Activated",
      timer: 1500,
      showConfirmButton: false,
    });
  } else {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
    Swal.fire({
      icon: "success",
      title: "Light Mode Activated",
      timer: 1500,
      showConfirmButton: false,
    });
  }
});

// Image Upload and Preview
document
  .getElementById("imageInput")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const uploadedImage = document.getElementById("uploadedImage");
        uploadedImage.src = e.target.result;
        uploadedImage.classList.remove("hidden");
      };
      reader.readAsDataURL(file);

      Swal.fire({
        icon: "success",
        title: "Image Uploaded Successfully",
        text: "Now click on Extract Text to convert.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });

// Form Submission for Image to Text Conversion with Progress
document
  .getElementById("imageForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const imageInput = document.getElementById("imageInput");

    if (imageInput.files.length === 0) {
      Swal.fire({
        icon: "error",
        title: "No Image Selected",
        text: "Please upload an image first.",
      });
      return;
    }

    const file = imageInput.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("apikey", "K81823266188957"); // API Key
    formData.append("language", "eng");
    formData.append("isOverlayRequired", false);

    // Show Progress Container
    const progressContainer = document.getElementById("progressContainer");
    const progressBar = document.querySelector(".progress");
    const progressPercent = document.getElementById("progressPercent");
    progressContainer.classList.remove("hidden");

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      progressBar.style.width = `${progress}%`;
      progressPercent.textContent = `${progress}%`;
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 200);

    fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.IsErroredOnProcessing) {
          Swal.fire({
            icon: "error",
            title: "Error Processing Image",
            text: result.ErrorMessage[0],
          });
          return;
        }

        const extractedText = result.ParsedResults[0].ParsedText;
        document.getElementById("outputText").textContent = extractedText;

        Swal.fire({
          icon: "success",
          title: "Text Extracted Successfully",
          text: "Your image text has been converted!",
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong! Please try again later.",
        });
      })
      .finally(() => {
        clearInterval(interval);
        progressBar.style.width = "100%";
        progressPercent.textContent = "100%";
      });
  });

// Particles JS Background
particlesJS.load("particles-js", "particles.json", function () {
  console.log("Particles JS loaded.");
});
