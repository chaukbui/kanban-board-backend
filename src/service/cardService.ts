import Card, {  PutCardDto } from "../components/board/card";
import { v4 as uuid } from 'uuid';
import { Status } from "../components/board/card";
import debug from 'debug';

const debugLog: debug.IDebugger = debug('app:card-service');

class CardService {
    async list() {
        const cards = await Card.find().sort({columnId: 'asc', order: 'asc'});
        return cards;
    }

    async createCard(name: string, description: string, columnId: string) {
        const numCardsInSameColumn = await Card.count({ columnId: columnId });
        let card = new Card({
            id: uuid(),
            name: name,
            description: description,
            status: Status.Active,
            columnId: columnId,
            order: numCardsInSameColumn + 1, // push to end of column
        });
        return card.save();
    }

    async deleteCard(cardId: string) {
        const card = await Card.findOne({ id: cardId });
        if (card !== null) {
            await card.delete();
            // shift the order of cards after the deleted card in the same column
            const cardsAfter = await Card.find({columnId: card.columnId, order: { $gt: card.order } });
            for (var cardAfter of cardsAfter) {
                cardAfter.order -= 1;
                await cardAfter.save();
            }
        }
    }

    private async changeOrder(cardId: string, newOrder: number) {
        const card = await Card.findOne({ id: cardId });
        if (card === null) {
            return;
        }
        const currentOrder = card.order;
        if (currentOrder == newOrder) {
            return card;
        }
        // switch with card in the same column at new order
        debugLog(`Move card ${cardId} from order ${currentOrder} to ${newOrder}`);
        await Card.findOneAndUpdate({ columnId: card.columnId, order: newOrder }, { order: currentOrder });
        card.order = newOrder;
        return await card.save();
    }

    async updateCard(cardId: string, update: PutCardDto) {
        if (update.order) {
            await this.changeOrder(cardId, update.order);
        }
        return await Card.findOneAndUpdate({id: cardId}, update, {new: true});
    }

    async getStatus(cardId: string) {
        const card = await Card.findOne({ id: cardId });
        return card?.status;
    }

    async setStatus(cardId: string, status: Status) {
        let card = await Card.findOne({ id: cardId });
        if (card === null) {
            return;
        }
        card.status = status;
        return await card.save();
    }
}

export default new CardService();
