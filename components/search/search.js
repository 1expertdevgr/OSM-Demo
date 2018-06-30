import 'can-stache-bindings';
import Component from 'can-component';
import Map from 'can-map';
import template from './search.stache';
import { EHOSTUNREACH } from 'constants';
import List from 'can-define/list/list';



const SearchViewModel = Map.extend( "SearchViewModel", {

  findObjectByKey : function (array, key, operator, value) {
debugger;
    
    var _data = [];
    if(key !== null && key !== '' && operator != null && operator != '') {
       var _row = null;
        for (var i = 0; i < array.length; i++) {
          var _val1 = array[i][key].toLowerCase() ;
          var _val2 = value.toLowerCase();
          _row = null;
          if (operator =='equals') {
            if (_val1 == _val2) 
              _row = array[i];
            
          } 
          else  if (operator =='notequals') {
            if (_val1 != _val2) 
              _row = array[i];
          }

          else if (operator =='isempty') { 
            if (_val1 == '' || _val1 == null || _val1 == undefined) 
              _row = array[i];
          }
          else if (operator =='isnotempty') { 
            if (_val1.length > 0) 
              _row = array[i];
          }
          else if (operator =='startswith') { 
            if (_val1.startsWith(_val2)) 
              _row = array[i];
          }
          else if (operator =='contains') { 
            if (_val1.indexOf(_val2) > -1) 
              _row = array[i];
          }

          if (_row) {
            _data.push(_row);

          }

        }
      } else 
      {
        _data = array
      }
      return _data;
   
}, 
  
  searchParameter: {
            key: '',
            operator: '',
            value: ''
  },

  columns: [
            {name:"Id",description:"Id"},
            {name:"Description",description:"Description"},
            {name:"MAC",description:"MAC"},
            {name:"AssignedSignId",description:"Assigned Sign Id"},
            {name:"AssignedSignPath",description:"Assigned Sign Path"},
            {name:"Temperature",description:"Temperature"},
            {name:"MBMVersion",description:"MBM Version"},
            {name:"FirmwareVersion",description:"Firmware Version"},
            {name:"SerialNumber",description:"Serial Number"},
            {name:"Platform",description:"Platform"},
            {name:"User", description:"User"},
       
    ],
  searchOperatorList: [
            {key:"equals", description: "Equals"},
            {key:"notequals", description: "Not Equals"},
            {key:"isempty", description: "Is Empty"},
            {key:"isnotempty", description: "Is Not Empty"},
            {key:"startswith", description: "Starts With"},
            {key:"contains", description: "Contains"},
       ],

    

  selectedColumns:[], 
  dataRows:[], 
  dataHeaders:[],

  IsFieldSelected:function(fieldName){
    return this.selectedColumns.length && this.selectedColumns.indexOf(fieldName)>-1;
  },
  Reset: function () {
    var _self = this;
    this.searchParameter = {
      key: '',
      operator: '',
      value: ''
    };
    var dataHeaderArray = [];
    this.selectedColumns = ["Id","Description","MAC","AssignedSignId","AssignedSignPath","Temperature","MBMVersion","FirmwareVersion","SerialNumber","Platform","User"]
    console.log(this.selectedColumns);

    this.selectedColumns.forEach(function(element, index, list) {      
      var filtered = _self.columns.filter( function(item, index, list) { return item.name == element; }); 
      if(filtered.length) { dataHeaderArray.push(filtered[0]); }
    });
    _self.dataHeaders = dataHeaderArray;

    $.ajax({
      url: "/data/demo.json",
      dataType: 'json',
      async: false,
      success: function(data) {
        _self.dataRows =  data;
      }
    });


    this.attr('selectedColumns',this.selectedColumns);
    this.attr('dataHeaders', _self.dataHeaders);
    console.log(this.dataHeaders);
    this.attr('dataRows', _self.dataRows);
    this.attr('searchParameter', this.searchParameter);
  },

  loadDataRows: function () {
   
    var _self = this;
    var dataHeaderArray = [];
    
    this.selectedColumns.forEach(function(element, index, list) {      
      var filtered = _self.columns.filter( function(item, index, list)
                      {
                          return item.name == element;
                      }); 
      if(filtered.length) {

        dataHeaderArray.push(filtered[0]);
      }
    });
    _self.dataHeaders = dataHeaderArray;

    $.ajax({
      url: "/data/demo.json",
      dataType: 'json',
      async: false,
      success: function(data) {
        _self.dataRows =  _self.findObjectByKey(data, _self.searchParameter["key"], _self.searchParameter["operator"], _self.searchParameter["value"]);
      }
    });


    this.attr('selectedColumns',this.selectedColumns);
    this.attr('dataHeaders', _self.dataHeaders);
    console.log(this.dataHeaders);
    this.attr('dataRows', _self.dataRows);
 
  },
  

});

Component.extend({
  tag: 'search-page',
  view: template,
  ViewModel:SearchViewModel 
});
