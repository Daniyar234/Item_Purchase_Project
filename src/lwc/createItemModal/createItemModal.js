/**
 * Created by Dream on 15.02.2026.
 */

import {LightningElement} from 'lwc';

import LightningModal from 'lightning/modal';

export default class CreateItemModal extends LightningModal {
    handleSuccess(event) {
        this.close(event.detail.id);
    }
}