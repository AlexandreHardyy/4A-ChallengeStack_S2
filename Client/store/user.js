import { defineStore } from "pinia";
import Cookies from 'js-cookie'
import jwt_decode from 'jwt-decode';
export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    token: null
  }),

  actions: {
    async setToken(token) {
      const decodedToken = jwt_decode(token);
      if (!decodedToken.isValid) {
        return false
      }
      this.token = token
      Cookies.set('token', JSON.stringify({ token }), { expires: 1000 })
    },
    logout() {
        this.user = null
        Cookies.remove('token')
        window.location.reload()
    },
    getToken() {
      return this.token
    },
     async getMe () {
      const config = useRuntimeConfig();

      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
      const bearerToken = this.token ? `Bearer ${this.token}` : undefined

      if (bearerToken) {
        headers.Authorization = bearerToken
      }

      return fetch(config.public.apiBase + '/user/me', {
          headers
      }).then(res => res.json()).catch(err => err)
    },
    async getUser() {
      this.token = this.token ?? Cookies.get('token') ? JSON.parse(Cookies.get('token'))?.token : null
      if (!this.token) {
        return false
      }

      const user = await this.getMe()
      if (!user || !user.id) {
        return false
      }
      this.user = user
      this.user.isAdmin = user?.Role?.name === 'admin'
      return this.user
    }
  },
});
