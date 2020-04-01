import * as firebase from "nativescript-plugin-firebase";

// can probably be abstracted even more (since the name of the collection is all that is different from routes / news / whatever colelction)
export class ArticlesService {
  collection;
  documents: Array<any>;

  constructor() {
    this.collection = firebase.firestore.collection('articles')
  }

  async getArticles(force: boolean = false) {
    if (this.documents && this.documents.length > 0 && !force) {
      console.log('ArticlesService - from "cache"')
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
      firebase.crashlytics.log(e)

      console.error(e);
    }
    return this.documents = documents
  }
};
