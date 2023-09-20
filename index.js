import Express from 'express'
import admin from 'firebase-admin'
import cors from 'cors'
import logger from 'morgan'
const app = Express()

app.use(Express.json())
app.use(cors())
app.use(logger('dev'))

admin.initializeApp({
  credential: admin.credential.cert('./serviceAccountKey.json'),
  databaseURL: 'https://otp-auth-48162-default-rtdb.firebaseio.com',
})

app.get('/', (req, res) => {
  return res.send('hi')
})

app.post('/send-notification', async (req, res) => {
  const { payload, token } = req.body
  if (!payload?.title || !payload?.body) {
    return res
      .json({
        message: 'All fields are required',
      })
      .status(400)
  }
  console.log(req.body)

  try {
    await admin.messaging().send({
      token,
      notification: {
        title: payload.title,
        body: payload.body,
      },
    })
    return res.json({ message: 'Successful' }).status(200)
  } catch (err) {
    console.log(err)
    return res.json({ message: err }).status(400)
  }
})

app.listen(8080, () => {
  console.log('Server is listening')
})
