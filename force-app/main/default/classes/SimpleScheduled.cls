global class SimpleScheduled Implements Schedulable {
    global void execute(SchedulableContext sc) {
        testJob();
    }
    public void testJob() {
        System.debug('Inside Scheduled Job');
    }
}