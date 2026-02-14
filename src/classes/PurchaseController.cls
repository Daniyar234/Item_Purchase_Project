public with sharing class PurchaseController {

    @AuraEnabled
    public static Id createPurchase(Id accountId, List<Id> itemIds) {

        if (accountId == null || itemIds.isEmpty()) {
            throw new AuraHandledException('Account or items are missing.');
        }

        Purchase__c purchase = new Purchase__c(
                ClientId__c = accountId
        );
        insert purchase;

        List<Item__c> items = [SELECT Id, Price__c FROM Item__c WHERE Id IN :itemIds];

        Decimal grandTotal = 0;
        List<PurchaseLine__c> lines = new List<PurchaseLine__c>();

        for (Item__c item : items) {

            Decimal unitPrice = item.Price__c != null ? item.Price__c : 0;

            PurchaseLine__c line = new PurchaseLine__c(
                    PurchaseId__c = purchase.Id,
                    ItemId__c = item.Id,
                    Amount__c = 1,
                    UnitCost__c = unitPrice
            );

            lines.add(line);
            grandTotal += unitPrice;
        }

        insert lines;

        return purchase.Id;
    }
}
