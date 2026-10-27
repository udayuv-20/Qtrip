import config from "../conf/index.js";

function getAdventureIdFromURL(search) {
  const params = new URLSearchParams(search);
  return params.get("adventure");
}

async function fetchAdventureDetails(adventureId) {
  try {
    const res = await fetch(`${config.backendEndpoint}/adventures/detail?adventure=${adventureId}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

function addAdventureDetailsToDOM(adventure) {
  document.getElementById("adventure-name").innerHTML = adventure.name;
  document.getElementById("adventure-subtitle").innerHTML = adventure.subtitle;

  const photoGallery = document.getElementById("photo-gallery");
  photoGallery.innerHTML = "";

  adventure.images.forEach((img) => {
    const div = document.createElement("div");
    div.innerHTML = `<img src="${img}" class="activity-card-image"/>`;
    photoGallery.appendChild(div);
  });

  document.getElementById("adventure-content").innerHTML = adventure.content;
}

function addBootstrapPhotoGallery(images) {
  let photoGallery = document.getElementById("photo-gallery");
  photoGallery.innerHTML = `
    <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
      <div class="carousel-inner">
        ${images
          .map(
            (img, i) => `
              <div class="carousel-item ${i === 0 ? "active" : ""}">
                <img class="d-block w-100 activity-card-image" src="${img}" />
              </div>
            `
          )
          .join("")}
      </div>
      <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      </a>
      <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
      </a>
    </div>
  `;
}

function conditionalRenderingOfReservationPanel(adventure) {
  if (adventure.available) {
    document.getElementById("reservation-panel-sold-out").style.display = "none";
    document.getElementById("reservation-panel-available").style.display = "block";
    document.getElementById("reservation-person-cost").innerHTML = adventure.costPerHead;
  } else {
    document.getElementById("reservation-panel-sold-out").style.display = "block";
    document.getElementById("reservation-panel-available").style.display = "none";
  }
}

function calculateReservationCostAndUpdateDOM(adventure, persons) {
  const totalCost = adventure.costPerHead * persons;
  document.getElementById("reservation-cost").innerHTML = totalCost;
}

function showBannerIfAlreadyReserved(adventure) {
  if (adventure.reserved) {
    document.getElementById("reserved-banner").style.display = "block";
  } else {
    document.getElementById("reserved-banner").style.display = "none";
  }
}

function captureFormSubmit(adventure) {
  const form = document.getElementById("myForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      name: form.elements["name"].value,
      date: form.elements["date"].value,
      person: form.elements["person"].value,
      adventure: adventure.id,
    };

    try {
      const res = await fetch(`${config.backendEndpoint}/reservations/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Success!");
        window.location.reload();
      } else {
        alert("Failed!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed!");
    }
  });
}

export {
  getAdventureIdFromURL,
  fetchAdventureDetails,
  addAdventureDetailsToDOM,
  addBootstrapPhotoGallery,
  conditionalRenderingOfReservationPanel,
  calculateReservationCostAndUpdateDOM,
  showBannerIfAlreadyReserved,
  captureFormSubmit,
};
