import $ from 'jquery';
import Map from 'can-map';
import route from 'can-route';
import template from './index.stache!';
import 'can-map-define';
import './styles.less!';
import 'can-stache-bindings';

const AppViewModel = Map.extend({
  define: {
    '*': {
      serialize: false
    },
    page: {
      serialize: true
    }
  }
});

var data = new AppViewModel({});
$('body').append(template(data));

route.register("{page}",{page: "search"});
route.data = data;
route.start();