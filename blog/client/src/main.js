import { createApp } from 'vue'
import './style.css'
import naive from 'naive-ui'
import App from './App.vue'
import { createDiscreteApi } from 'naive-ui'
import { createPinia} from "pinia"
import { router } from './common/router'
import axios from "axios"
import { AdminStore } from "./stores/AdminStore"

//全局地址
axios.defaults.baseURL = "http://localhost:8080"
const { message, notification, dialog } = createDiscreteApi(["message", "dialog", "notification"])



const app = createApp(App)
app.provide("axios",axios)
app.provide("message",message)
app.provide("notification",notification)
app.provide("dialog",dialog)
app.provide("server_url",axios.defaults.baseURL)


app.use(naive)
app.use(createPinia())


app.use(router)
const adminstore = AdminStore()
axios.interceptors.request.use((config) => {
config.headers.token = adminstore.token
return config;
})
app.mount('#app')
