public with sharing class ItemController {

    @AuraEnabled(Cacheable=true)
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

        if (!String.isBlank(searchKey)) {
            String escapedSearch = String.escapeSingleQuotes(searchKey);
            baseQuery +=
                    ' AND (Name LIKE \'%' + escapedSearch + '%\' ' +
                            'OR Description__c LIKE \'%' + escapedSearch + '%\')';
        }


        return Database.query(baseQuery);
    }
}