import { CronJob } from "cron";


/**
 * Takes a function and executes it periodically
 */
export function executeByCron(cronTimeExpression: string, process: Function) {
	process()
	var job = new CronJob(cronTimeExpression, function () {
		process()
	}, null, true);

	job.start();
}
