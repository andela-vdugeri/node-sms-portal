'use strict';

angular.module('Sms.services', ['ngCookies']);
angular.module('Sms.filters', []);
angular.module('Sms.directives', []);
angular.module('Sms.controllers', []);

/* load services */


/* load filters */


/* load direcivies */


/* load controllers */


window.Sms = angular.module('Sms', [
  'ui.router',
  'ui.bootstrap',
  'Sms.controllers',
  'Sms.directives',
  'Sms.filters',
  'Sms.services',
  'ngAnimate',
  'md.data.table',
  'ngMaterial',
  'ngResource',
  'LocalForageModule'
]);
