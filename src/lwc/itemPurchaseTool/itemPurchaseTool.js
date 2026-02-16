/**
 * Created by Dream on 13.02.2026.
 */
import {LightningElement, wire} from 'lwc';
import {CurrentPageReference} from 'lightning/navigation';
import {getRecord, getFieldValue} from 'lightning/uiRecordApi';
import getItems from '@salesforce/apex/ItemController.getItems';
import ItemDetailsModal from 'c/itemDetailsModal';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import CartModal from 'c/cartModal';
import { NavigationMixin } from 'lightning/navigation';
import CreateItemModal from 'c/createItemModal';

import NAME_FIELD from '@salesforce/schema/Account.Name';
import NUMBER_FIELD from '@salesforce/schema/Account.AccountNumber';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';

import USER_ID from '@salesforce/user/Id';
import IS_MANAGER_FIELD from '@salesforce/schema/User.IsManager__c';

export default class ItemPurchaseTool extends NavigationMixin(LightningElement) {

    accountId;
    items = [];

    family = '';
    type = '';
    searchKey = '';

    cartItems = [];

    /** @type {{label: string, value: string}[]} */
    familyOptions = [
        {label: 'None', value: ''},
        {label: 'Hardware', value: 'Hardware'},
        {label: 'Software', value: 'Software'},
        {label: 'Services', value: 'Services'},
        {label: 'Support', value: 'Support'}
    ];

    /** @type {{label: string, value: string}[]} */
    typeOptions = [
        {label: 'None', value: ''},
        {label: 'Product', value: 'Product'},
        {label: 'Subscription', value: 'Subscription'},
        {label: 'License', value: 'License'},
        {label: 'Warranty', value: 'Warranty'}
    ];

    @wire(CurrentPageReference)
    setCurrentPageReference(pageRef) {
        if (pageRef) {
            this.accountId = pageRef.state.c__accountId;
        }
    }

    @wire(getRecord, {recordId: '$accountId', fields: [NAME_FIELD, NUMBER_FIELD, INDUSTRY_FIELD]})
    account;

    @wire(getRecord, {

        recordId: USER_ID,
        fields: [IS_MANAGER_FIELD]
    })
    user;

    get isManager() {
        console.log('User data:', this.user);
        return getFieldValue(this.user.data, IS_MANAGER_FIELD);
    }

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
        this[event.target.name] = event.target.value;
    }

    applyFilters() {
        console.log('SEARCH CLICKED');
        console.log('searchKey = ', this.searchKey);

        getItems({
            familyFilter: this.family,
            typeFilter: this.type,
            searchKey: this.searchKey
        })
            .then(result => {
                console.log('RESULT FROM APEX', result);
                this.items = result;
            })
            .catch(error => {
                console.error('ERROR', error);
                this.items = [];
            });
    }


    connectedCallback() {
        this.applyFilters();
    }

    async openDetails(event) {

        const itemId = event.currentTarget.dataset.id;

        const selectedItem = this.items.find(i => i.Id === itemId);

        await ItemDetailsModal.open({
            size: 'medium',
            description: 'Item Details',
            item: selectedItem
        });
    }

    handleAddToCart(event) {
        const itemId = event.currentTarget.dataset.id;
        const selectedItem = this.items.find(i => i.Id === itemId);

        if (selectedItem && selectedItem.Id) {
            this.cartItems = [...this.cartItems, selectedItem];

            this.dispatchEvent(new ShowToastEvent({
                title: 'Item added',
                message: `${selectedItem.Name} was added to your cart.`,
                variant: 'success',
                mode: 'dismissable'
            }));
        }
    }

    async openCart() {
        const purchaseId = await CartModal.open({
            size: 'medium',
            cartItems: [...this.cartItems],
            accountId: this.accountId
        });

        if (purchaseId) {
            /** @type {import('lightning/navigation').PageReference} */
            const pageRef = {
                type: 'standard__recordPage',
                attributes: {
                    recordId: purchaseId,
                    objectApiName: 'Purchase__c',
                    actionName: 'view'
                }
            };

            this[NavigationMixin.Navigate](pageRef);
        }
    }

    async openCreateItemModal() {
        const newItemId = await CreateItemModal.open({
            size: 'medium'
        });

        if (newItemId) {
            this.applyFilters();
        }
    }

}
