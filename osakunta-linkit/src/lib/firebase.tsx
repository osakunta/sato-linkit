import { getAuth } from "firebase/auth";
import {
  collection,
  FirestoreDataConverter,
  getFirestore,
} from "firebase/firestore";
import {
  AuthProvider,
  FirebaseAppProvider,
  FirestoreProvider,
  useFirebaseApp,
  useFirestore,
} from "reactfire";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export interface Link {
  id: string;
  name: string;
  url: string;
  order: number;
}

const linkConverter: FirestoreDataConverter<Link> = {
  fromFirestore: (snapshot, options) => {
    const doc = snapshot.data(options);
    return {
      id: snapshot.id,
      name: doc.name,
      url: doc.url,
      order: doc.order,
    };
  },

  toFirestore: (link) => ({
    ...link,
  }),
};

export const useLinksCollection = () => {
  return collection(useFirestore(), "links").withConverter(linkConverter);
};

// A provider configured for this project
export const withFirebase = (Component: React.ComponentType) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const WrappedComponent = (props: any) => {
    return (
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        <WithAuth>
          <WithFirestore>
            <Component {...props} />
          </WithFirestore>
        </WithAuth>
      </FirebaseAppProvider>
    );
  };

  WrappedComponent.displayName = `withFirebase(${Component.displayName})`;
  return WrappedComponent;
};

const WithFirestore = ({ children }: { children: React.ReactNode }) => {
  return (
    <FirestoreProvider sdk={getFirestore(useFirebaseApp())}>
      {children}
    </FirestoreProvider>
  );
};

const WithAuth = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider sdk={getAuth(useFirebaseApp())}>{children}</AuthProvider>
  );
};
