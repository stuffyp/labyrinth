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


router.get("/lobbies", (req, res) => {
  if (req.user){
    res.send(lobbyManager.getRooms());
  } else {
    res.send("no user :(");
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
    res.send({});
  } else {
    res.send("no user :(");
  }
});

router.post("/disconnect-lobby", (req, res) => {
  if(req.user){
    lobbyManager.disconnectUser(req.user);
    lobbyManager.cleanUpRooms();
    res.send({});
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
