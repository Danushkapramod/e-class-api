import winston from 'winston';
import { createLogger, format, transports } from 'winston';
const { combine, timestamp, label, printf } = format;

const  signInFormat = printf(function({ level, message, timestamp })  {
  return `${timestamp} ${level}: ${message} - User: `;
});

const logger = winston.createLogger({
  format:combine(
    timestamp(),
    signInFormat
  ),
    transports: [
      new transports.File({ filename: 'logs/auth/signin.log', level: 'info' }),
    ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console());
}

logger.info('success')
export default logger


