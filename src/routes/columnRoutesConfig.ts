import {CommonRoutesConfig} from './commonRoutesConfig';
import express from 'express';
import ColumnController from '../controllers/columnController';
import ColumnMiddleware from '../middleware/columnMiddleware';

export class ColumnRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'ColumnRoutes');
    }

    configureRoutes() {
        this.app
            .route('/columns')
            .get(ColumnController.listColumns)
            .post(
                ColumnMiddleware.validateRequiredColumnName,
                ColumnController.createColumn
            );

        this.app
            .route('/columns/:columnId')
            .all(ColumnMiddleware.validateParamColumnExists)
            .get(ColumnController.listCardsInColumn)
            .patch(
                ColumnMiddleware.validatePatchColumnBody,
                ColumnController.updateColumn
            )
            .delete(
                ColumnController.deleteColumn
            );
        return this.app;
    }
}
