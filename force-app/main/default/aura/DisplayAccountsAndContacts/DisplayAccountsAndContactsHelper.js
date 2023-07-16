({
	executeAction: function (component, action) {
        return new Promise(
            function (resolve, reject) {
                action.setCallback(
                    this,
                    function (response) {
                        var state = response.getState();
                        if (state === "SUCCESS") {
                            var retVal = response.getReturnValue();
                            resolve(retVal);
                        }
                        else if (state === "ERROR") {
                            var errors = response.getError();
                            if (errors) {
                                if (errors[0] && errors[0].message) {
                                    reject(Error("Error message: " + errors[0].message));
                                }
                            } else {
                                reject(Error("Unknown error"));
                            }
                        }
                    });
                $A.enqueueAction(action);
            }
        );
    },
    displayToast: function (message, duration, type, mode) {
        $A.get("e.force:showToast").setParams({
            message: message,
            duration: duration,
            type: type,
            mode: mode
        }).fire();
    },
    showSpinner: function (component, helper, elementId) {
        var spinner = component.find(elementId);
        $A.util.removeClass(spinner, 'slds-hide');
    },
    hideSpinner: function (component, helper, elementId) {
        var spinner = component.find(elementId);
        $A.util.addClass(spinner, 'slds-hide');
    },
    getAccountsAndContacts: function (component, helper) {
        var action = component.get("c.getAccountsAndContacts");
        var actionPromise = this.executeAction(component, action);
        actionPromise.then(
            $A.getCallback(function (result) {
                console.log(result);
                result = JSON.parse(result);
                let accountsAndContacts = [];
                result.forEach(function(sObjList) {
                    sObjList.forEach(function(row) {
                        let newRow = {
                            'Name' : row.Name ? row.Name : '',
                            'AccountSource' : row.AccountSource ? row.AccountSource : '',
                            'NumberOfEmployees' : row.NumberOfEmployees ? row.NumberOfEmployees : '',
                            'CleanStatus' : row.CleanStatus ? row.CleanStatus : '',
                            'Birthdate' : row.Birthdate ? row.Birthdate : ''
                        }
                        accountsAndContacts.push(newRow);
                    });
                });
                component.set('v.accountsAndContacts', accountsAndContacts);
                helper.hideSpinner(component, helper, 'componentSpinner');
            }),
            $A.getCallback(function (error) {
                // Something went wrong
                helper.hideSpinner(component, helper, 'componentSpinner');
                console.log(JSON.stringify(error));
                helper.displayToast(error.message, '2000', 'error', 'dismissible');
            })
        );
    }
})