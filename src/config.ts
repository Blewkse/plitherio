import Peer, { DataConnection } from "peerjs";
import { setupConnection } from "./main";

export class PeerConfig {
  private peer: Peer;
  private connections: DataConnection[] = [];
  constructor() {
    this.initPeer();
  }

  initPeer = () => {
    this.peer = new Peer();
    this.peer.on("open", (id) => {
      console.log("My peer ID is: " + id);
    });

    this.peer.on("connection", (conn) => {
      this.addConnection(conn);
    });

    this.peer.on("disconnected", function () {
      console.log("Connection lost. Please reconnect");
    });

    this.peer.on("close", function () {
      this.setConn(null);
      console.log("Connection destroyed");
    });

    this.peer.on("error", function (err) {
      console.log(err);
      alert("" + err);
    });
  };
  connectToPeer = (peerId: string) => {
    if (!this.peer) {
      console.log("Peer not initialized");
      return;
    }
    const conn = this.peer.connect(peerId);
    conn.on("open", () => {
      this.addConnection(conn);
    });
    setupConnection(conn);
  };
  getPeer = () => this.peer;
  addConnection = (connection: DataConnection) => {
    this.connections.push(connection);
  };

  getConnections = () => this.connections;
}
