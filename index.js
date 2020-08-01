import { Elm } from "./src/Main.elm";

const STORAGE_KEY = "grocer_data";

const storedData = window.localStorage.getItem(STORAGE_KEY);

const flags = storedData ? JSON.parse(storedData) : null;

const app = Elm.Main.init({
  node: document.querySelector("main"),
  flags: flags,
});

app.ports.storeData.subscribe((data) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
});
