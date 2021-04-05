import Column, { PutColumnDto } from "../components/board/column";
import Card from "../components/board/card";
import { v4 as uuid } from 'uuid';
import debug from 'debug';

const debugLog: debug.IDebugger = debug('app');

class ColumnService {
    async list() {
        return await Column.find().sort({order: 'asc'});
    }

    async listCardsInColumn(columnId: string) {
        return await Card.find({columnId: columnId}).sort({order: 'asc'});
    }

    async createColumn(name: string) {
        const numColumn = await Column.count();
        let column = new Column({
            id: uuid(),
            name: name,
            order: numColumn + 1,
        });
        return await column.save();
    }

    async deleteColumn(columnId: string) {
        const column = await Column.findOne({ id: columnId });
        if (column !== null) {
            // delete cards in column
            const cards = await Card.find({ columnId: columnId });
            for (var card of cards) {
                await card.delete();
                debugLog('Deleted card ' + card.id);
            }
            // delete column
            await column.delete();
            // shift the order of columns after the deleted column
            const columnsAfter = await Column.find({ order: { $gt: column.order } });
            for (var columnAfter of columnsAfter) {
                columnAfter.order -= 1;
                await columnAfter.save();
            }
        }
    }


    private async changeOrder(columnId: string, newOrder: number) {
        const column = await Column.findOne({ id: columnId });
        if (column === null) {
            return;
        }
        const currentOrder = column.order;
        await Column.findOneAndUpdate({ order: newOrder }, { order: currentOrder });
        column.order = newOrder;
        return await column.save();
    }

    async updateColumn(columnId: string, update: PutColumnDto) {
        if (update.order) {
            await this.changeOrder(columnId, update.order);
        }
        return await Column.findOneAndUpdate({ id: columnId }, update, { new: true });
    }
}

export default new ColumnService();
