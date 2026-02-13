public with sharing class SearchItems {
    @AuraEnabled(cacheable=true)
    public static List<Item__c> findItems(String searchKey) {
        List<Item__c> allItems = [SELECT Id, Name, Description__c FROM Item__c LIMIT 200];
        List<Item__c> filteredItems = new List<Item__c>();
        for (Item__c item : allItems) {
            if ((item.Name != null && item.Name.contains(searchKey)) ||
                    (item.Description__c != null && item.Description__c.contains(searchKey))) {
                filteredItems.add(item);
            }
        }
        return filteredItems;
    }
}
