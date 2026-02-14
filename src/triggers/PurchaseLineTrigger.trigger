trigger PurchaseLineTrigger on PurchaseLine__c
        (
                after insert,
                after update,
                after delete,
                after undelete
        ) {

    Set<Id> purchaseIds = new Set<Id>();

    if (Trigger.isDelete) {
        for (PurchaseLine__c line : Trigger.old) {
            purchaseIds.add(line.PurchaseId__c);
        }
    } else {
        for (PurchaseLine__c line : Trigger.new) {
            purchaseIds.add(line.PurchaseId__c);
        }
    }

    List<PurchaseLine__c> lines = [
            SELECT PurchaseId__c, Amount__c, UnitCost__c
            FROM PurchaseLine__c
            WHERE PurchaseId__c IN :purchaseIds
    ];

    Map<Id, Integer> totalItemsMap = new Map<Id, Integer>();
    Map<Id, Decimal> grandTotalMap = new Map<Id, Decimal>();

    for (PurchaseLine__c line : lines) {

        if (!totalItemsMap.containsKey(line.PurchaseId__c)) {
            totalItemsMap.put(line.PurchaseId__c, 0);
            grandTotalMap.put(line.PurchaseId__c, 0);
        }

        totalItemsMap.put(
                line.PurchaseId__c,
                totalItemsMap.get(line.PurchaseId__c) + 1
        );

        Decimal lineTotal = line.Amount__c * line.UnitCost__c;

        grandTotalMap.put(
                line.PurchaseId__c,
                grandTotalMap.get(line.PurchaseId__c) + lineTotal
        );
    }

    List<Purchase__c> purchasesToUpdate = new List<Purchase__c>();

    for (Id pId : purchaseIds) {
        purchasesToUpdate.add(new Purchase__c(
                Id = pId,
                TotalItems__c = totalItemsMap.containsKey(pId) ? totalItemsMap.get(pId) : 0,
                GrandTotal__c = grandTotalMap.containsKey(pId) ? grandTotalMap.get(pId) : 0
        ));
    }

    update purchasesToUpdate;
}
