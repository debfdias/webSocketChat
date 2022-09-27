import { container } from "tsyringe";
import { io } from "../http";
import { CreateChatRoomService } from "../services/CreateChatRoomService";
import { CreateMessage } from "../services/CreateMessage";
import { CreateUserService } from "../services/CreateUserService";
import { GetAllUsers } from "../services/GetAllUsers";
import { GetChatRoom } from "../services/GetChatRoom";
import { GetChatRoomById } from "../services/GetChatRoomById";
import { GetMessagesRoom } from "../services/GetMessagesRoom";
import { GetUser } from "../services/GetUser";

io.on("connect", socket => {

  socket.on("start", async (data) => {
    const { email, avatar, name } = data;
    const createUserService = container.resolve(CreateUserService);

    const user = await createUserService.execute({
      email,
      avatar,
      name,
      socket_id: socket.id
    });

    socket.broadcast.emit("new_users", user);
  });

  socket.on("get_users", async (callback) => {
    const getAllUsersService = container.resolve(GetAllUsers);
    const users = await getAllUsersService.execute();

    callback(users);
  });

  socket.on("start_chat", async (data, callback) => {
    const createChatRoomService = container.resolve(CreateChatRoomService); 
    const getUserBySocketIDService = container.resolve(GetUser); 
    const getChatRoom = container.resolve(GetChatRoom);
    const getMessagesRoom = container.resolve(GetMessagesRoom);

    const userLogged = await getUserBySocketIDService.execute(socket.id);
    let room = await getChatRoom.execute([data.idUser, userLogged._id]);

    if(!room){
      room = await createChatRoomService.execute([data.idUser, userLogged._id]);
    }

    socket.join(room.idChatRoom);

    const messages = await getMessagesRoom.execute(room.idChatRoom);

    callback({ room, messages });
  });

  socket.on("message", async data => {
    const userService = container.resolve(GetUser);
    const messageService = container.resolve(CreateMessage);
    const chatRoomService = container.resolve(GetChatRoomById);

    const user = await userService.execute(socket.id);
    const message = await messageService.execute({
      to: user._id,
      text: data.message,
      roomId: data.idChatRoom
    });

    io.to(data.idChatRoom).emit("message", {
      message,
      user
    });

    const room = await chatRoomService.execute(data.idChatRoom);
    const userFrom = room.idUsers.find(res => String(res._id) != String(user.id));

    io.to(userFrom.socket_id).emit("notification", {
      newMessage: true,
      roomId: data.idChatRoom,
      from: user
    })
  });
});