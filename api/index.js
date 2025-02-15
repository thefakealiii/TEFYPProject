import { exec } from "child_process";
import cors from "cors";
import dotenv from "dotenv";
import voice from "elevenlabs-node";
import express from "express";
import ffmpeg from "fluent-ffmpeg";
import { promises as fs } from "fs";
import OpenAI from "openai";
import util from "util";
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import con from './config.js'; 
import multer from 'multer';
import path from "path";
import fss from 'fs';
// Set the ffmpeg path using the @ffmpeg-installer/ffmpeg package
ffmpeg.setFfmpegPath(ffmpegPath);

const execCommand_ = util.promisify(exec);




dotenv.config();

const backendUrl = "https://asdafafwa.vercel.app";
const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;



let voiceID = "pFZP5JQG7iQjIQuC4Bku";



const app = express();
app.use(express.json());
// app.use(cors({ origin: 'http://localhost:5173/', credentials: true }));

const port = 3000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "-",
});

// Middleware to handle CORS
app.use(cors());
 
// Middleware to handle JSON parsing
app.use(express.json());

// Middleware to handle errors in async functions
const asyncMiddleware = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

//check file 
function checkFileType(file , cb) {

  const filetype = /jpeg|jpg|png|/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  } 
}

const upload_img = multer({
  storage: multer.memoryStorage({}),
  fileFilter: function (_req, file, cb) {
    checkFileType(file, cb);
  }
})


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Specify the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // Use the original file name
  }
});
const upload = multer({ storage: storage });

// Route for handling file uploads
app.post('/upload', upload.single('file'), async (req, res, next) => {
  console.log(req.file );
  console.log("buffer = ");
  console.log(req.file.buffer);
  try {
   
    const imageData = fss.readFileSync(req.file.path, { encoding: 'base64' });
   
    console.log( "2sadsa");
    // Prepare inputs for predictImage (format as needed for your function)
    const inputs = [
      { data: { image: { base64: imageData } } },
    ];
    console.log( "5sadsa");

    // Perform asynchronous prediction using async/await
    const results = await predictImage(inputs);
    console.log( "6sadsa");

    // Send successful response
    return res.send({ results });
  } catch (err) {
    console.log( "7sadsa");
    console.error(err); // Log the actual error for debugging
    return res.status(500).json({ message: 'Internal server error' });
  }
});


// get charapi 

import {ClarifaiStub, grpc} from "clarifai-nodejs-grpc";

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization",  `Key 5eed336b2f924912b55333f9ee3d677b`);


function predictImage(input) {
    return new Promise((resolve, reject) => {
        stub.PostModelOutputs(
            {
                // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
                model_id: "aaa03c23b3724a16a56b629203edc62c",
                inputs: input
            },
            metadata,
            (err, response) => {
                if (err) {
                    reject("Error: " + err);
                    return;
                }
        
                if (response.status.code !== 10000) {
                    reject("Received failed status: " + response.status.description + "\n" + response.status.details);
                    return;
                }
                let result = [];
                console.log("Predicted concepts, with confidence values:")
                for (const c of response.outputs[0].data.concepts) {
                    console.log(c.name + ": " + c.value);
                
                result.push({
                    name: c.name,
                    value: c.value

                })
                }
                
                resolve(result);
            }
        );
    })
}



app.post("/predict", async (req, res) => {
    try{
        const  { imageUrl } = req.body;
        const inputs = [
            {    
            data:{
                image:{
                    url: imageUrl
                }
            }
        
        }];
        const results = await predictImage(inputs);
        res.send({results});

    }   
    catch(err){
        res.status(400).send({
        error: err

        });
    }
});






// Convert audio to WAV format using FFmpeg
const convertAudio = async (inputFile, outputFile) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputFile)
      .toFormat("wav")
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .save(outputFile);
  });
};

// Execute a command using child_process
const execCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(
      command,
      { env: { PATH: "/path/to/ffmpeg-directory:" + process.env.PATH } },
      (error, stdout, stderr) => {
        if (error) reject(error);
        resolve(stdout);
      }
    );
  });
};




const lipSyncMessage = async (message) => {
  console.log(message.animation);
  const time = new Date().getTime();

  // Sanitize the message for filename
  const sanitizedMessage = message.replace(/[^a-zA-Z0-9]/g, '_');

  console.log(`Starting conversion for message ${sanitizedMessage}`);

  try {
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(`audios/message_${0}.mp3`)
        .output(`audios/message_${0}.wav`)
        .on('end', resolve)
        .on('error', (err) => {
          reject(new Error(`FFmpeg Error: ${err}`));
        })
        .run();
    });
  } catch (error) {
    console.error('Error converting audio:', error.message);
   
  }

  console.log(`Conversion done in ${new Date().getTime() - time}ms`);

  const jsonFilePath = `audios/message_${0}.json`;
  // if (!fs.existsSync(jsonFilePath)) {
  //   console.error(`Error: JSON file not found at ${jsonFilePath}`);
  //   return;
  // }

  try {
    await execCommand_(
      `"./Rhubarb-Lip-Sync-1.13.0-Windows/rhubarb.exe" -f json -o "${jsonFilePath}" "audios/message_${0}.wav" -r phonetic`
    );
  } catch (error) {
    console.error('Error running Rhubarb:', error.message);
    return;
  }

  console.log(`Lip sync done in ${new Date().getTime() - time}ms`);
};


// Read JSON transcript from a file
const readJsonTranscript = async (file) => {
  const data = await fs.readFile(file, "utf8");
 
  return JSON.parse(data);
};

// Convert audio file to base64
const audioFileToBase64 = async (file) => {
  const data = await fs.readFile(file);
  return data.toString("base64");
};





// Route to get available voices
app.get("/voices", async (req, res) => {
  res.send(await voice.getVoices(elevenLabsApiKey));
});



//working
app.post("/voice", async (req, res) => {
  if(req.body.model === "male"){
    voiceID = "IKne3meq5aSn9XLyUdCD"
    console.log(voiceID)
  }
  else{
    voiceID  = "pFZP5JQG7iQjIQuC4Bku"
    console.log(voiceID)
  }
}  
)

// Route to handle chat messages
app.post(
  "/chat",
  asyncMiddleware(async (req, res) => {
    const userMessage = req.body.message;
     
    console.log("User Message:", userMessage); 
   


    


    
    if (!userMessage) {
      res.send({
        messages: [
          // ... your default messages
        ],
      });
      return;
    }

    if (!elevenLabsApiKey || openai.apiKey === "-") {
      res.send({
        messages: [
          // ... messages for missing API keys
        ],
      });
      return;
    }

    // OpenAI ChatGPT completion
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
        You are a virtual friend.
        You will always reply with a JSON array of messages. With a maximum of 3 messages.
        Each message has a text, facialExpression, and animation property.
        The different facial expressions are: smile, sad, angry, surprised, funnyFace, and default.
        The different animations are:  Idle, Crying,Rumba, Laughing,Sad Idle,Hello, and Angry. 
        `,
        },
        {
          role: "user",
          content: userMessage || "Hello",
        },
      ],
    });

    let messages = JSON.parse(completion.choices[0].message.content);

    if (messages.messages) {
      messages = messages.messages;
    }
    console.log(messages[0]["text"]);
  
    // Process and send messages
    for (let i = 0; i < messages.length; i++) {
      const message = messages[0];
      const fileName = `audios/message_${0}.mp3`;
      const textInput = message.text;

      // Generate audio file
      try {
        await voice.textToSpeech(elevenLabsApiKey, voiceID, fileName, textInput);
        await lipSyncMessage(message.text);

        // After lip sync is done, send the response
        const audioBase64 = await audioFileToBase64(`audios/message_${i}.mp3`);
        const lipsyncData = await readJsonTranscript(`audios/message_${i}.json`);
        console.log("asdasd" +message.animation)
        res.send({
          messages: [
            {
              text: message.text,
              audio: audioBase64,
              lipsync: lipsyncData,
              facialExpression: message.facialExpression,
              animation: message.animation,
            },
          ],
        });

      } catch (err) {
        console.log(err.message);
        res.status(500).send({ error: "Error generating audio or lip sync" });
        return;
      }
      
      insertdata(userMessage, messages[0]["text"]);

    }
  })
);


function insertdata(input, output) {
  const query = `INSERT INTO virtualchat (input, output_response) VALUES (?, ?)`;
  con.query(query, [input, output], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Error inserting data');
    } else {
      console.log('Data inserted successfully');
     
    }
  });
}

app.get('/api/data', (req, res) => {
  const query = 'SELECT * FROM virtualchat'; // Adjust query as per your table structure
  con.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'Error fetching data' });
    } else {
      res.status(200).json(result);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Virtual Talks listening on port ${port}`);
});