import express from "express";
import auth from "./auth";
import socketManager from "./server-socket";
import lobbyManager from "./lobbies";
const router = express.Router();

const NO_USER = "no user :(";
const NO_ROOM_CODE = "no room code :(";

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
/*
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
    res.status(400).send(NO_USER);
  }
});

//TODO: get rid of SHOULD NOT BE USED FOR NON-DEBUG PURPOSES
router.get("/what-is-my-socket-id", (req, res) => {
  if (req.user) {
    const userSocket = socketManager.getSocketFromUserID(req.user._id);
    res.send({id: userSocket?.id});
  }
});*/

router.post("/create-lobby", (req, res) => {
  if (req.user){
    if (lobbyManager.isCurrentlyActive(req.user)){
      const msg = `${req.user._id} is currently active`;
      return res.status(400).send(msg);
    }
    const roomCode = lobbyManager.createRoom(req.user);
    res.send({code: roomCode});
  } else {
    res.status(400).send(NO_USER);
  }
});

router.post("/start-game", (req, res) => {
  const roomCode = req.body.roomCode;
  if(typeof roomCode!=="string"){
    return res.status(400).send(NO_ROOM_CODE);
  }
  if(!req.user){
    return res.status(400).send(NO_USER);
  }
  lobbyManager.startGame(req.user, roomCode).then(() =>
    {res.send({});}
  );
});

router.post("/join-lobby", (req, res) => {
  if(req.user){
    if (lobbyManager.isCurrentlyActive(req.user)){
      const msg = `${req.user._id} is currently active`;
      return res.status(400).send(msg);
    }
    lobbyManager.joinRoom(req.user, req.body.roomCode);
    res.send({code: req.body.roomCode});
  } else {
    res.status(400).send(NO_USER);
  }
});

router.post("/rejoin-lobby", (req, res) => {
  if(req.user){
    if (lobbyManager.isCurrentlyActive(req.user)){
      return res.send({});
    }
    lobbyManager.joinRoom(req.user, req.body.roomCode);
    res.send({code: req.body.roomCode});
  } else {
    res.status(400).send(NO_USER);
  }
});

router.post("/leave-game", (req, res) => {
  if(req.user){
    lobbyManager.kickUser(req.user);
    res.send({});
  } else {
    res.status(400).send(NO_USER);
  }
});

//TODO: validate input
router.get("/lobby", (req, res) => {
  const roomCode = req.query.roomCode;
  if(typeof roomCode!=="string"){
    return res.status(400).send(NO_ROOM_CODE);
  }
  if (!req.user) {
    return res.status(400).send(NO_USER);
  }
    lobbyManager.getRoom(req.user, roomCode).then((userData) => {
      if(userData){
        res.send({
          userData: userData, 
          roomExists: true
        });
      } else {
        res.send({
          userData: {},
          roomExists: false
        });
      }
    });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  const msg = `Api route not found: ${req.method} ${req.url}`;
  res.status(404).send({ msg });
});

export default router;
