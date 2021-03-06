import express from 'express'

import UserSchema from "../models/schema/userSchema"
import GroupSchema, { IGroupUser } from "../models/schema/groupSchema"

//ROUTE: /group/pending
const router = express.Router()

//get pending users
router.get("/:groupId", async (req: express.Request, res: express.Response) => {
  try {
    const id: string = req.params.groupId

    const group = await GroupSchema.findById(id)
    if(!group)
      return res.status(404).json({ error: true, message: "No group found with this id" })
      
    const users = await UserSchema.find({
      _id: { $in: group.pending }
    })

    return res.json({ error: false, users })

  } catch(e) {
    console.log(e)
    return res.status(500).json({ error: true, message: "Internal server error" })
  }
})

//send pending request
router.post("/send", async (req: express.Request, res: express.Response) => {
  console.log(req.body)
  if(!req.body.groupId || !req.body.userId)
    return res.status(400).json({ error: true, message: "Bad request, no data found" })

  try {
    const group = await GroupSchema.findById(req.body.groupId)
    if(!group)
      return res.status(404).json({ error: true, message: "No group found with this id" })

    const user = await UserSchema.findById(req.body.userId)
    if(!user)
      return res.status(404).json({ error: true, message: "No group found with this id" })

    group.pending.push(user.id)
    await group.save()

    return res.json({ error: false, message: "Request sended" })

  } catch(e) {
    console.log(e)
    return res.status(500).json({ error: true, message: "Internal server error" })
  }
})

export default router