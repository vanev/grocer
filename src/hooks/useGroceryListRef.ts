import { useMemo } from "react";
import { AsyncResult, map } from "../AsyncResult";
import useGroceryListsRef, { CollectionRef } from "./useGroceryListsRef";

export type DocumentRef = firebase.firestore.DocumentReference;

const doc = (path: string) => (colRef: CollectionRef) => colRef.doc(path);

const useGroceryListRef = (id: string): AsyncResult<DocumentRef> => {
  const collectionRef = useGroceryListsRef();
  return useMemo(() => map(doc(id))(collectionRef), [id, collectionRef]);
};

export default useGroceryListRef;
