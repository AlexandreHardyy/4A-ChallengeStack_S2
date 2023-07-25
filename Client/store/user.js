import { defineStore } from "pinia";
import Cookies from 'js-cookie'
import jwt_decode from 'jwt-decode';


export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
  }),

  actions: {
    async setUser(token) {
      const decodedToken = jwt_decode(token);
      if (!decodedToken.isValid) {
        return false
      }
      this.user = { 
        token,
        ...decodedToken
       };
      Cookies.set('user', JSON.stringify(this.user), { expires: 1000 })
    },
    logout() {
        this.user = null
        Cookies.remove('user')
    },
    getUser() {
      if (this.user) { return this.user }
      this.user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null
      return this.user 
    }
  },
});
