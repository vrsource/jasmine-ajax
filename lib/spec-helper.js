beforeEach(function() {

  if (typeof jQuery != 'undefined') {
    spyOn(jQuery.ajaxSettings, 'xhr').andCallFake(function() {
      var newXhr = new FakeXMLHttpRequest();
      ajaxRequests.push(newXhr);
      return newXhr;
    });
  }

  if (typeof dojo != 'undefined') {
    spyOn(dojo, '_xhrObj').andCallFake(function() {
      var newXhr = new FakeXMLHttpRequest();
      ajaxRequests.push(newXhr);
      return newXhr;
    });
  }

  if (typeof Prototype != 'undefined') {
    spyOn(Ajax, "getTransport").andCallFake(function() {
      return new FakeXMLHttpRequest();
    });
  }

  // Sencha Touch
  if(Ext.versions && Ext.versions.touch && Ext.versions.touch.getMajor() >= 2) {
    // Sencha Touch 2.x
    spyOn(Ext.data.Connection.prototype, 'getXhrInstance').andCallFake(function() {
      var new_xhr = new FakeXMLHttpRequest();
      ajaxRequests.push(new_xhr);
      return new_xhr;
    });
  }
  else if ((typeof Ext != 'undefined') && Ext.is && (Ext.is.Phone != undefined)) {
    // Sencha Touch 1.x
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

