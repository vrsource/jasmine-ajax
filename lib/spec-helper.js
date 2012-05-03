beforeEach(function() {


  if ((typeof Ext != 'undefined') && Ext.is && (Ext.is.Phone != undefined)) {
    // Sencha Touch 1.x
    spyOn(Ext.data.Connection.prototype, 'getXhrInstance').andCallFake(function() {
      var new_xhr = new FakeXMLHttpRequest();
      ajaxRequests.push(new_xhr);
      return new_xhr;
    });
  }

  if(Ext.versions && Ext.versions.touch && Ext.versions.touch.getMajor() >= 2) {
    // Sencha Touch 2.x
    spyOn(Ext.data.Connection.prototype, 'getXhrInstance').andCallFake(function() {
      var new_xhr = new FakeXMLHttpRequest();
      ajaxRequests.push(new_xhr);
      return new_xhr;
    });
  }


  clearAjaxRequests();

});

afterEach(function() {
  // clean up after to look for hanging requests
  clearAjaxRequests();
});


