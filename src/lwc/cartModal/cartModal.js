/**
 * Created by Dream on 14.02.2026.
 */

import LightningModal from 'lightning/modal';
import { api } from 'lwc';

export default class CartModal extends LightningModal {
    @api cartItems = [];
}