import express from "express";
import auth from "./auth";
import socketManager from "./server-socket";
import lobbyManager from "./lobbies";
const router = express.Router();

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // Not logged in.
    return res.send({});
  }
  res.send(req.user);
});
router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) {
    const socket = socketManager.getSocketFromSocketID(req.body.socketid);
    if (socket !== undefined) socketManager.addUser(req.user, socket);
  }
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

//TODO: really scuffed, change later, SHOULD NOT BE USED FOR NON-DEBUG PURPOSES
router.get("/lobbies", (req, res) => {
  if (req.user){
    const rooms = lobbyManager.getRooms();
    let ans = {};
    const keys = [...rooms.keys()];
    for (let k of keys){
      let arr : Array<string> = []
      for (let v of rooms.get(k)!){
        arr.push(v);
      }
      ans[k] = arr;
    }
    res.send(ans);
  } else {
    res.send("no user :(");
  }
});

//TODO: get rid of SHOULD NOT BE USED FOR NON-DEBUG PURPOSES
router.get("/what-is-my-socket-id", (req, res) => {
  if (req.user) {
    const userSocket = socketManager.getSocketFromUserID(req.user._id);
    res.send({id: userSocket?.id});
  }
});

router.post("/create-lobby", (req, res) => {
  if (req.user){
    const roomCode = lobbyManager.createRoom(req.user);
    res.send({code: roomCode});
  } else {
    res.send("no user :(");
  }
});

router.post("/join-lobby", (req, res) => {
  if(req.user){
    lobbyManager.joinRoom(req.user, req.body.roomCode);
    res.send({code: req.body.roomCode});
  } else {
    res.send("no user :(");
  }
});

//TODO: validate input
router.get("/lobby", (req, res) => {
  const roomCode = req.query.roomCode as string;
  if(req.user){
    lobbyManager.getRoom(req.user, roomCode).then((users) => {
      if(users){
        res.send({
          users: users, 
          roomExists: true
        });
      } else {
        res.send({
          users: [],
          roomExists: false
        });
      }
    });
  } else {
    res.send("no user :(");
  }
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  const msg = `Api route not found: ${req.method} ${req.url}`;
  res.status(404).send({ msg });
});

export default router;
