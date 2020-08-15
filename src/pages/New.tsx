import * as React from "react";
import { Redirect } from "react-router-dom";
import { create as createGroceryList } from "../GroceryList";
import useDatabase from "../hooks/useDatabase";
import {
  AsyncResult,
  isInProgress,
  inProgress,
  isSuccess,
  success,
  isFailure,
} from "../AsyncResult";
import Page from "../components/Page";
import Text from "../components/Text";

const NewPage = () => {
  const [path, setPath] = React.useState<AsyncResult<string>>(inProgress);
  const asyncResultDb = useDatabase();

  React.useEffect(() => {
    if (!isSuccess(asyncResultDb)) return;

    const db = asyncResultDb.value;

    db.collection("groceryLists")
      .add(createGroceryList(new Date()))
      .then((doc) => setPath(success(`/${doc.id}`)));
  }, [asyncResultDb]);

  if (isInProgress(path))
    return (
      <Page>
        <Text>Loading...</Text>
      </Page>
    );

  if (isFailure(path))
    return (
      <Page>
        <Text>Uh oh, something went wrong!</Text>
      </Page>
    );

  return <Redirect to={path.value} />;
};

export default NewPage;
