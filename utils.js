import { update } from "./database.js";

/**
 * Velger et tilfeldig bilde fra en array
 * @returns Filbane til bilde
 * 
 */
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
  // Genererer tilfeldig nummer mellom 0 og lengden på images array.
  return images[Math.floor(Math.random() * images.length - 1)];
}

// Generer en random id mellom 1 og 1 million
export function generateId() {
  return Math.floor(Math.random() * 1_000_000);
}

/**
 * Generer en HTML streng for alle events i gitt array
 * 
 * @param {array} events    Array av seakEvents som det skal genereres HTML av
 * @returns HTML string
 */
export function generateEventHtml(events) {
  // Bruker Arrays.map() for å bygge en HTML streng av array elementer
  return ` ${events
    .map(
      (event) => `<div class="row-wrapper event-card">
             <img src="${event.imageUrl}" alt="Event picture">
         <div class="wrapper event-text">
             <h4>${event.name}</h4>
             <p id="date"> ${toFormattedDate(new Date(event.startDate))} </p>
             <p>${event.shortDescription}</p>
        </div>
     <div class="row-wrapper event-icons">
         <span class="material-icons"  id=${event.id} style=${
        event.favorited ? "color:#347CFF;" : "color:#000000;"
      }>favorite</span>
         <span class="material-icons">info </span>
     </div>
 </div>`
    )

    .join("")}`; //.join fjerner kommaer siden Arrays.map() returnerer en array. Alle elementer i en array er separert med komma
}

/**
 * Konverterer Date objektet til en formartt streng i YYYY-mm-DD format
 * 
 * @param {date} date     Date objektet som skal 
 * @returns Formatert datostreng
 */
export function toFormattedDate(date) {
  return (
    // + 1 på getUTCMonth() siden den returnerer 0 - 11, ikke 1 - 12.
    date.getUTCFullYear() + "-" +  (date.getUTCMonth() + 1) + "-" + date.getUTCDate()
  );
}

/**
 * 
 * @param {date} date1    Dateobjekt som skal sammenlignes
 * @param {date} date2    Andre dateobjekt som skal sammenlignes
 * @returns 1 om den er mindre, 0 om den er lik, -1 om den er større
 */
export function compareDate(date1, date2) {
  date1.setHours(0,0,0,0)
  date2.setHours(0,0,0,0)
  if (date1 < date2) return 1

  if (date1.toDateString() === date2.toDateString()) return 0

  if (date1 > date2) return -1;

}
 
/**
 *  Returnerer en dato 
 * 
 * @param {integer} days  Hvor mange dager vi skal enten trekke fra eller legge til fra dagen idag
 *                        Positivt tall betyr datoer i fremtiden, negativt tall betyr fortiden og 0 betyr datoen idag.
 * @returns Datoobjekt
 */
export function getDateFromToday(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date
}

/**
 *  Setter onClick event på events på en side. Eventene gjør slik at du kan favorisere events slik at de blir flyttet til riktig side
 * @param {array} events    Array av events som skal skal få event
 */
export function setEventOnClick(events) {
  for (let event of events) {
    // Hente ut favoritt ikon som har samme ID som event ID
    const node = document.getElementById(event.id);
    node.onclick = (clickEvent) => {
      // Hvis node ikke har favorited attributt eller at den er falsk
      if (
        (!event.favorited && !node.favorited) ||
        (!event.favorited && node.favorited === false)
      ) {
        // Sett farge og attributter
        node.favorited = true;
        node.style.color = "#347CFF";
        event.favorited = true;
        update(event); //oppdater database med endringer
      } else {
        // Sett farge og attributter
        node.style.color = "#000000";
        node.favorited = false;
        event.favorited = false;
        update(event); //oppdater database med endringer
      }
    };
  }
}
