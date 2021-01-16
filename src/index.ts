import { executeByCron } from "./service/CronService"
import { getLandingJobsData } from "./service/JobsManager"
import { initKafka, produceToTopic } from "./kafka/LandingJobsProducer"

// https://crontab.cronhub.io/
const everySecond = "* * * * * *";
const every10minutes = "* 10 * * * *";
const kafka_host = "localhost:9092";
const topic = "topic1"

async function produceJobsToTopic() {
	const jobs = await getLandingJobsData()
	const messages = jobs.map((job) => {
		return JSON.stringify(job)
	})
	produceToTopic(messages, topic)
}
/**
 * Start process
 */
initKafka(kafka_host)
executeByCron(every10minutes, produceJobsToTopic);
