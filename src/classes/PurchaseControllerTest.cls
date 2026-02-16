@IsTest
private class PurchaseControllerTest {

    @TestSetup
    static void setupTestData() {
        insert new Account(Name='Test Account');
        insert new List<Item__c>{
                new Item__c(Name='Laptop', Price__c=1000),
                new Item__c(Name='Mouse', Price__c=50)
        };
    }

    @IsTest
    static void testCreatePurchaseSuccess() {
        Account acc = [SELECT Id FROM Account LIMIT 1];
        List<Item__c> items = [SELECT Id, Price__c FROM Item__c LIMIT 2];
        List<Id> itemIds = new List<Id>();
        for(Item__c i : items) itemIds.add(i.Id);

        Test.startTest();
        Id purchaseId = PurchaseController.createPurchase(acc.Id, itemIds);
        Test.stopTest();

        Purchase__c p = [SELECT ClientId__c FROM Purchase__c WHERE Id = :purchaseId];
        List<PurchaseLine__c> lines = [SELECT UnitCost__c FROM PurchaseLine__c WHERE PurchaseId__c = :purchaseId];

        Decimal expectedTotal = 0;
        for(Item__c i : items) expectedTotal += i.Price__c;
        Decimal actualTotal = 0;
        for(PurchaseLine__c l : lines) actualTotal += l.UnitCost__c;

        System.assertEquals(acc.Id, p.ClientId__c, 'Expected: '+acc.Id+' → Result: '+p.ClientId__c);
        System.assertEquals(itemIds.size(), lines.size(), 'Expected: '+itemIds.size()+' → Result: '+lines.size());
        System.assertEquals(expectedTotal, actualTotal, 'Expected: '+expectedTotal+' → Result: '+actualTotal);
    }

    @IsTest
    static void testCreatePurchaseFailure() {
        try {
            PurchaseController.createPurchase(null, new List<Id>());
            System.assert(false, 'Expected exception was not thrown');
        } catch (AuraHandledException e) {
            System.assert(
                    e.getMessage().contains('Account or items are missing.'),
                    'Expected: Account or items are missing. → Result: ' + e.getMessage()
            );
        }
    }

}
