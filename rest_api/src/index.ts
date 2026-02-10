import {app} from './server.ts'
const port = 3000;
import { env } from './../env.ts'





app.listen(env.PORT, () => {
    console.log("Server is running on port: ", port);
})