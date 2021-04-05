import express from 'express';
import CardService from '../service/cardService';
import { Status } from "../components/board/card";
import debug from 'debug';

const debugLog: debug.IDebugger = debug('app:card-controller');

class CardController {

    async listCards(req: express.Request, res: express.Response) {
        let cards = await CardService.list();
        res.status(200).send(cards);
    }

    async createCard(req: express.Request, res: express.Response) {
        const { name, description, columnId } = req.body;
        const card = await CardService.createCard(name, description, columnId);
        if (card !== null) {
            res.status(201).send(card);
        } else {
            res.status(400).send({
                error: 'Failed to create card',
            });
        }
    }

    async deleteCard(req: express.Request, res: express.Response) {
        const cardId = req.params.cardId;
        await CardService.deleteCard(cardId);
        res.status(200).send('Successfully deleted card ' + cardId);
    }

    async updateCard(req: express.Request, res: express.Response) {
        const card = await CardService.updateCard(req.params.cardId, req.body);
        res.status(200).send(card);
    }

    async getStatus(req: express.Request, res: express.Response) {
        const status = await CardService.getStatus(req.params.cardId);
        res.status(200).send(status);
    }

    async setStatus(req: express.Request, res: express.Response) {
        if (req.body && 'set_active' in req.body) {
            const card = await CardService.setStatus(req.params.cardId, req.body.set_active ? Status.Active : Status.Archived);
            res.status(200).send(card);
        } else {
            res.status(400).send({
                error: 'Missing required boolean field set_active',
            });
        }
    }
}

export default new CardController();
