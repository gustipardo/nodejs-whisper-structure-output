import { extractInforFromCall, generateMathSolution } from "./structureOutput.js";
import { transcribeAudio } from "./whisper.js";



// Ejecución de las funciones
const runExamples = async () => {
        /* await transcribeAudio(); */
        /* await generateMathSolution(); */
        await extractInforFromCall();
    };
    
runExamples();
    