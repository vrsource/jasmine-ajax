/* Make sure that our mocking for sencha ajax calls works. */
describe('Jasmine Mock Ajax (for Sencha Touch)', function() {
   var request, anotherRequest, response;
   var success, failure;
   var sharedContext = {};

   beforeEach(function() {
      success = jasmine.createSpy("onSuccess");
      failure = jasmine.createSpy("onFailure");
   });

   afterEach(function() {
      // Clean up pending requests.
      // note: relies on fix for Ext.data.Connection.abort bug
      //  see: http://www.sencha.com/forum/showthread.php?128367
      Ext.each([request, anotherRequest], function(r) {
         if(r && r.xhr && (r.xhr.readyState === 2))
         { Ext.Ajax.abort(r); }
      });

   });

   // ----------------------- //
   describe('when making a request', function() {
      beforeEach(function() {
         request = Ext.Ajax.request({
            url: "example.com/someApi",
            method: 'GET',
            success: success,
            failure: failure
         });
      });

      it('should queue the request', function() {
         expect(ajaxRequests.length).toEqual(1);
      });

      it('should store URL and transport', function() {
         expect(request.options.url).toEqual('example.com/someApi');
      });

      it('should allow access to the queued request', function() {
         expect(ajaxRequests[0]).toEqual(request.xhr);
      });

      // --- another request --- //
      describe('and then another request', function() {
         beforeEach(function() {
            anotherRequest = Ext.Ajax.request({
               url: 'example.com/someApi2',
               method: 'GET',
               success: success,
               failure: failure
            });
         });

         it('should queue the next request', function() {
            expect(ajaxRequests.length).toEqual(2);
         });

         it('should allow access to the other queued request', function() {
            expect(ajaxRequests[1]).toEqual(anotherRequest.xhr);
         });
      });  // another request

      // --- mostRecentAjaxRequest() --- //
      describe("mostRecentAjaxRequest", function () {

         describe("when there is one request queued", function () {
            it("should return the request", function() {
               expect(mostRecentAjaxRequest()).toEqual(request.xhr);
            });
         });

         describe("when there is more than one request", function () {
            beforeEach(function() {
               anotherRequest = Ext.Ajax.request({
                  url: "example.com/someApi3",
                  method: "GET",
                  success: success,
                  failure: failure
               });
            });

            it("should return the most recent request", function() {
               expect(mostRecentAjaxRequest()).toEqual(anotherRequest.xhr);
            });
         });

         describe("when there are no requests", function () {
            beforeEach(function() {
               Ext.Ajax.abort(request);
               clearAjaxRequests();
            });

            it("should return null", function() {
               expect(mostRecentAjaxRequest()).toEqual(null);
            });
         });
      });// Most recent ajax requests

      // --- ClearAjaxRequests() --- //
      describe('clearAjaxRequests()', function() {
         beforeEach(function() {
            Ext.Ajax.abort(request);
            clearAjaxRequests();
         });

         it("should remove all requests", function() {
           expect(ajaxRequests.length).toEqual(0);
           expect(mostRecentAjaxRequest()).toEqual(null);
         });
      }); // clearAjaxRequests
   }); // making request

   // ------------------------------------------ //
   describe("when simulating a response with request.response", function () {
      // -- SUCCESS --- //
      describe("and the response is Success", function () {
         beforeEach(function() {
            request = Ext.Ajax.request({
               url: "example.com/someApi4",
               method: "GET",
               //dataType: 'text',
               success: success,
               failure: failure
            });

            response = {status: 200, contentType: "text/html", responseText: "OK!"};
            mostRecentAjaxRequest().response(response);

            sharedContext.responseCallback = success;
            sharedContext.status           = response.status;
            sharedContext.contentType      = response.contentType;
            sharedContext.responseText     = response.responseText;
         });

         it("should call the success handler", function() {
            expect(success).toHaveBeenCalled();
         });

         it("should not call the failure handler", function() {
            expect(failure).not.toHaveBeenCalled();
         });

         sharedAjaxResponseBehaviorForExt(sharedContext);
      });

      // -- JSON Default --- //
      describe("the content type defaults to application/json", function () {
         beforeEach(function() {
            request = Ext.Ajax.request({
               url: "example.com/someApi5",
               method: "GET",
               success: success,
               failure: failure
            });

            response = {status: 200, responseText: '{"foo": "valid JSON, dammit."}'};
            mostRecentAjaxRequest().response(response);

            sharedContext.responseCallback = success;
            sharedContext.status           = response.status;
            sharedContext.contentType      = "application/json";
            sharedContext.responseText     = response.responseText;
         });

         it("should call the success handler", function() {
            expect(success).toHaveBeenCalled();
         });

         it("should not call the failure handler", function() {
            expect(failure).not.toHaveBeenCalled();
         });

         sharedAjaxResponseBehaviorForExt(sharedContext);
      });

      // --- STATUS of 0 ---- //
      describe("and the status/response code is 0", function () {
         beforeEach(function() {
            request = Ext.Ajax.request({
               url: "example.com/someApi6",
               method: "GET",
               success: success,
               failure: failure
            });

            response = {status: 0, responseText: ''};
            mostRecentAjaxRequest().response(response);

            sharedContext.responseCallback = failure;
            sharedContext.status           = 0;
            sharedContext.contentType      = 'application/json';
            sharedContext.responseText     = response.responseText;
         });

         it("should not call the success handler", function() {
            expect(success).not.toHaveBeenCalled();
         });

         it("should call the failure handler", function() {
            expect(failure).toHaveBeenCalled();
         });

         sharedAjaxResponseBehaviorForExt(sharedContext);
      });
   }); // When simulating

   // Response is error
   describe("and the response is error", function () {
      beforeEach(function() {
         request = Ext.Ajax.request({
            url: "example.com/someApi7",
            method: "GET",
            success: success,
            failure: failure
         });

         response = {status: 500, contentType: "text/html", responseText: "(._){"};
         mostRecentAjaxRequest().response(response);

         sharedContext.responseCallback = failure;
         sharedContext.status           = response.status;
         sharedContext.contentType      = response.contentType;
         sharedContext.responseText     = response.responseText;
      });

      it("should not call the success handler", function() {
         expect(success).not.toHaveBeenCalled();
      });

      it("should call the failure handler", function() {
         expect(failure).toHaveBeenCalled();
      });

      sharedAjaxResponseBehaviorForExt(sharedContext);
   });

}); // jasmine mock

// Helper for checking the status of the response.
function sharedAjaxResponseBehaviorForExt(context) {
   describe("the response", function () {
      var resp;
      beforeEach(function() {
         resp = context.responseCallback.mostRecentCall.args[0];
      });

      it("should have the expected status code", function() {
         expect(resp.status).toEqual(context.status);
      });

      it("should have the expected content type", function() {
         expect(resp.getResponseHeader('Content-type')).toEqual(context.contentType);
      });

      it("should have the expected response text", function() {
         expect(resp.responseText).toEqual(context.responseText);
      });
   });
}
