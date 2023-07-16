({
	doInit : function(component, event, helper) {
		component.set('v.columns', [
            {label: 'First Name', fieldName: 'FirstName', type: 'text'},
            {label: 'Last Name', fieldName: 'LastName', type: 'text'},
            {label: 'Email', fieldName: 'contact', type: 'email'}
        ]);
	}
})