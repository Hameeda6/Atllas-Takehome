// import { Request, Response, NextFunction } from 'express';

// export default function CorsStar(req: Request, res: Response, next: NextFunction) {
//   res.setHeader('Access-Control-Allow-Origin', '*');

//   next();
// }
// .

import { Request, Response, NextFunction } from 'express';

export default function Cors(req: Request, res: Response, next: NextFunction) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Add Content-Type here

  if (req.method === 'OPTIONS') {
    // Handle preflight request, respond with 200 OK
    res.status(200).end();
    return;
  }

  next();
}
