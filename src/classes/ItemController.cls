
public with sharing class ItemController {

    @AuraEnabled(Cacheable=true)
    public static List<Product2> getItems(String familyFilter, String typeFilter) {

        String query = 'SELECT Id, Name, Family, Type__c FROM Product2 WHERE IsActive = true';

        if (familyFilter != null && familyFilter != '') {
            query += ' AND Family = :familyFilter';
        }

        if (typeFilter != null && typeFilter != '') {
            query += ' AND Type__c = :typeFilter';
        }

        return Database.query(query);
    }
}
