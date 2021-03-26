import Vue from 'vue'

import App from './App'
import router from './router'

Vue.prototype.$browser = global.browser

new Vue({
	el: '#app',
	router,
	render: h => h(App)
})
