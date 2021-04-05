import express from 'express';
import debug from 'debug';
import Card from "../components/board/card";
import { Status } from "../components/board/card";

const debugLog: debug.IDebugger = debug('app:card-middleware');
class CardMiddleware {

    async validateRequiredCardBodyFields(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.body && req.body.name && req.body.description) {
            next();
        } else {
            res.status(400).send({
                error: 'Missing required fields name and description',
            });
        }
    }

    async validateParamCardExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const cardId = req.params.cardId;
        if (cardId !== null) {
            const card = await Card.findOne({ id: cardId });
            if (card !== null) {
                next();
                return;
            }
        }
        res.status(400).send({
            error: 'Card not found',
        });
    }

    async validatePatchCardBody(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.body && (req.body.name || req.body.description || req.body.status || 'order' in req.body)) {
            if ('order' in req.body) {
                if (req.body.order === null || isNaN(req.body.order)) {
                    res.status(400).send({
                        error: 'Invalid order',
                    });
                    return;
                }
                const newOrder = parseInt(req.body.order);
                // validate new card order
                const card = await Card.findOne({id: req.params.cardId});
                if (card !== null) {
                    const numCardsInSameColumn = await Card.count({columnId: card.columnId});
                    if (newOrder < 1 || newOrder > numCardsInSameColumn) {
                        res.status(400).send({
                            error: 'New order out of range',
                        });
                        return;
                    }
                } else {
                    res.status(400).send({
                        error: 'Card not found',
                    });
                    return;
                }
            }
            if (req.body.status && !Object.values(Status).includes(req.body.status)) {
                res.status(400).send({
                    error: 'Invalid status (must be active or archived)',
                });
                return;
            }
            next();
        } else {
            res.status(400).send({
                error: 'Missing required fields from name, description, order or status',
            });
        }
    }
}

export default new CardMiddleware();
