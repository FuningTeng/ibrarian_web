import { SimulationNodeDatum } from 'd3-ng2-service';

export class Node implements SimulationNodeDatum {
  /**
    * Node’s zero-based index into nodes array. This property is set during the initialization process of a simulation.
    */
  index?: number;
  /**
   * Node’s current x-position
   */
  x?: number;
  /**
   * Node’s current y-position
   */
  y?: number;
  /**
   * Node’s current x-velocity
   */
  vx?: number;
  /**
   * Node’s current y-velocity
   */
  vy?: number;
  /**
   * Node’s fixed x-position (if position was fixed)
   */
  fx?: number | null;
  /**
   * Node’s fixed y-position (if position was fixed)
   */
  fy?: number | null;

  id: string;
  module: number;
  i: number;
  title: string;
  description: string;
  link: string;
  image: string;
}
