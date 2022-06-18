import { LightningElement, api } from 'lwc';

export default class AbtInvGenericForm extends LightningElement 
{
    @api recordId;
    @api objectName;
    @api arrayFields = [];
    // id del formulario utilizado para identificarlo
    @api formId;


    @api buttonName = '';
    @api buttonVariant = 'brand';
    @api enableButton = false;

    @api
    getRawValues()
    {
        let fieldsForm = this.template.querySelectorAll('lightning-input-field');

        // añado todos los fields y sus values
        let sObjectRecord = {};
        fieldsForm.forEach(function(f) {
            sObjectRecord[f.fieldName] = f.value;
        });

        return sObjectRecord; 
    }

    @api
    getValidity()
    {
        const allValid = [
            ...this.template.querySelectorAll('lightning-input-field'),
        ].reduce((validSoFar, inputCmp) => {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.reportValidity();
        }, true);

        return allValid;
    }

    handleChangeValue(event)
    {
        // Creates the event with the data.
        var eventObj = {formId: this.formId, fieldName: event.target.fieldName, fieldValue: event.target.value};
        const changeFieldValueEvent = new CustomEvent("changefieldvalueevent", {detail:eventObj});

        // Dispatches the event.
        this.dispatchEvent(changeFieldValueEvent);
    }
}