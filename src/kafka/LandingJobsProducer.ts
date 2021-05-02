import { Kafka, Message } from "kafkajs";
import { logger } from '../logger/Logger'
var kafka: Kafka;

export const initKafka = (kafkaHost: string, kafkaClientId: string) => {
	kafka = new Kafka({
		clientId: kafkaClientId,
		brokers: [].concat(kafkaHost)
	})
}

function logMessages(messages) {
	messages.forEach(element => {
		logger.info(element)
	});
}


export const produceToTopic = async (messages: string[], topic: string) => {
	const producer = kafka.producer()

	const formattedMessages = messages.map((message) => {
		const mes: Message = {
			value: message
		}
		return mes
	});

	await producer.connect()
	await producer.send({
		topic: topic,
		messages: formattedMessages,
	})
		.then(() => {
			console.log(`Produced messages: ${messages} \n`);
			logMessages(messages)
		})
		.catch(err => console.error(`Error when producing: ${err} \n`))

	await producer.disconnect()
}
