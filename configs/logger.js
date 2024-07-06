
import { createLogger, format, transports} from 'winston';

const { printf, colorize,json, combine, timestamp} = format;
const  signInFormat = printf(function({ level, message, timestamp ,user})  {
  return `${timestamp} ${level}: ${message} - User: ${user}`;
});

const options = {
  file: {
    format:combine( timestamp(),json() ),
    level: 'info',  
  },
  console: {
    format:combine(
      colorize({ all: true }), 
      timestamp(),
      signInFormat 
    ),
    level: 'debug',
  },
};
export const combinedLogger = createLogger({
    transports: [
      new transports.File({...options.file, filename:'logs/combined.log'}),
      new transports.Console(options.console),
    ],
    exitOnError: false, 
});

export const signInLogger = createLogger({
  transports: [
    new transports.File({...options.file,filename:'logs/auth/sign-in.log'}),
    new transports.Console(options.console),
  ],
  exitOnError: false, 
});

export const signUpLogger = createLogger({
  transports: [
    new transports.File({...options.file,filename:'logs/auth/sign-up.log'}),
    new transports.Console(options.console),
  ],
  exitOnError: false, 
});

export const authErrorLogger = createLogger({
  transports: [
    new transports.File({...options.file, filename:'logs/auth/auth-error.log',level:'error'}),
    //new transports.Console(options.console),
  ],
  exitOnError: false, 
});


combinedLogger.stream = {
  write: (message) => {
    combinedLogger.info(message.trim());
  },
};









// let logger;
// if (process.env.NODE_ENV === 'production') {
//   logger = createLogger({
//       transports: [
//         new transports.File(options.file),
//       ],
//       exitOnError: false,
//   });
// }

// else{
//   combinedLogger = createLogger({
//     transports: [
//       new transports.File(options.file,{filename:'logs/auth/sign-in.log',}),
//       new transports.Console(options.console),
//     ],
//     exitOnError: false, 
// });
// }