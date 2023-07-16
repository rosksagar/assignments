({
    doInit: function (component, event, helper) {
        component.set('v.newContacts', [{}]);
        component.set('v.columns', [
            { label: 'Name', fieldName: 'Name', type: 'text' },
            { label: 'Email', fieldName: 'Email', type: 'email' },
            { label: 'Account Name', fieldName: 'AccountName', type: 'text' }
        ]);
        helper.getContacts(component, helper);
    },
    addContact: function (component, event, helper) {
        let newContacts = component.get('v.newContacts');
        newContacts.push({});
        component.set('v.newContacts', newContacts);
    },
    callSaveContacts: function (component, event, helper) {
        let newContacts = component.get("v.newContacts");
        // Check for validation
        console.log(JSON.stringify(newContacts));
        if (helper.validateContacts(newContacts)) {
            helper.saveContacts(component, helper, newContacts);
        }
    }
})