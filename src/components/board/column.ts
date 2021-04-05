import { Schema, model, Document } from "mongoose"

const ColumnSchema = new Schema(
    {
        id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        order: {
            type: Number,
            required: true,
        },
    }
)

export interface IColumn extends Document {
    id: string;
    name: string;
    order: number;
}

export interface PutColumnDto {
    name: string;
    order: number;
}

export default model<IColumn>('Column', ColumnSchema);
