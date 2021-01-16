import { Kafka, Message } from "kafkajs";

var kafka: Kafka;

export const initKafka = (kafkaHost: string) => {
	kafka = new Kafka({
		clientId: 'landingjobs-producer',
		brokers: [].concat(kafkaHost)
	})
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
	await producer.disconnect()
}
