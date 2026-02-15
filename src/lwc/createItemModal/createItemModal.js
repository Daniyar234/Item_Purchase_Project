/**
 * Created by Dream on 15.02.2026.
 */
import {LightningElement} from 'lwc';
import fillImageForItem from '@salesforce/apex/UnsplashService.fillImageForItem';

import LightningModal from 'lightning/modal';

export default class CreateItemModal extends LightningModal {

    handleSuccess(event) {
        const itemId = event.detail.id;

        fillImageForItem({ itemId })
            .then(() => {
                this.close(itemId);
            })
            .catch(error => {
                console.error(error);
                this.close(itemId);
            });
    }

}