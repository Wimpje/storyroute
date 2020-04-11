import { ArticlesService } from "~/services/articlesService"
import * as myUtils from "~/plugins/utils";


export const state = () => {
  return {
    articles: [],
    currentArticle: null,
    lastUpdate: new Date(1945, 3, 11),
    categories: ['news', 'event', 'story']
  }
}
export const getters = {
  getArticleCategories(state) {
    return state.categories
  },
  currentArticle(state) {
    return state.currentArticle
  },
  getArticles(state) {
    return state.articles
  },
  getNews(state) {
    return state.articles.filter(a => a.category === 'news')
  },
  getCredits(state) {
    const ret = state.articles.filter(a => a.category === 'credits')
    if (ret && ret.length > 0) {
      return ret[0]
    }
    return ''
  },
  getHelp(state) {
    const ret = state.articles.filter(a => a.category === 'help')
    if (ret && ret.length > 0) {
      return ret[0]
    }
    return ''
  },
  getContact(state) {
    const ret = state.articles.filter(a => a.category === 'contact')
    if (ret && ret.length > 0) {
      return ret[0]
    }
    return ''
  },
  getEvents(state) {
    return state.articles.filter(a => a.category === 'event')
  },
  getStories(state) {
    return state.articles.filter(a => a.category === 'story')
  },
  articlesLastUpdate(state) {
    return state.lastUpdate
  }
}

export const actions = {
  async getArticles({ commit }) {
    const service = new ArticlesService()
    const docs = await service.getArticles()
    commit("setArticles", docs)
  },
  async updateArticles({ commit }) {
    commit("setArticles", [])
    const service = new ArticlesService()
    const docs = await service.getArticles(true)
    commit("setArticles", docs)
  }
}

export const mutations = {
  setCurrentArticle(state, article) {
    state.currentArticle = article
  },
  setArticles(state, articles) {
    state.articles = articles
    state.articles.forEach(doc => {
      if(!doc.updatedDate) return 0
      if(doc.updatedDate > state.lastUpdate) {
        state.lastUpdate = doc.updatedDate
      }
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
