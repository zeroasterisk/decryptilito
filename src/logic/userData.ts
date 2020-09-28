/**
 * My Data is the user-specific data object
 * This is not a part of the game data
 * But instead it is composed of the logged in user
 *
 * Need to be able to turn a firebase.User into this
 *
 */
import {
  // Contains,
  // IsDate,
  Length,
  validateSync,
  ValidationError,
} from 'class-validator';

import firebase, { updateUserProfile } from '../firebase';

interface UserDataInput {
  // from firebase
  uid?: string;
  email?: string;
  emailVerified?: boolean;
  displayName?: string;
  phoneNumber?: string;
  photoURL?: string;
  isAnonymous?: boolean;
  // metadata.creationTime...
  // metadata.lastSignInTime...
  // orivuderData[0].providerId (google)
  errors?: ValidationError[];
}

class UserData {
  // game id (for saving)
  @Length(10, 20)
  public uid: string;
  public displayName: string;
  public photoURL?: string;
  public email?: string;
  public errors?: ValidationError[];

  constructor(data: UserDataInput | firebase.User) {
    this.uid = data.uid || this.makeId();
    this.displayName = data.displayName || 'Unnamed';
    this.photoURL = data.photoURL || undefined;
    this.email = data.email || undefined;
    this.errors = [];
  }

  public makeId() {
    return (
      'rnd' +
      Math.random().toString(16).slice(2) +
      Math.random().toString(16).slice(2)
    ).substring(0, 15);
  }

  public validate() {
    this.errors = validateSync(this, { validationError: { target: false } });
    if (this.errors.length > 0) {
      console.error(this.errors);
    }
    return this.errors.length === 0;
  }

  // this replicates a method on the firebase auth currentUser
  //   should only be used to update displayName
  public updateProfile(newData: object) {
    throw new Error('need to re-implement firebase.auth...updateProfile()');
  }
  public update() {
    return updateUserProfile(this);
  }
}

export { UserData };
