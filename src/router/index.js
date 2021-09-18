import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import '../assets/custom.css'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: () => import('../views/CalendarView.vue')
  },
  {
    path: '/setup',
    name: 'Setup',
    component: () => import('../views/Setup.vue')
  },
  {
    path: '/exercises',
    name: 'Exercises',
    component: () => import('../views/ExercisesView.vue')
  },
  {
    path: '/trainings',
    name: 'Trainings',
    component: () => import('../views/TrainingsView.vue')
  },
  {
    path: '/routines',
    name: 'Routines',
    component: () => import('../views/RoutinesView.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
