import SeakEvent from "./event.js";

const storage = window.sessionStorage;
// Databaseobjekt. Denne lagres
const tables = {
  events: [],
};

if (!storage.getItem("seak-db")) {
  storage.setItem("seak-db", JSON.stringify(tables));
}

let database = JSON.parse(storage.getItem("seak-db")); //initaliser databaseobjekt

function saveDatabase() {
  storage.setItem("seak-db", JSON.stringify(database));
  database = JSON.parse(storage.getItem("seak-db"));
}

export function insert(seakEvent, replaceIfExists) {
  let dbTable = database.events;
  // Hvis replaceIfExists er usann så dytter vi bare objektet til database selv om det finnes duplikat.
  if (!replaceIfExists) {
    dbTable.push(seakEvent);
    saveDatabase();
    return; // stopp funksjon her
  }
  update(seakEvent);
  saveDatabase();
}

export function select({
  name = "*",
  startDate = "*",
  startTime = "*",
  favorited = "*",
}) {
  const result = [];
  const namedFilteredEvents =
    name === "*" ? database.events : find("name", name);

  for (let i = 0; i < namedFilteredEvents.length; i++) {
    const event = namedFilteredEvents[i];
    if (startDate !== "*" && event.startDate !== startDate) {
      namedFilteredEvents.slice(i, 1);
      i--;
      continue;
    } else if (startTime !== "*" && event.startTime !== startTime) {
      namedFilteredEvents.slice(i, 1);
      i--;
      continue;
    } else if (favorited !== "*" && event.favorited !== favorited) {
      namedFilteredEvents.slice(i, 1);
      i--;
      continue;
    }

    result.push(event);
  }
  return result;
}

export function update(seakEvent) {
  let _event = find({ seakObject: seakEvent });
  if (_event.length === 1) {
    // hvis _event ikke er undefined så erstatter vi eventobjektet
    _event = seakEvent;
    saveDatabase();
    return;
  } else if (_event.length > 1) {
    throw `Multiple events of ${seakEvent.name} exists. Use objects instead`;
  }
  // Kaste en error dersom ingen event fantes og replaceIfExist er sann.
  throw `${seakEvent.name} does not exist.`;
}

function find(property, value, seakObject = null) {
  if (seakObject) {
    return database.filter((_event) => seakObject === _event);
  }
  return database.events.filter((_event) => _event[property] === value);
}
