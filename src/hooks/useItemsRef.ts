import { useMemo } from "react";
import { AsyncResult, map } from "../AsyncResult";
import useGroceryListRef, { DocumentRef } from "./useGroceryListRef";

export type CollectionRef = firebase.firestore.CollectionReference;

const collection = (path: string) => (db: DocumentRef) => db.collection(path);

const useItemsRef = (id: string): AsyncResult<CollectionRef> => {
  const docRef = useGroceryListRef(id);
  return useMemo(() => map(collection("items"))(docRef), [docRef]);
};

export default useItemsRef;
