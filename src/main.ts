import { type DataConnection } from "peerjs";
import { PeerConfig } from "./config";
import { plitSize } from "./global";
import { Plither } from "./plither";

const peer_span = document.getElementById("my-id") as HTMLSpanElement;
const points_span = document.getElementById("points") as HTMLSpanElement;

const peer_config = new PeerConfig();
const peer = peer_config.getPeer();
const canvas = document.getElementById("main_canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
const players: Plither[] = [];

const plither = new Plither();
players.push(plither);

peer.on("open", (id) => {
  peer_span.innerText = id;
});
peer.on("connection", (connection) => {
  setupConnection(connection);
});

export function setupConnection(connection: DataConnection) {
  connection.on("data", (data) => {
    const data_plits = data as {
      id: string;
      plits: { x: number; y: number; nextPos: { x: number; y: number } }[];
    };

    if (!ctx || !data) return;

    let player = players.find((player) => {
      return player.getId() === data_plits.id;
    });
    if (!player) {
      console.log(players);
      console.log("remote id", data_plits.id);
      player = new Plither(data_plits.id, data_plits.plits);
      players.push(player);
    } else {
      player.setPlits(data_plits.plits);
    }
  });
}

const setupConnectionInput = () => {
  const button = document.getElementById("connect_button") as HTMLButtonElement;
  button.onclick = connectPeers;
};

const connectPeers = () => {
  const input = document.getElementById("peer_id") as HTMLInputElement;
  const peer_id = input.value;
  if (peer_id) {
    peer_config.connectToPeer(peer_id);
  }
};

setupConnectionInput();

let keys: { [key: string]: boolean } = {};
let running = false;

function move() {
  running = true;
  if (keys["ArrowRight"]) plither.moveXpos(1);
  if (keys["ArrowLeft"]) plither.moveXpos(-1);
  if (keys["ArrowUp"]) plither.moveYpos(-1);
  if (keys["ArrowDown"]) plither.moveYpos(1);

  if (Object.values(keys).some(Boolean)) {
    requestAnimationFrame(move); // Continue tant qu'une touche est pressée
  } else {
    running = false;
  }
}

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if (!running) move();
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

const tick = () => {
  if (!ctx) return;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  players.forEach((player) => {
    const positions = player.getPlitherPositions();
    positions.plits.forEach((pos, index) => {
      pos.x = (pos.x + canvas.width) % canvas.width;
      pos.y = (pos.y + canvas.height) % canvas.height;

      if (index === 0) {
        ctx.fillStyle = "red";
        players.forEach((player_collision) => {
          if (player.getId() !== player_collision.getId()) {
            if (player_collision.checkCollision(pos)) {
              player_collision.respawn(canvas.width, canvas.height);
              player.addPoint();
              points_span.innerText = player.getPoints().toString();
            }
          }
        });
      } else {
        ctx.fillStyle = "blue";
      }
      ctx.fillRect(pos.x, pos.y, plitSize, plitSize);
      peer_config.getConnections().forEach((connection) => {
        connection.send(positions);
      });
    });
  });
};

setInterval(tick, 5);
