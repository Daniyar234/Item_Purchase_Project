@IsTest
private class ItemControllerTest {

    @TestSetup
    static void setupTestData() {
        List<Item__c> items = new List<Item__c>();

        items.add(new Item__c(
                Name = 'Laptop',
                Description__c = 'High performance laptop',
                Family__c = 'Hardware',
                Type__c = 'Product'
        ));

        items.add(new Item__c(
                Name = 'Antivirus',
                Description__c = 'Security software subscription',
                Family__c = 'Software',
                Type__c = 'Subscription'
        ));

        items.add(new Item__c(
                Name = 'Consulting',
                Description__c = 'IT consulting services',
                Family__c = 'Services',
                Type__c = 'License'
        ));

        insert items;
    }

    @IsTest
    static void testGetItemsWithoutFilters() {
        List<Item__c> result = ItemController.getItems(null, null, null);
        System.assertEquals(3, result.size(), 'Expected: 3, Actual: ' + result.size());
    }

    @IsTest
    static void testGetItemsWithFamilyFilter() {
        List<Item__c> result = ItemController.getItems('Hardware', null, null);
        System.assertEquals(1, result.size(), 'Expected: 1, Actual: ' + result.size());
        System.assertEquals('Laptop', result[0].Name, 'Expected: Laptop, Actual: ' + result[0].Name);
    }

    @IsTest
    static void testGetItemsWithTypeFilter() {
        List<Item__c> result = ItemController.getItems(null, 'Subscription', null);
        System.assertEquals(1, result.size(), 'Expected: 1, Actual: ' + result.size());
        System.assertEquals('Antivirus', result[0].Name, 'Expected: Antivirus, Actual: ' + result[0].Name);
    }

    @IsTest
    static void testGetItemsWithSearchKey() {
        List<Item__c> result = ItemController.getItems(null, null, 'consulting');
        System.assertEquals(1, result.size(), 'Expected: 1, Actual: ' + result.size());
        System.assertEquals('Consulting', result[0].Name, 'Expected: Consulting, Actual: ' + result[0].Name);
    }

    @IsTest
    static void testGetItemsWithAllFilters() {
        List<Item__c> result = ItemController.getItems('Software', 'Subscription', 'antivirus');
        System.assertEquals(1, result.size(), 'Expected: 1, Actual: ' + result.size());
        System.assertEquals('Antivirus', result[0].Name, 'Expected: Antivirus, Actual: ' + result[0].Name);
    }

    @IsTest
    static void testGetItemsNoMatch() {
        List<Item__c> result = ItemController.getItems('Hardware', 'Subscription', 'Consulting');
        System.assertEquals(0, result.size(), 'Expected: 0, Actual: ' + result.size());
    }
}
