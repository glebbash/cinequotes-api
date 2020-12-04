import { PubSub } from '@google-cloud/pubsub'
import { PUBSUB_TOPIC, PUBSUB_SUBSCRIPTION } from './constants'

export async function setupPubSub(pubsub: PubSub) {
    const topic = pubsub.topic(PUBSUB_TOPIC)
    if (!(await topic.exists())[0]) {
        await topic.create()
    }
    const subscription = topic.subscription(PUBSUB_SUBSCRIPTION)
    if (!(await subscription.exists())[0]) {
        await subscription.create()
    }
}
