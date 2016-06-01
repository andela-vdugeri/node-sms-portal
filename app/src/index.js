import Vue  from 'vue'
import VueResource  from 'vue-resource'
import VueRouter  from 'vue-router'
import App  from './components/App.vue'
import Login  from './components/auth/Login.vue'
import Register  from './components/auth/Signup.vue'
import Home  from './components/home/Home.vue'
import auth  from './services/auth'

Vue.use(VueResource);
Vue.use(VueRouter);

auth.checkAuth();

export let router = new VueRouter();


router.map({
	'/home': {
		component: Home
	},
	'/login': {
		component: Login
	},
	'/register': {
		component: Register
	},
	'/logout': {
		component: Home
	}
});

router.redirect({
	'*': '/home'
});

router.start(App, '#app');
