/**
 * Created by Dream on 14.02.2026.
 */

import LightningModal from 'lightning/modal';
import { api } from 'lwc';

export default class ItemDetailsModal extends LightningModal {
    @api item;
}