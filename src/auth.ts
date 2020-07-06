import * as firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/auth';
import './firebase';
import { useContext } from 'react';
import { userContext } from './user-context';

// import { UserData } from './logic/userData';

const provider = new firebase.auth.GoogleAuthProvider();

export const useSession = () => {
  const { user } = useContext(userContext);
  return user;
};

export const loginWithGoogle = async () => {
  console.log('loginWithGoogle');
  console.log(firebase.auth());
  try {
    const result = await firebase.auth().signInWithPopup(provider);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const github = new firebase.auth.GithubAuthProvider();

export const loginWithGithub = async () => {
  try {
    const result = await firebase.auth().signInWithPopup(github);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const results = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    return results;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const createUserWithEmail = async (email: string, password: string) => {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const signOut = () => firebase.auth().signOut();