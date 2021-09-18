import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import Vuelidate from 'vuelidate'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCogs, faEdit, faTrash, faKey, faCalendar, faUser, faHome, faDumbbell, faSync, faRunning, faSignOutAlt, faTimes, faSave, faCheck, faUpload, faPlus, faShareSquare, faClock, faPlay, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCogs, faEdit, faTrash, faKey, faCalendar, faUser, faHome, faDumbbell, faSync, faRunning, faSignOutAlt, faTimes, faSave, faCheck, faUpload, faPlus, faShareSquare, faClock, faPlay, faCheck, faSearch)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(BootstrapVue)
Vue.use(Vuelidate)
Vue.use(IconsPlugin)

Vue.config.productionTip = false

const globalData = {
  baseUrl: 'http://localhost:9090/',
  party: { id: 1, username: 'admin', firstName: 'Administrator', lastName: 'User' }
}

new Vue({
  router,
  render: h => h(App),
  data: function () {
    return {
      globalData
    }
  },
  components: {
    FontAwesomeIcon
  },
  methods: {
    successToast (body) {
      this.$bvToast.toast(body, {
        title: 'Success',
        variant: 'success',
        solid: true,
        toaster: 'b-toaster-top-center'
      })
    },
    errorToast (body) {
      this.$bvToast.toast(body, {
        title: 'Error',
        variant: 'danger',
        solid: true,
        toaster: 'b-toaster-top-center'
      })
    }
  }
}).$mount('#app')
