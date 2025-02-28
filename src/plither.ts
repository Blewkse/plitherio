import { plitSize } from "./global";

type Plit = {
  x: number;
  y: number;
  nextPos: { x: number; y: number } | null;
};

export class Plither {
  private id: string;
  private plits: Plit[] = [];
  private points: number = 0;

  constructor(id?: string, plits?: Plit[]) {
    if (id) {
      this.id = id;
    } else {
      this.id = randomString(10);
    }
    if (plits) {
      this.plits = plits;
    } else {
      this.plits = generatePlits();
    }
  }
  public getLength(): number {
    return this.plits.length;
  }
  public async moveXpos(direction: -1 | 1): Promise<void> {
    for (let i = 0; i < this.plits.length; i++) {
      const plit = this.plits[i];
      if (i === 0) {
        plit.x += direction * plitSize;
      } else if (plit.nextPos) {
        plit.x = plit.nextPos.x;
        plit.y = plit.nextPos.y;
        plit.nextPos = { x: this.plits[i - 1].x, y: this.plits[i - 1].y };
      } else {
        plit.nextPos = {
          x: this.plits[i - 1].x,
          y: this.plits[i - 1].y,
        };
      }
    }
    return;
  }
  public async moveYpos(direction: -1 | 1): Promise<void> {
    for (let i = 0; i < this.plits.length; i++) {
      const plit = this.plits[i];

      if (i === 0) {
        plit.y += direction * plitSize;
      } else if (plit.nextPos) {
        plit.x = plit.nextPos.x;
        plit.y = plit.nextPos.y;
        plit.nextPos = { x: this.plits[i - 1].x, y: this.plits[i - 1].y };
      } else {
        plit.nextPos = {
          x: this.plits[i - 1].x,
          y: this.plits[i - 1].y,
        };
      }
    }
    return;
  }
  public getId(): string {
    return this.id;
  }

  public getPlitherPositions(): { id: string; plits: Plit[] } {
    return {
      id: this.id,
      plits: this.plits,
    };
  }

  public setPlits(plits: Plit[]): void {
    this.plits = plits;
  }

  public checkCollision({ x, y }: { x: number; y: number }): boolean {
    const head = { x, y };
    console.log("head", head);
    for (let i = 0; i < this.plits.length; i++) {
      const differenceX = Math.abs(head.x - this.plits[i].x);
      const differenceY = Math.abs(head.y - this.plits[i].y);
      if (differenceX < plitSize && differenceY < plitSize) {
        console.log("head", head);
        console.log("plit", this.plits[i]);
        return true;
      }
    }
    return false;
  }

  public addPoint(): void {
    this.points += 1;
  }

  public getPoints(): number {
    return this.points;
  }

  public respawn(canvasWidth: number, canvasHeight: number): void {
    this.plits = generatePlits(
      getRandomArbitrary(0, canvasWidth),
      getRandomArbitrary(0, canvasHeight)
    );
    console.log(this.plits);
  }
}
function randomString(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function generatePlits(x?: number, y?: number): Plit[] {
  const plits: Plit[] = [];
  for (let i = 0; i < 5; i++) {
    plits.push({ x: x ?? 10, y: (y ?? 0) + i * 5, nextPos: null });
  }
  return plits;
}
function getRandomArbitrary(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}
