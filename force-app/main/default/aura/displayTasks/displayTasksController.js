({
	getRecords: function(component, event, helper) {
		helper.getContacts(component, helper);
	},
    /*
    editTask: function(component, event, helper) {
		let taskId = event.getSource().get("v.name");
        console.log(taskId);
        var editRecordEvent = $A.get("e.force:editRecord");
        editRecordEvent.setParams({
            "recordId": taskId
        });
        editRecordEvent.fire();
	},
    deleteTask: function(component, event, helper) {
		let taskId = event.getSource().get("v.name");
        console.log(taskId);
        helper.deleteTask(component, helper, taskId);
	}
    */
})