import { UserDTO } from "../dtos/user.dto"
import { userDocument } from "../models/userModel"

export const toUserDTO = (user: userDocument): UserDTO => {
    return {
        _id: user._id.toString(),
        email: user.email,
        username: user.username,
        shopname: user.shopname,
        password: user.password,
    }
}