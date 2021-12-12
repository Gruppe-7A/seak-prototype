import { update } from "./database.js";
export function getRandomImage() {
  // En dårlig løsning for å hente ut bilder. Dette er bare for demoprosjekt.
  // I virkeligheten ville vi hatt bildeopplastning. <input type="file"> ville nok vært det vi hadde brukt
  const images = [
    "assets/bbq.jpg",
    "assets/bowling.jpg",
    "assets/coding.png",
    "assets/debate.jpg",
    "assets/event1.png",
    "assets/event2.jpg",
    "assets/event3.jpg",
    "assets/event4.jpg",
    "assets/picnic.jpg",
    "assets/quiz.jpg",
    "assets/volley.jpg",
  ];
  return images[Math.floor(Math.random() * images.length - 1)];
}

// Generer en random id mellom 1 og 1 million
export function generateId() {
  return Math.floor(Math.random() * 1_000_000);
}

export function generateEventHtml(events, isFavorited) {
  return ` ${events
    .map(
      (event) => `<div class="row-wrapper event-card">
             <img src="${event.imageUrl}" alt="Event picture">
         <div class="wrapper event-text">
             <h4>${event.name}</h4>
             <p>${event.shortDescription}</p>
        </div>
     <div class="row-wrapper event-icons">
         <span class="material-icons"  id=${event.id} style=${event.favorited ? "color:#347CFF;" :"color:#000000;" }>favorite</span>
         <span class="material-icons">info </span>
     </div>
 </div>`
    )
    .join("")}`;
}

export function toFormattedDate(date) {
  return (
    date.getUTCMonth() +
    1 + // +1 fordi getUTCMonth returnerer måned 0 - 11
    "/" +
    date.getUTCDate() +
    "/" +
    date.getUTCFullYear()
  );
}
export function getDateFromToday(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

export function setEventOnClick(events) {
  for (let event of events) {
    const node = document.getElementById(event.id);
    node.onclick = (clickEvent) => {
      if (!event.favorited && !node.favorited || !event.favorited && node.favorited === false) {
        node.favorited = true;
        node.style.color = "#347CFF";
        event.favorited = true;
        update(event); //oppdater database med nytt objekt
      } else {
        node.style.color = "#000000";
        node.favorited = false;
        event.favorited = false;
        update(event); //oppdater database med nytt objekt
      }
    };
  }
}
