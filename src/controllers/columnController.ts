import express from 'express';
import ColumnService from '../service/columnService';

class ColumnController {

    async listColumns(req: express.Request, res: express.Response) {
        const columns = await ColumnService.list();
        res.status(200).send(columns);
    }

    async listCardsInColumn(req: express.Request, res: express.Response) {
        const columns = await ColumnService.listCardsInColumn(req.params.columnId);
        res.status(200).send(columns);
    }

    async createColumn(req: express.Request, res: express.Response) {
        const column = await ColumnService.createColumn(req.body.name);
        res.status(201).send(column);
    }

    async deleteColumn(req: express.Request, res: express.Response) {
        const columnId = req.params.columnId;
        await ColumnService.deleteColumn(columnId);
        res.status(200).send('Successfully deleted column ' + columnId);
    }

    async updateColumn(req: express.Request, res: express.Response) {
        const column = await ColumnService.updateColumn(req.params.columnId, req.body);
        res.status(200).send(column);
    }
}

export default new ColumnController();
