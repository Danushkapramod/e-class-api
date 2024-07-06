
import dotenv from 'dotenv'
import  app  from './index.js'
import './configs/database.js';
import './configs/logger.js'

dotenv.config()
const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log('Server running on port ' + port)
})
