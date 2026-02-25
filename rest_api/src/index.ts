import {app} from './server.ts'
const port = 3000;
import { env } from './../env.ts'
import { initBackgroundJob } from './services/streakEngine.ts';



async function startServer() {
    try {
        // start background job first 
        await initBackgroundJob(); 
        console.log("Background job started")
        // start server 
        app.listen(env.PORT, () => {
        console.log("Server is running on port: ", port);
})
        
    } catch (error: unknown) {
        console.log("App failed to start")
    }
}


// start server 
startServer(); 