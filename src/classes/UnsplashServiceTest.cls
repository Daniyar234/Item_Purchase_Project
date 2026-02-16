@IsTest
private class UnsplashServiceTest {

    class MockHttpResponseGenerator implements HttpCalloutMock {
        public HttpResponse respond(HttpRequest req) {
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type','application/json');
            res.setBody('{"results":[{"urls":{"small":"https://test.image/1"}}]}');
            res.setStatusCode(200);
            return res;
        }
    }

    @TestSetup
    static void setupData() {
        insert new Item__c(Name='Laptop');
    }

    @IsTest
    static void testFillImageForItem() {
        Item__c item = [SELECT Id, Image__c FROM Item__c LIMIT 1];
        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());

        Test.startTest();
        UnsplashService.fillImageForItem(item.Id);
        Test.stopTest();

        Item__c updated = [SELECT Image__c FROM Item__c WHERE Id = :item.Id];
        System.assertEquals('https://test.image/1', updated.Image__c, 'Expected: https://test.image/1 → Result: '+updated.Image__c);
    }
}
