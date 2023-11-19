// stores/counter.js
import { defineStore } from 'pinia'

export const userStore = defineStore('user', {
    state: () => {
        return {
            loginInfo: {
                name: ''
            },
        }
    },
    actions: {
        increment() {
            this.count++
        },
        loginAfter() {
            this.loginInfo = {
                name: 'CheckAdmin'
            }
        },
        loginOutAfter() {
            this.loginInfo = {}
        },
        async checkLogin() {
            this.loginAfter()
            return { err: false }
        },
        login() {

        },
        loginOutPost() {

        }
    },
})