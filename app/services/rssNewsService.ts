const parseString = require('nativescript-xml2js').parseString;

const parseXml = (s) => new Promise<any>(function (resolve, reject) {
  parseString(s, function (err, result) {
    if (err) {
      reject(err);
    }
    else {
      resolve(result);
    }
  });
});

export class NewsModel {
  id: string
  title: string
  text: string
  url: string
  date: number
  constructor(id: any, title: any, text: any, url: any, date: any) {
    this.id = id
    this.title = title
    this.text = text
    this.url = url
    this.date = Date.parse(date)
  }
}

export class NewsService {
  collection: Array<NewsModel>;
  url: string;

  constructor() {
    this.collection = []
    this.url = "https://www.ommen75jaarvrijheid.nl/feed/atom/"
  }
  public async getNews(forceRefresh: boolean = false) {
    console.log("GETTING NEWS FROM " + this.url)
    if (this.collection.length > 0 && !forceRefresh)
      return this.collection

    const documents: Array<NewsModel> = []
    try {
      const data = await fetch(this.url, {
        method: "GET",
        headers: { "Content-Type": "application/xml" }
      });
      const newsObject = await parseXml(await data.text());

      newsObject.feed.entry.forEach((e) => {
        documents.push(new NewsModel(e.id[0], e.title[0]._, e.content[0]._, e.link[0].$.href, e.updated[0]))
      })
    }
    catch (e) {
      console.error(e);
    }
    this.collection = documents
    return documents
  }
};
