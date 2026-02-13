
public with sharing class ItemController {

    @AuraEnabled(Cacheable=true)
    public static List<Item__c> getItems(String familyFilter, String typeFilter) {
        String baseQuery = 'SELECT Id, Name, Family__c, Type__c FROM Item__c WHERE Name != null';

        if(familyFilter != null && familyFilter != '') {
            baseQuery += ' AND Family__c = :familyFilter';
        }

        if(typeFilter != null && typeFilter != '') {
            baseQuery += ' AND Type__c = :typeFilter';
        }

        return Database.query(baseQuery);
    }
}
