const app = require('./src/app')
const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Fake E3 Api running on port ${port}`))
