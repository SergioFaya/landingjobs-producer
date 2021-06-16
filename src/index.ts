import './preStart'; // Must be the first import
import { executeByCron } from "./service/CronExecutor"
import { produceToTopic } from "./kafka/KafkaConnector"
import { getCompanies, getJobsOfCompanies } from "./service/Fetcher"
import { initKafka } from "./kafka/KafkaConnector"
import { LandingJobsApiParams, MAX_LIMIT_RESULTS_API } from "./entity/LandingJobsApiParams";

// https://crontab.cronhub.io/
// const everySecond = "* * * * * *";
// const every10minutes = "* 10 * * * *";


const kafkaHost = process.env.KAFKA_HOST;
const kafkaClientId = process.env.APP_ID;
const cronExpression = process.env.CRON_EXPRESSION;
const topic = process.env.PRODUCE_TO_TOPIC

console.log("PRODUCER CONFIG", {
	KAFKA_HOST: kafkaHost,
	APP_ID: kafkaClientId,
	CRON_EXPRESSION: cronExpression,
	PRODUCE_TO_TOPIC: topic
})

/**
 * Process definition
 */
const companiesLimit = 20;

export type JsonMessage = {
	message: string;
	id: string;
}
export async function fetchAndProduceData() {
	const paramsJobs: LandingJobsApiParams = { offset: 0, limit: MAX_LIMIT_RESULTS_API }
	const paramsCompanies: LandingJobsApiParams = { offset: 0, limit: companiesLimit }

	let companies: LandingJobsCompany[] = await getCompanies(paramsCompanies);

	while (companies.length != 0) {
		paramsCompanies.offset += companiesLimit;

		const jobs = await getJobsOfCompanies(companies, paramsJobs)

		const jsonMessages = await jobs.map((job) => { return { message: JSON.stringify(job), id: job.id.toString() } as JsonMessage });
		produceToTopic(jsonMessages, topic);

		paramsJobs.offset = 0;
		companies = await getCompanies(paramsCompanies)
	}
}


/**
 * Start process
 */
initKafka(kafkaHost, kafkaClientId)
fetchAndProduceData()
executeByCron(cronExpression, fetchAndProduceData);