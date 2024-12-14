import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type SubscriberDocument = HydratedDocument<Subscriber>;
@Schema({ timestamps: true })
export class Subscriber {
  @Prop()
  email: string;

  @Prop()
  name: string;

  @Prop((type) => [String])
  skills: string[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt: Date;

  @Prop()
  isDeleted: boolean;

  @Prop({ type: Object })
  createdBy: { _id: mongoose.Schema.Types.ObjectId; email: string };

  @Prop({ type: Object })
  updatedBy: { _id: mongoose.Schema.Types.ObjectId; email: string };

  @Prop({ type: Object })
  deletedBy: { _id: mongoose.Schema.Types.ObjectId; email: string };
}

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);
