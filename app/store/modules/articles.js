import { ArticlesService } from "~/services/articlesService"


export const state = () => {
  return {
    articles: [],
    currentArticle: null
  }
}
export const getters = {
  currentArticle(state) {
    return state.currentArticle
  },
  getArticles(state) {
    return state.articles
  },
  getNews (state) {
    console.log(state.articles)
    return state.articles.filter(a => a.category === 'news')
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
    console.log('setcurrent', article)
    state.currentArticle = article
  },
  setArticles(state, articles) {
    state.articles = articles
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
