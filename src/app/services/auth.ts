import { Injectable, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  user,
  UserCredential
} from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private injector = inject(EnvironmentInjector);

  currentUser$ = user(this.auth);

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async register(email: string, password: string, name: string): Promise<UserCredential> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    return credential;
  }

  logout(): Promise<void> {
    return runInInjectionContext(this.injector, () => signOut(this.auth));
  }
}
