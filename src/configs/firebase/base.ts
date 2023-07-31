import { FIREBASE_CONFIG } from '@/constants';
import {initializeApp} from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseApp = initializeApp(FIREBASE_CONFIG);

export const authentication = getAuth(firebaseApp)
