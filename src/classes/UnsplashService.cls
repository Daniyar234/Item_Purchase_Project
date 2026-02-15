public with sharing class UnsplashService {

    @AuraEnabled
    public static void fillImageForItem(Id itemId) {

        Item__c item = [
                SELECT Id, Name
                FROM Item__c
                WHERE Id = :itemId
                LIMIT 1
        ];

        System.debug('Fetching image for Item: ' + item.Name);
        String imageUrl = getImageUrl(item.Name);
        System.debug('Returned Unsplash URL: ' + imageUrl);

        if (imageUrl != null) {
            item.Image__c = imageUrl;
            update item;
            System.debug('Updated Image URL: ' + item.Image__c);
        }
    }

    private static String getImageUrl(String searchQuery) {
        Http http = new Http();
        HttpRequest req = new HttpRequest();

        req.setEndpoint('callout:UnsplashEC/search/photos?query=' + EncodingUtil.urlEncode(searchQuery, 'UTF-8') + '&per_page=1');
        req.setMethod('GET');

        req.setHeader('Authorization', 'Client-ID 3ymwiKFIx8XqaNmt-X77NlZVKXhMX9Ray3kuOB9woxk');

        HttpResponse res = http.send(req);

        if (res.getStatusCode() == 200) {
            Map<String, Object> result = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            List<Object> results = (List<Object>) result.get('results');

            if (!results.isEmpty()) {
                Map<String, Object> first = (Map<String, Object>) results[0];
                Map<String, Object> urls = (Map<String, Object>) first.get('urls');

                return (String) urls.get('small');
            }
        }

        return 'https://via.placeholder.com/150';
    }

}
