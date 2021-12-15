import { getDateFromToday, compareDate} from "./utils.js";

// Lage storage objekt https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
const STORAGE = window.sessionStorage;
// Databasetables. Her kan vi legge til flere databasetables om nødvendig i senere utvikling
const TABLES = {
  events: [],
};
// Hvis ikke seak-db finnes i sessionStorage hos klient, lager vi det ut ifra TABLES
if (!STORAGE.getItem("seak-db")) {
  STORAGE.setItem("seak-db", JSON.stringify(TABLES));
}
// Databaseobjekt som vi skriver og leser ut ifra.
let database = JSON.parse(STORAGE.getItem("seak-db"));


  /**
   * Lagrer databasen til sessionStorae og oppdaterer databaseobjekt.
   * 
  **/
function saveDatabase() {
// Lagre JSONifisert databaseobjekt i seak-db 
  STORAGE.setItem("seak-db", JSON.stringify(database));
//Lese ut dataten og oppdatere databaseobjekt
  database = JSON.parse(STORAGE.getItem("seak-db"));
}

  /**
    * Setter events inn i database
    *
    * @param {object}  seakEvent         Eventobjektet som skal settes inn i databasen.
    * @param {boolean} skifIfexist       Om eventet skal skippes om den allerede eksisterer. Hvis ikke, oppdateres det eksisterende objektet
    *   
  **/
export function insert(seakEvent, skipIfExist) {
  let dbTable = database.events;
  // lete etter eksisterende objekt
  // om eventIndex = -1, finnes den ikke
  let eventIndex = findObjectIndex(seakEvent); 
  // Hvis eventet ikke finnes, dyttes den inn i databasen og lagres
  if (eventIndex === -1) {
    dbTable.push(seakEvent);
    saveDatabase();
    return; // stopp funksjon her

  } else if (!skipIfExist) { // Oppdater opbjekt om skipIfExist er sann
    update(seakEvent);
  }
}

/**
    * Setter events inn i database
    *
    * @param {object}                 Filterobjekt. Kan filtrere utifra event ID, start dato, start tid og om den er favorisert eller ikke        
    *                                 Standardverdi for alle filtere er * (betyr at den velger alle events)
    * @returns {array}                Returnerer array av events den finner, eller en tom en.
  **/
export function select({
  id = "*",
  startDate = "*",
  startTime = "*",
  favorited = "*",
}) {
  const result = [];

  // Henter ut events. Om id = *, henter den ut alle events. Om ID er spesifisert, prøver den å finne event utifra id 
  // gjennom findByProperty.
  const namedFilteredEvents =
    id !== "*" ? findByProperty("id", id) : database.events;

  for (let i = 0; i < namedFilteredEvents.length; i++) {
    const event = namedFilteredEvents[i];

    // Hvis startDato ikke er default, sjekker vi om datoen til event er før, etter eller det samme som startDate filteret
    // Om den oppfyller kravet til filter vil den bli lagt inn i result, ellers så skippes den.
    // Vi bruker toDateString() for å ignorere tid, vi sammenligner bare dato.
    if (startDate !== "*") {
      // Event sin dato
      const currentEventDate = new Date(event.startDate)
      // Hvis starDate skal filtreres utifra om datoen er før eller etter gitt dato
      if (startDate.includes(">") || startDate.includes("<")) {
        // Hvis eventene skal filtreres før gitt dato
        if (startDate.includes("<")) {
          const eventDateFilter = new Date(
            startDate.substring(startDate.indexOf("<") + 2)
          );
          // Hvis event sin dato er etter datoen spesifisert, skipper vi siden vi vil bare ha events som har vært før denne.
          if (compareDate(currentEventDate, eventDateFilter) !== 1) {
            continue;
          }
          // Hvis event dato skal være etter startDate filter dato
        } else if (startDate.includes(">")) {
          const eventDateFilter = new Date(
            startDate.substring(startDate.indexOf(">") + 2)
          );
          // Hvis eventdato er før filterdato så skipper vi
          if (compareDate(currentEventDate, eventDateFilter) !== -1) {
            continue;
          }
        }
        // Hvis startDate ikke har < eller >, betyr det at vi vil ha datoen idag.
        // Her bruker vi hjelpefunksjon getDateFromToday(0) som henter datoen idag, og så sammenligner vi
      } else if (compareDate(currentEventDate, getDateFromToday(0)) !== 0) {
        continue;
      }
    }
    // Under tester vi på om favorited/startTime ikke er *, og om den ikke er det tester vi på likhet.
    if (startTime !== "*" && event.startTime !== startTime) {
      continue;
    }
    if (favorited !== "*" && event.favorited !== favorited) {
      continue;
    }
    result.push(event); // legg til event i result om event fyllte alle krav
  }
  return result;
}

/**
 * Oppdaterer objekt om eventet eksisterer
 * 
 * @param {object} seakEvent    Eventobjekt som skal oppdateres
 */
export function update(seakEvent) {
  let eventIndex = findObjectIndex(seakEvent);
 
  if (eventIndex !== -1) {
    // hvis eventIndex ikke er -1 ikke erstatter vi event objektet i databasen
    database.events[eventIndex] = seakEvent;
    saveDatabase();
    return;
  }
  // Kaste en error dersom ingen event fantes
  throw `${seakEvent.name} does not exist.`;
}

/**
 * Finner indeks til et eventobjekt i databasen
 * Returnerer indeks om den fant, -1 om den ikke finner
 * 
 * @param {object} seakObject     Eventobjektet som skal oppdateres
 * @returns {number}              event index/-1
 */
function findObjectIndex(seakObject) {
  let counter = 0;
  for (let _event of database.events) {
    if (_event.id === seakObject.id) {
      //returner index
      return counter;
    }
    counter++;
  }
  return -1;
}

/**
 * Finner events filtrert ut av eventobjektattributter og deres verdier
 * 
 * @param {string} property     Attributtet som vi skal søke etter
 * @param {string} value        Verdien av attributtet
 * @returns {array}
 */
function findByProperty(property, value) {
  // Bruker Arrays.prototype.filer() for å lete etter events
  // Returnerer tom array om den ikke finner noe
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
  return database.events.filter((_event) => _event[property] === value);
}

// Forhåndslage events for demo
// Vi setter egen ID på ferdiglagde eventer slik at de alltid er like
insert(
  {
    name: "BBQ",
    description: "Long description about BBQ",
    shortDescription: "Enjoy delicious food and good company",
    accessType: "public",
    startDate: getDateFromToday(0),
    startTime: "10:30 AM",
    location: "Kristiansand",
    imageUrl: "assets/bbq.jpg",
    favorited: false,
    id: 1,
  },
  true
);
insert(
  {
    name: "Coding",
    description: "Long description about coding",
    shortDescription: "Learn to code from scratch!",
    accessType: "public",
    startDate: getDateFromToday(2),
    startTime: "12:30 AM",
    location: "Kristiansand",
    imageUrl: "assets/coding.png",
    favorited: false,
    id: 2,
  },
  true
);
insert(
  {
    name: "Game night",
    description: "Long description about game night",
    shortDescription: "Enjoy a fun game night!",
    accessType: "public",
    startDate: getDateFromToday(3),
    startTime: "19:00 AM",
    location: "Kristiansand",
    imageUrl: "assets/game night.jpg",
    favorited: false,
    id: 8,
  },
  true
);
insert(
  {
    name: "Picnic",
    description: "Long description about picnics",
    shortDescription: "Come join us on a cozy picnic!",
    accessType: "public",
    startDate: getDateFromToday(6),
    startTime: "10:30 AM",
    location: "Kristiansand, Botanical garden",
    imageUrl: "assets/picnic.jpg",
    favorited: false,
    id: 3,
  },
  true
);
insert(
  {
    name: "Quiz",
    description: "Long description about quiz",
    shortDescription: "Test your knowlegde in a quiz!",
    accessType: "public",
    startDate: getDateFromToday(10),
    startTime: "10:30 AM",
    location: "Kristiansand",
    imageUrl: "assets/quiz.jpg",
    favorited: false,
    id: 4,
  },
  true
);

insert(
  {
    name: "Hiking",
    description: "Long description about hiking",
    shortDescription: "Join hiking in Kristiansand!",
    accessType: "public",
    startDate: getDateFromToday(2),
    startTime: "11:30 AM",
    location: "Kristiansand",
    imageUrl: "assets/hiking.jpg",
    favorited: true,
    id: 6,
  },
  true
);
insert(
  {
    name: "Bowling",
    description: "Long description about bowling",
    shortDescription: "Bowling evening!",
    accessType: "public",
    startDate: getDateFromToday(5),
    startTime: "18:30 AM",
    location: "Kristiansand",
    imageUrl: "assets/bowling.jpg",
    favorited: true,
    id: 5,
  },
  true
);
insert(
  {
    name: "Volley",
    description: "Long description about volley",
    shortDescription: "Join on on a entry level volley match!",
    accessType: "public",
    startDate: getDateFromToday(7),
    startTime: "10:30 AM",
    location: "Kristiansand",
    imageUrl: "assets/volley.jpg",
    favorited: true,
    id: 7,
  },
  true
);

insert(
  {
    name: "Music bingo",
    description: "Long description about music bingo",
    shortDescription: "Music bingo at the bar!",
    accessType: "public",
    startDate: getDateFromToday(-7),
    startTime: "21:00 AM",
    location: "Kristiansand",
    imageUrl: "assets/music bingo.jpg",
    favorited: true,
    id: 11,
  },
  true
);

insert(
  {
    name: "Håndball",
    description: "Tryout for the KSU håndball team",
    shortDescription: "Tryout for the KSU håndball team",
    accessType: "public",
    startDate: getDateFromToday(0),
    startTime: "08:00 AM",
    location: "Aquarama",
    imageUrl: "assets/handfotball.jpg",
    favorited: true,
    id: 12,
  },
  true
);
