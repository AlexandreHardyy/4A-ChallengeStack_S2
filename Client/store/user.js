import { defineStore } from "pinia";
import Cookies from 'js-cookie'


export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
  }),

  actions: {
    setToken(token) {
      this.user = { token };
      Cookies.set('user', JSON.stringify({ token }), { expires: 1000 })
    },
    logout() {
        this.user = null
        Cookies.remove('user')
    },
    getToken() {
        if (this.user) {
            return this.user.token
        }
        this.user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null
        return this.user?.token
    }
  },
});
