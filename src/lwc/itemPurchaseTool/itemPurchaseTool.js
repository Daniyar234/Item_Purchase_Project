/**
 * Created by Dream on 13.02.2026.
 */

import {LightningElement, api, wire} from 'lwc';
import {getRecord, getFieldValue} from 'lightning/uiRecordApi';

import NAME_FIELD from '@salesforce/schema/Account.Name';
import NUMBER_FIELD from '@salesforce/schema/Account.AccountNumber';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';


export default class ItemPurchaseTool extends LightningElement {
    @api recordId;

    @wire(getRecord, {
        recordId: '$recordId',
        fields: [NAME_FIELD, NUMBER_FIELD, INDUSTRY_FIELD]
    })
    account;

    get accName() {
        return this.account.data
            ? getFieldValue(this.account.data, NAME_FIELD)
            : '';
    }

    get accNumber() {
        return this.account.data
        ? getFieldValue(this.account.data, NUMBER_FIELD)
        : '';
    }

    get accIndustry() {
        return this.account.data
            ? getFieldValue(this.account.data, INDUSTRY_FIELD)
            : '';
    }
}