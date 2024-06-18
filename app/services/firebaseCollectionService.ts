import { firebase } from "@nativescript/firebase-core";
import '@nativescript/firebase-firestore';
import '@nativescript/firebase-crashlytics'; 
const firestore = firebase().firestore();

export class FirebaseCollectionService {
  collection;
  name: String;
  documents: Array<any>;

  constructor(name) {
    console.log('initialized FirebaseCollectionService for', name)
    this.name = name
    this.collection = firestore.collection(name)
  }

  public async getDocument(id: String) {
    console.log('loading document', id)
    const doc = await this.collection.doc(id)
    if (doc.exists) {
      return doc.data()
    }
    else {
      console.log("could not find id in firebase", id)
      return { err: 'No such document', id }
    }
  }

  public async getDocuments(force: boolean = false) {
    console.log('loading documents', this.name)
    if (this.documents && this.documents.length > 0 && !force) {
      console.log('... returning earlier retrieved: ', this.documents.length)
      return this.documents
    }

    const documents = []
    try {
      const snapShot = await this.collection.get()
      snapShot.forEach((document) => {
        const doc = document.data()
        doc.id = document.id
        documents.push(doc)
      })
    }
    catch (e) {
      firebase().crashlytics().log(e)
      console.error(e);
    }
    console.log('... retrieved: ', this.documents.length)
    return this.documents = documents
  }
};
