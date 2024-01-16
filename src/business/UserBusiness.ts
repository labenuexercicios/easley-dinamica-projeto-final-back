import UserDatabase from "../database/UserDatabase";
import { SignupInputDTO, SignupOutputDTO } from "../dtos/users/signup.dto";
import User, { TokenPayload } from "../models/User";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export default class UserBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private hashManager: HashManager,
    private tokenManager: TokenManager
  ) {}

  public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
    const newId = this.idGenerator.generate()

    const hashedPassword = await this.hashManager.hash(input.password)
    
    const newUser = new User(
      newId,
      input.username,
      input.email,
      hashedPassword
    )

    await this.userDatabase.createUser(newUser.toUserDB())

    const payload: TokenPayload = {
      id: newId
    }

    const token = this.tokenManager.createToken(payload)

    const output: SignupOutputDTO = {
      token
    }

    return output
  }
}