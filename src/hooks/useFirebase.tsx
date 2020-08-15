import firebase from "firebase/app";
import * as React from "react";
import { AsyncResult, inProgress, success } from "../AsyncResult";

type FirebaseApp = AsyncResult<firebase.app.App>;

export const Context = React.createContext<FirebaseApp>(inProgress);
Context.displayName = "FirebaseContext";

interface Props {
  config: Object;
  children: React.ReactNode;
}

export const Provider = ({ config, children }: Props) => {
  const [app, setApp] = React.useState<FirebaseApp>(inProgress);

  React.useEffect(() => {
    setApp(success(firebase.initializeApp(config)));
  }, [config]);

  return <Context.Provider value={app}>{children}</Context.Provider>;
};
Provider.displayName = "FirebaseProvider";

const useFirebase = () => React.useContext(Context);

export default useFirebase;
