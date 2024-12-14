import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { signInWithEmailAndPassword, getAuth, createUserWithEmailAndPassword, updateProfile, signOut} from 'firebase/auth';
import { UtilsService } from './utils.service';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { UserI } from '../interfaces/user.module';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authFire = inject(AngularFireAuth);
  

  auth = inject(AngularFireAuth);
  utilsService = inject(UtilsService);

  ingresar(user: UserI){
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  registrar(user: UserI){
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  actualizar(displayName: string){
    return updateProfile(getAuth().currentUser, {displayName})
  }

  cerrarSesion(){
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsService.routerLink('/login');
  }

  async getDocument(path: string){
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  setDocument(path: string, data: any){
    return setDoc(doc(getFirestore(), path), data);
  }

  get currentUser(): Observable<any> {
    return this.authFire.authState;
  }
} 
