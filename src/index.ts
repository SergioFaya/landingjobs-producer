import { executeByCron } from "./service/CronService"
import { produceToTopic } from "./kafka/LandingJobsProducer"
import { getCompanies, getJobsOfCompanies } from "./service/JobsManager"
import { initKafka } from "./kafka/LandingJobsProducer"
import { LandingJobsApiParams, MAX_LIMIT_RESULTS_API } from "./entity/LandingJobsApiParams";

// https://crontab.cronhub.io/
const everySecond = "* * * * * *";
const every10minutes = "* 10 * * * *";

const kafka_host = "localhost:9092";
const kafkaClientId = "landingjobs-producer";
const topic = "topic1"


/**
 * Process definition
 */
const companiesLimit = 20;

export async function fetchAndProduceData() {
	const paramsJobs: LandingJobsApiParams = { offset: 0, limit: MAX_LIMIT_RESULTS_API }
	const paramsCompanies: LandingJobsApiParams = { offset: 0, limit: companiesLimit }

	let companies: LandingJobsCompany[] = await getCompanies(paramsCompanies);

	while (companies.length != 0) {
		paramsCompanies.offset += companiesLimit;

		const jobs = await getJobsOfCompanies(companies, paramsJobs)

		const jsonMessages = await jobs.map((job) => { return JSON.stringify(job) });
		console.log(jsonMessages)
		produceToTopic(jsonMessages, topic);

		paramsJobs.offset = 0;
		companies = await getCompanies(paramsCompanies)
	}
}


/**
 * Start process
 */
initKafka(kafka_host, kafkaClientId)
fetchAndProduceData()
// executeByCron(every10minutes, fetchAndProduceData);