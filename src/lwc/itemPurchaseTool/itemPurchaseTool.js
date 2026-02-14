/**
 * Created by Dream on 13.02.2026.
 */
import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import getItems from '@salesforce/apex/ItemController.getItems';

import NAME_FIELD from '@salesforce/schema/Account.Name';
import NUMBER_FIELD from '@salesforce/schema/Account.AccountNumber';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';

export default class ItemPurchaseTool extends LightningElement {

    accountId;
    items = [];

    family = '';
    type = '';
    searchKey = '';

    /** @type {{label: string, value: string}[]} */
    familyOptions = [
        {label: 'None', value: ''},
        { label: 'Hardware', value: 'Hardware' },
        { label: 'Software', value: 'Software' },
        { label: 'Services', value: 'Services' },
        { label: 'Support', value: 'Support' }
    ];

    /** @type {{label: string, value: string}[]} */
    typeOptions = [
        {label: 'None', value: ''},
        { label: 'Product', value: 'Product' },
        { label: 'Subscription', value: 'Subscription' },
        { label: 'License', value: 'License' },
        { label: 'Warranty', value: 'Warranty' }
    ];

    @wire(CurrentPageReference)
    setCurrentPageReference(pageRef) {
        if (pageRef) {
            this.accountId = pageRef.state.c__accountId;
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

    get itemsCount() {
        return this.items.length;
    }

    handleChange(event) {
        const field = event.target.name;
        this[field] = event.detail ? event.detail.value : event.target.value;
    }

    applyFilters() {
        getItems({
            familyFilter: this.family,
            typeFilter: this.type,
            searchKey: this.searchKey
        })
            .then(result => this.items = result)
            .catch(() => this.items = []);
    }

    connectedCallback() {
        this.applyFilters();
    }
}
