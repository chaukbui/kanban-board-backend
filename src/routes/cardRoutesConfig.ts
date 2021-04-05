import {CommonRoutesConfig} from './commonRoutesConfig';
import express from 'express';
import CardController from '../controllers/cardController';
import ColumnMiddleware from '../middleware/columnMiddleware';
import CardMiddleware from '../middleware/cardMiddleware';

export class CardRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'CardRoutes');
    }

    configureRoutes() {
        this.app
            .route('/cards')
            .get(CardController.listCards)
            .post(
                CardMiddleware.validateRequiredCardBodyFields,
                ColumnMiddleware.validateBodyColumnExists,
                CardController.createCard
            );

        this.app
            .route('/cards/:cardId')
            .all(CardMiddleware.validateParamCardExists)
            .patch(
                CardMiddleware.validatePatchCardBody,
                CardController.updateCard
            )
            .delete(
                CardController.deleteCard
            );

        this.app
            .route('/cards/:cardId/status')
            .all(CardMiddleware.validateParamCardExists)
            .get(
                CardController.getStatus
            )
            .patch(
                CardController.setStatus
            )

        return this.app;
    }
}
