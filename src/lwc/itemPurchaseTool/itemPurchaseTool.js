/**
 * Created by Dream on 13.02.2026.
 */

import { LightningElement, wire, track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import getFilteredItems from '@salesforce/apex/ItemController.getItems';
import findItems from '@salesforce/apex/SearchItems.findItems';


import NAME_FIELD from '@salesforce/schema/Account.Name';
import NUMBER_FIELD from '@salesforce/schema/Account.AccountNumber';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';

export default class ItemPurchaseTool extends LightningElement {
    accountId;

    @track items = [];
    family = '';
    type = '';

    /** @type {{label: string, value: string}[]} */
    familyOptions = [
        { label: 'Hardware', value: 'Hardware' },
        { label: 'Software', value: 'Software' },
        { label: 'Services', value: 'Services' },
        { label: 'Support', value: 'Support' }
    ];

    /** @type {{label: string, value: string}[]} */
    typeOptions = [
        { label: 'Product', value: 'Product' },
        { label: 'Subscription', value: 'Subscription' },
        { label: 'License', value: 'License' },
        { label: 'Warranty', value: 'Warranty' }
    ];



    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        if (currentPageReference) {
            this.accountId = currentPageReference.state.c__accountId;
        }
    }

    @wire(getRecord, { recordId: '$accountId', fields: [NAME_FIELD, NUMBER_FIELD, INDUSTRY_FIELD] })
    account;

    get accName() {
        return getFieldValue(this.account.data, NAME_FIELD);
    }

    get accNumber() {
        return getFieldValue(this.account.data, NUMBER_FIELD);
    }

    get accIndustry() {
        return getFieldValue(this.account.data, INDUSTRY_FIELD);
    }

    handleFamilyChange(event) {
        this.family = event.detail.value;
    }

    handleTypeChange(event) {
        this.type = event.detail.value;
    }

    handleFilter() {
        getFilteredItems({ familyFilter: this.family, typeFilter: this.type })
            .then(result => {
                this.items = result;
            })
            .catch(error => {
                console.error(error);
                this.items = [];
            });
    }

    get itemsCount() {
        return this.items ? this.items.length : 0;
    }

    searchKey = '';
    searchedItems = [];

    handleKeyChange(event) {
        this.searchKey = event.target.value;
    }

    handleSearch() {
        findItems({ searchKey: this.searchKey })
            .then(result => {
                this.searchedItems = result;
            })
            .catch(error => {
                console.error(error);
                this.searchedItems = [];
            });
    }
}
