import { ArticlesService } from "~/services/articlesService"


export const state = () => {
  return {
    articles: [],
    currentArticle: null,
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
  getNews (state) {
    return state.articles.filter(a => a.category === 'news')
  },
  getEvents (state) {
    return state.articles.filter(a => a.category === 'event')
  },
  getStories (state) {
    return state.articles.filter(a => a.category === 'story')
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
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
