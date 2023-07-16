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
    validateContacts: function (contacts) {
        return true;
    },
    getContacts: function (component, helper) {
        var action = component.get("c.getContacts");
        var actionPromise = this.executeAction(component, action);
        actionPromise.then(
            $A.getCallback(function (result) {
                console.log(result);
                result = JSON.parse(result);
                if (result.success) {
                    result.result.forEach(function (contact) {
                        if (contact.Account) {
                            contact.AccountName = contact.Account.Name;
                        }
                    });
                    component.set('v.contacts', result.result);
                }
                helper.hideSpinner(component, helper, 'componentSpinner');
            }),
            $A.getCallback(function (error) {
                // Something went wrong
                helper.hideSpinner(component, helper, 'componentSpinner');
                console.log(JSON.stringify(error));
                helper.displayToast(error.message, '2000', 'error', 'dismissible');
            })
        );
    },
    saveContacts: function (component, helper, contacts) {
        helper.showSpinner(component, helper, 'componentSpinner');
        var action = component.get("c.saveContacts");
        action.setParams({
            "JSONContacts": JSON.stringify(contacts)
        });
        var actionPromise = this.executeAction(component, action);
        actionPromise.then(
            $A.getCallback(function (result) {
                result = JSON.parse(result);
                if (result.success) {
                    component.set('v.newContacts', [{}]);
                    helper.getContacts(component, helper);
                    helper.displayToast(result.message, '2000', 'success', 'dismissible');
                } else {
                    helper.displayToast(result.message, '2000', 'error', 'dismissible');
                }
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