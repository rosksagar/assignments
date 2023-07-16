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
    getContacts: function (component, helper) {
        var action = component.get("c.getContacts");
        action.setParams({
            'searchStr': component.get("v.searchStr")
        });
        var actionPromise = this.executeAction(component, action);
        actionPromise.then(
            $A.getCallback(function (result) {
                console.log(result);
                result = JSON.parse(result);
                component.set('v.contacts', result);
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
    /*
    getAccountOppoutunityTasks: function (component, helper) {
        var action = component.get("c.getAccountOppoutunityTasks");
        action.setParams({
            'AccountId': component.get("v.AccountId")
        });
        var actionPromise = this.executeAction(component, action);
        actionPromise.then(
            $A.getCallback(function (result) {
                console.log(result);
                result = JSON.parse(result);
                let Tasks = [];
                result.forEach(function(row) {
                    let newRow = {
                        'Id' : row.Id ? row.Id : '',
                        'Subject' : row.Subject ? row.Subject : '',
                    }
                    Tasks.push(newRow);
                });
                component.set('v.Tasks', Tasks);
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
    deleteTask: function (component, helper, TaskId) {
        var action = component.get("c.deleteTask");
        action.setParams({
            'TaskId': TaskId
        });
        var actionPromise = this.executeAction(component, action);
        actionPromise.then(
            $A.getCallback(function (result) {
                console.log(result);
                helper.getAccountOppoutunityTasks(component, helper);
            }),
            $A.getCallback(function (error) {
                // Something went wrong
                helper.hideSpinner(component, helper, 'componentSpinner');
                console.log(JSON.stringify(error));
                helper.displayToast(error.message, '2000', 'error', 'dismissible');
            })
        );
    }
    */
})