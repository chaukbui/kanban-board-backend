import { Schema , model, Document} from "mongoose"

export enum Status {
    Active = 'active',
    Archived = 'archived',
}

const CardSchema = new Schema(
    {
        id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        columnId: {
            type: String,
            required: false,
        },
        order: {
            type: Number,
            required: false,
        },
        status: {
            type: Status,
            required: false,
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true
        }
    }
)

export interface ICard extends Document {
    id: string;
    name: string;
    description: string;
    columnId: string;
    order: number;
    status: Status;
    createdAt: Date;
    updatedAt: Date;
}

export interface PutCardDto {
    name: string;
    description: string;
    order: number;
    status: Status;
}

export default model<ICard>('Card', CardSchema);
