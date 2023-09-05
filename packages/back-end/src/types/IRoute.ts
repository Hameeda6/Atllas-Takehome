import { Router } from 'express';

export default interface IRoute {
  
 
  route: string;

  /**
   * The actual router object.
   */
  router(): Router;
}
