public with sharing class ItemController {

    @AuraEnabled
    public static List<Item__c> getItems(String familyFilter,
            String typeFilter,
            String searchKey) {

        String baseQuery =
                'SELECT Id, Name, Description__c, Family__c, Type__c, Image__c ' +
                        'FROM Item__c WHERE Name != null';

        if (!String.isBlank(familyFilter)) {
            baseQuery += ' AND Family__c = :familyFilter';
        }

        if (!String.isBlank(typeFilter)) {
            baseQuery += ' AND Type__c = :typeFilter';
        }

        List<Item__c> items = Database.query(baseQuery);

        if (!String.isBlank(searchKey)) {

            String lowerSearch = searchKey.toLowerCase();
            List<Item__c> filtered = new List<Item__c>();

            for (Item__c item : items) {

                Boolean nameMatch =
                        item.Name != null &&
                                item.Name.toLowerCase().contains(lowerSearch);

                Boolean descMatch =
                        item.Description__c != null &&
                                item.Description__c.toLowerCase().contains(lowerSearch);

                if (nameMatch || descMatch) {
                    filtered.add(item);
                }
            }

            return filtered;
        }

        return items;
    }
}
