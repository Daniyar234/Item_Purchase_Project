/**
 * Created by Dream on 13.02.2026.
 */

import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import NAME_FIELD from '@salesforce/schema/Account.Name';
import NUMBER_FIELD from '@salesforce/schema/Account.AccountNumber';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';

export default class ItemPurchaseTool extends LightningElement {
    accountId;

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
}
