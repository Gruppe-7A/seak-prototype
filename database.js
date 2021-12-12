import { getDateFromToday, toFormattedDate } from "./utils.js";

const storage = window.sessionStorage;
// Databaseobjekt. Denne lagres
const tables = {
  events: [],
};

if (!storage.getItem("seak-db")) {
  storage.setItem("seak-db", JSON.stringify(tables));
}

let database = JSON.parse(storage.getItem("seak-db"));

function saveDatabase() {
  storage.setItem("seak-db", JSON.stringify(database));
  database = JSON.parse(storage.getItem("seak-db"));
  console.log(database);
}

export function insert(seakEvent, skipIfExist) {
  let dbTable = database.events;
  let eventIndex = findObjectIndex(seakEvent);
  // Hvis replaceIfExists er usann så dytter vi bare objektet til database selv om det finnes duplikat.
  if (eventIndex === -1) {
    dbTable.push(seakEvent);
    saveDatabase();
    return; // stopp funksjon her
  } else if (!skipIfExist) {
    update(seakEvent);
  }
}

export function select({
                         id = "*",
                         startDate = "*",
                         startTime = "*",
                         favorited = "*",
                       }) {
  const result = [];
  const namedFilteredEvents =
      id !== "*" ? findByProperty("id", id) : database.events;
  console.log(database.events);
  for (let i = 0; i < namedFilteredEvents.length; i++) {
    const event = namedFilteredEvents[i];
    console.log(event);

    if (startDate !== "*") {
      const currentEventDate = new Date(event.startDate);
      const currentEventDateFormatted = new Date(
          toFormattedDate(currentEventDate)
      );
      if (startDate.includes(">") || startDate.includes("<")) {
        if (startDate.includes("<")) {
          const eventDate = new Date(
              startDate.substring(startDate.indexOf("<") + 2)
          );
          if (currentEventDate > eventDate) {
            continue;
          }
        } else if (startDate.includes(">")) {
          const eventDate = new Date(
              startDate.substring(startDate.indexOf(">") + 2)
          );
          if (currentEventDate < eventDate) {
            continue;
          }
        }
      } else if (
          currentEventDateFormatted.toDateString() !==
          getDateFromToday(0).toDateString()
      ) {
        continue;
      }
    }
    if (startTime !== "*" && event.startTime !== startTime) {
      continue;
    }
    if (favorited !== "*" && event.favorited !== favorited) {
      continue;
    }
    result.push(event);
  }
  return result;
}

export function update(seakEvent) {
  let eventIndex = findObjectIndex(seakEvent);
  console.log(seakEvent);
  if (eventIndex !== -1) {
    // hvis _event ikke er undefined så erstatter vi eventobjektet
    database.events[eventIndex] = seakEvent;
    saveDatabase();
    return;
  }
  // Kaste en error dersom ingen event fantes og replaceIfExist er sann.
  throw `${seakEvent.name} does not exist.`;
}

function findObjectIndex(seakObject) {
  let counter = 0;
  for (let _event of database.events) {
    if (_event.id === seakObject.id) {
      return counter;
    }
    counter++;
  }
  return -1;
}
function findByProperty(property, value) {
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
      startDate: getDateFromToday(-2),
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
      startDate: getDateFromToday(10),
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
      name: "Picnic",
      description: "Long description about picnics",
      shortDescription: "Come join us on a cozy picnic!",
      accessType: "public",
      startDate: getDateFromToday(30),
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
      description: "Long description about volley",
      shortDescription: "Join on on a entry level volley match!",
      accessType: "public",
      startDate: getDateFromToday(-3),
      startTime: "10:30 AM",
      location: "Kristiansand",
      imageUrl: "assets/volley.jpg",
      favorited: false,
      id: 4,
    },
    true
);

insert(
    {
      name: "Volley",
      description: "Long description about volley",
      shortDescription: "Join on on a entry level volley match!",
      accessType: "public",
      startDate: getDateFromToday(-10),
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
      name: "Volley test 2",
      description: "Long description about volley",
      shortDescription: "Join on on a entry level volley match!",
      accessType: "public",
      startDate: getDateFromToday(0),
      startTime: "10:30 AM",
      location: "Kristiansand",
      imageUrl: "assets/volley.jpg",
      favorited: true,
      id: 9,
    },
    true
);
insert(
    {
      name: "Volley test 3",
      description: "Long description about volley",
      shortDescription: "Join on on a entry level volley match!",
      accessType: "public",
      startDate: getDateFromToday(1),
      startTime: "10:30 AM",
      location: "Kristiansand",
      imageUrl: "assets/volley.jpg",
      favorited: true,
      id: 10,
    },
    true
);