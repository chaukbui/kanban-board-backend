import express from 'express';
import debug from 'debug';
import Column from "../components/board/column";

class ColumnMiddleware {

    async validateBodyColumnExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const columnId = req.body.columnId;
        if (columnId !== null) {
            const column = await Column.findOne({id: columnId});
            if (column !== null) {
                next();
                return;
            }
        }
        res.status(400).send({
            error: 'Column not found',
        });
    }

    async validateParamColumnExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const columnId = req.params.columnId;
        if (columnId !== null) {
            const column = await Column.findOne({id: columnId});
            if (column !== null) {
                next();
                return;
            }
        }
        res.status(400).send({
            error: 'Column not found',
        });
    }

    async validateRequiredColumnName(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.body && req.body.name) {
            next();
        } else {
            res.status(400).send({
                error: 'Missing required field name',
            });
        }
    }

    async validatePatchColumnBody(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.body && (req.body.name || 'order' in req.body)) {
            if ('order' in req.body) {
                if (req.body.order === null || isNaN(req.body.order)) {
                    res.status(400).send({
                        error: 'Invalid order',
                    });
                    return;
                }
                const newOrder = parseInt(req.body.order);
                const numColumns = await Column.count();
                if (newOrder < 1 || newOrder > numColumns) {
                    res.status(400).send({
                        error: 'New order out of range',
                    });
                    return;
                }
            }
            next();
        } else {
            res.status(400).send({
                error: 'Missing required field name or order',
            });
        }
    }
}

export default new ColumnMiddleware();
