import { LightningElement, track, api } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CreateRelatedContact extends LightningElement 
{
    @api recordId;

    @track _contactFields =
    [   
        {name: 'Salutation', required:true, readonly: false, showInLeftColumn: true},
        {name: 'FirstName', required:true, readonly: false, showInLeftColumn: false}, 
        {name: 'LastName', required:true, readonly: false, showInLeftColumn: true},
        {name: 'Phone', required:true, readonly: false, showInLeftColumn: false},
        {name: 'Email', required:true, readonly: false, showInLeftColumn: true}
    ];

    @track _opportunityFields =
    [   
        {name: 'CloseDate', required:true, readonly: false, showInLeftColumn: true},
        {name: 'Amount', required:true, readonly: false, showInLeftColumn: false}
    ];

    @track _isSpinner = false;

    handleChangefieldvalue()
    {

    }

    handleSave()
    {
        let forms = this.template.querySelectorAll('c-generic-form');
        let validityForms;
        let formAnsewer = [];

        forms.forEach(function(f) 
        {
            validityForms = validityForms === undefined ? f.getValidity() : validityForms && f.getValidity();
            // recupero el elemento 1, que en el 0 esta el formId
            formAnsewer.push(f.getRawValues());
        });

        if(validityForms)
        {
            formAnsewer[0].AccountId = this.recordId;
            formAnsewer[1].AccountId = this.recordId;
            
            let contactRecord = {apiName: "Contact", fields : formAnsewer[0]};

            this._isSpinner = true;
            createRecord(contactRecord).then((data, error) => {
                formAnsewer[1].ContactId = data.id;
                formAnsewer[1].StageName = "Clientes potenciales";
                formAnsewer[1].Name = `${data.fields.FirstName.value} ${data.fields.LastName.value} Opportunity`;
                let opportunityRecord = {apiName: "Opportunity", fields : formAnsewer[1]};
                createRecord(opportunityRecord).then(() => {
                    forms.forEach(function(f) 
                    {
                        f.getResetValue();
                    });

                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Se ha guardado correctamente',
                            variant: 'success'
                        })
                    );
                    this.dispatchEvent( new CustomEvent( 'refresh'));
                    
                    this._isSpinner = false;
                });
            }).catch(error => {
                this._isSpinner = false;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error al guardar el registro',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
                
            });
        }
    }
}