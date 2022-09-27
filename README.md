# WebSocket Chat
A real time chat application using socket.io.

## :rocket: Technologies
This project was made using the following technologies:

* [TypeScript](https://www.typescriptlang.org/)  
* [Socket.io](https://socket.io/)
* [Mongo](https://www.mongodb.com/)


## :computer: How to run

```bash
# Clone repository
$ git clone https://github.com/debfdias/webSocketChat/

# Access folder 
$ cd webSocketChat
```

```bash
# Install dependencies
$ yarn

# Run migrations
$ yarn prisma migrate dev

# Run aplication
$ yarn dev

# Access http://localhost:3333/
```

### ⚙️ Database connection

```bash
# Create a Mongo collection and edit the http.ts file
$ "mongodb://localhost/[YOUR_COLLECTION]"

# Add user and password if it's required

```

### :whale: Docker

You can also use Docker to create your MongoDB container:

```bash
# Create mongo database
$ docker run -p 27017:27017 --name mymongo -d -t mongo
```

## :page_facing_up: License

This project is licensed under the [MIT license](./LICENSE.md).
