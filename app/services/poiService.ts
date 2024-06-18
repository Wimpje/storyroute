import { firebase } from "@nativescript/firebase-core";
import '@nativescript/firebase-firestore';
import '@nativescript/firebase-crashlytics'; 
const firestore = firebase().firestore();

// can probably be abstracted even more (since the name of the collection is all that is different from routes / news / whatever colelction)
export class PoiService {
  collection;
  documents: Array<any>;

  constructor() {
    this.collection = firestore.collection('pois')
  }

  async getPois(force: boolean = false) {
    if (this.documents && this.documents.length > 0 && !force)
      return this.documents

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
    return this.documents = documents
  }
};
