import "firebase/firestore";
import { AsyncResult, map } from "../AsyncResult";
import { useMemo } from "react";
import useFirebase from "./useFirebase";

export type Database = firebase.firestore.Firestore;

const database = (a: firebase.app.App) => {
  const db = a.firestore();

  if (global.location.hostname === "localhost") {
    db.settings({
      host: "localhost:8080",
      ssl: false,
    });
  }

  return db;
};

const useDatabase = (): AsyncResult<Database> => {
  const app = useFirebase();
  return useMemo(() => map(database)(app), [app]);
};

export default useDatabase;
