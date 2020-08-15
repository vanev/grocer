import { useMemo } from "react";
import { AsyncResult, map } from "../AsyncResult";
import useDatabase, { Database } from "./useDatabase";

export type CollectionRef = firebase.firestore.CollectionReference;

const collection = (path: string) => (db: Database) => db.collection(path);

const useGroceryListsRef = (): AsyncResult<CollectionRef> => {
  const db = useDatabase();
  return useMemo(() => map(collection("groceryLists"))(db), [db]);
};

export default useGroceryListsRef;
