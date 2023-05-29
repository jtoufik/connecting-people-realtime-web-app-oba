import express, { response } from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import fetch from "node-fetch";
import { createServer, request } from 'http';
import { Server } from 'socket.io';

// Activeert het .env bestand
dotenv.config();

const app = express();
const http = createServer(app);
const io = new Server(http, {
  connectionStateRecovery: {
    // De tijdsduur voor recovery bij disconnect
    maxDisconnectionDuration: 2 * 60 * 1000,
    // Of middlewares geskipped moeten worden bij recovery (ivm login)
    skipMiddlewares: true,
  },
});

import * as path from 'path'
import {
	Server
} from 'socket.io'
import {
	createServer,
	request
} from 'http'
import fetch from "node-fetch";

// Maakt een nieuwe express app
const server = express();
const http = createServer(server)
const io = new Server(http)

// Stelt het poortnummer in waar express op gaat luisteren
const port = process.env.PORT || 3000

// Serveer client-side bestanden
server.use(express.static("public"));
server.set("views", "./views")


let connections = []

io.on("connect", (socket) => {
  connections.push(socket);
  console.log(`${socket.id} is verbonden`);

  socket.on("draw", (data) => {
    connections.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit("ondraw", { x: data.x, y: data.y });
      }
    });
  });

  socket.on("down", (data) => {
    connections.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit("ondown", { x: data.x, y: data.y });
      }
    });
  });

  socket.on("drawing", (data) => {
    socket.broadcast.emit("drawing", data);
  });

  socket.on("drawRectangle", (data) => {
    socket.broadcast.emit("drawRectangle", data);
  });

  socket.on("drawCircle", (data) => {
    socket.broadcast.emit("drawCircle", data);
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} is losgekoppeld`);
  });
});

const port = process.env.PORT || 9000;
http.listen(port, () => {
  console.log(`Server is gestart op http://localhost:${port}`);

// Handelt de formulieren af
server.use(bodyParser.urlencoded({
	extended: true
}));
server.use(bodyParser.json());

// Stel in hoe express gebruikt kan worden
server.set("view engine", "ejs");
server.set("views", "./views");

// Start express op, haal het ingestelde poortnummer op
server.listen(port, function () {
	// Toon een bericht in de console en geef het poortnummer door
	console.log(
		`Application started on http://localhost:` + port
	);
});

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Extenties voor de URL
const space = "%20";
const bookItems = "boeken";

// Endpoints voor de URL
const urlSearch = "search/";

// Opbouw URL van de API
const urlBase = "https://zoeken.oba.nl/api/v1/";
const urlQuery = "?q=";
const urlDefault = "special:all";
const urlKey = `${process.env.KEY}`;
const urlOutput = "&refine=true&output=json";

const defaultUrl =
	urlBase +
	urlSearch +
	urlQuery +
	urlDefault +
	space +
	bookItems +
	urlKey +
	urlOutput;

app.get("/", (request, response) => {
  fetchJson(defaultUrl)
    .then((data) => {
      response.render("index", data);
    })
    .catch((error) => {
      response.render("error", { error: "Fout bij het ophalen van gegevens" });
    });
});

app.get("/item", async (request, response) => {
  const urlId = request.query.id || "";
  const itemUrl = `${urlBase}search/?id=${urlId}${urlKey}${urlOutput}`;

  try {
    const data = await fetchJson(itemUrl);
    response.render("item", data);
  } catch (error) {
    response.render("error", { error: "Fout bij het ophalen van gegevens" });
  }
});

app.get("/reserveren", async (request, response) => {
  const urlId = request.query.id || "|oba-catalogus|279240";
  const itemUrl = `${urlBase}search/?id=${urlId}${urlKey}${urlOutput}`;
  const reservationsUrl = "https://api.oba.fdnd.nl/api/v1/reserveringen";

  try {
    const [itemData, reservationsData] = await Promise.all([
      fetchJson(itemUrl),
      fetchJson(reservationsUrl)
    ]);

    response.render("reserveren", { itemData, reservationsData });
  } catch (error) {
    response.render("error", { error: "Fout bij het ophalen van gegevens" });
  }
});

app.post("/reserveren", async (request, response) => {
  const url = "https://api.oba.fdnd.nl/api/v1/reserveringen";

  try {
    const data = await postJson(url, request.body);

    if (data.id) {
      response.redirect('/succes');
    } else {
      response.redirect('/succes');
    }
  } catch (error) {
    response.render("error", { error: "Fout bij het versturen van gegevens" });
  }
});

app.get("/reserveer-een-studieplek", (request, response) => {
  const url = "https://api.oba.fdnd.nl/api/v1/studieplekReserveringen";

  fetchJson(url)
    .then((data) => {
      response.render("reserveer-een-studieplek", data);
    })
    .catch((error) => {
      response.render("error", { error: "Fout bij het ophalen van gegevens" });
    });
});

app.post("/reserveer-een-studieplek", async (request, response) => {
  const url = "https://api.oba.fdnd.nl/api/v1/studieplekReserveringen";

  try {
    const data = await postJson(url, request.body);

    if (data.success) {
      response.redirect("/");
    } else {
      const errorMessage = `${data.message}: Mogelijk komt dit door het id dat al bestaat.`;
      response.render("error", { error: errorMessage });
    }
  } catch (error) {
    response.render("error", { error: "Fout bij het versturen van gegevens" });
  }
});

app.get("/activiteiten", (request, response) => {
  const url = `${urlBase}search/?q=special:all%20table:activiteiten&authorization=${process.env.authorization}${urlOutput}`;

  fetchJson(url)
    .then((data) => {
      response.render("activiteiten", data);
    })
    .catch((error) => {
      response.render("error", { error: "Fout bij het ophalen van gegevens" });
    });
});

app.get("/cursussen", (request, response) => {
  const url = `${urlBase}search/?q=special:all%20table:jsonsrc&authorization=${process.env.authorization}${urlOutput}`;

  fetchJson(url)
    .then((data) => {
      response.render("cursussen", data);
    })
    .catch((error) => {
      response.render("error", { error: "Fout bij het ophalen van gegevens" });
    });
});

app.get("/vestigingen", (request, response) => {
  const url = `${urlBase}vestigingen?clgnoumd6fttt0buw6rwa00pa`;

  fetchJson(url)
    .then((data) => {
      response.render("vestigingen", data);
    })
    .catch((error) => {
      response.render("error", { error: "Fout bij het ophalen van gegevens" });
    });
});

app.get("/draw", (request, response) => {
  fetchJson(defaultUrl)
    .then((data) => {
      response.render("draw", data);
    })
    .catch((error) => {
      response.render("error", { error: "Fout bij het ophalen van gegevens" });
    });
});

// Maakt een route naar de 404 pagina
app.get("*", (request, response) => {
  response.status(404).render("404");
})

async function fetchJson(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function postJson(url, data) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  const responseData = await response.json();
  return responseData;
}

/**
 * Demonstrates a longpolling process, io is passed along to prevent side-effects
 * @param {*} io a reference to socket.io used to send a message.
 */
 function longPollExample(io) {
	io.emit('whatever', 'somebody set up us the bomb!')
  }
