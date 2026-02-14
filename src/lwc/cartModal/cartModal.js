/**
 * Created by Dream on 14.02.2026.
 */
import LightningModal from 'lightning/modal';
import { api } from 'lwc';
import createPurchase from '@salesforce/apex/PurchaseController.createPurchase';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CartModal extends LightningModal {
    @api cartItems = [];
    @api accountId;

    async handleCheckout() {
        if (!this.cartItems.length) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Cart is empty',
                    message: 'Please add items before checking out.',
                    variant: 'warning',
                })
            );
            return;
        }

        const itemIds = Array.from(this.cartItems)
            .filter(item => item && item.Id)
            .map(item => item.Id);

        console.log('AccountId:', this.accountId);
        console.log('ItemIds:', itemIds);

        if (!this.accountId || !itemIds.length) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating purchase',
                    message: 'Missing account or item information.',
                    variant: 'error',
                })
            );
            return;
        }

        try {
            const purchaseId = await createPurchase({
                accountId: this.accountId,
                itemIds
            });

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Purchase Created',
                    message: `Purchase successfully created (Id: ${purchaseId})`,
                    variant: 'success',
                })
            );

            this.cartItems = [];
            this.close();
        } catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating purchase',
                    message: error.body?.message || error.message,
                    variant: 'error',
                })
            );
        }
    }
}
