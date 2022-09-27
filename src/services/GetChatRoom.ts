import { ObjectId } from "mongoose";
import { inject, injectable } from "tsyringe";
import { ChatRoom } from "../schemas/ChatRoom";

@injectable()
class GetChatRoom {
  async execute(idUsers: ObjectId[]) {
    const room = await ChatRoom.findOne({
      idUsers: {
        $all: idUsers
      }
    }).exec();

    return room;
  }
}

export { GetChatRoom };