import express from 'express';
import habbitRoutes from './routes/habbitRoutes.ts';
import cors from 'cors';
import morgan from 'morgan';
import helmet  from 'helmet';
import { isTest } from '../env.ts';

const app = express();
// global middlewares 
app.use(helmet()); // handles security to prevent common vulnerabilities
app.use(morgan("dev", { skip: isTest() })); // morgan handles logging all api requestis in the browsers
app.use(cors({ origin: '*' })) // handle CORS
app.use(express.json()); // form json body of all request bodies
app.use(express.urlencoded({ extended: true })); // allows express to to decipher all url endcodings to unders and decode params

app.use('/health', (req, res) => {
    res.status(200).json({
        status: "OK",
        timeStamp: new Date().toISOString(), 
        service:"Health checker API "
    })
})

// habbit router mounts
app.use('/api/habbits', habbitRoutes);

export { app }; 
export default app;
