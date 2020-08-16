import { useMemo } from "react";
import { AsyncResult, map } from "../AsyncResult";
import useItemsRef, { CollectionRef } from "./useItemsRef";

export type DocumentRef = firebase.firestore.DocumentReference;

const doc = (path: string) => (colRef: CollectionRef) => colRef.doc(path);

const useItemRef = (listId: string) => (
  id: string,
): AsyncResult<DocumentRef> => {
  const collectionRef = useItemsRef(listId);
  return useMemo(() => map(doc(id))(collectionRef), [id, collectionRef]);
};

export default useItemRef;
