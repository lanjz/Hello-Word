// stores/counter.js
import { defineStore } from 'pinia'

export const userStore = defineStore('user', {
    state: () => {
        return {
            loginInfo: {
                name: ''
            },
            tenantList: [
                { name: '租户一', code: 1 },
                { name: '租户二', code: 2 },
                { name: '租户三', code: 3 },
            ],
            curTenant: 1
        }
    },
    getters: {
        curTenantInfo: (state) => {
            return state.tenantList.find(item => item.code === state.curTenant) || {}
        },
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