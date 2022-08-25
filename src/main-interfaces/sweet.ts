export interface IMyEnv extends NodeJS.ProcessEnv {
  REACT_APP_FIREBASE_API_KEY: string;
  REACT_APP_FIREBASE_AUTHDOMAIN: string;
  REACT_APP_FIREBASE_PROJECT_ID: string;
  REACT_APP_FIREBASE_STORAGE_BUCKET: string;
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID: string;
  REACT_APP_FIREBASE_APP_ID: string;
  REACT_APP_FIREBASE_MEASUREMENT_ID: string;
}
