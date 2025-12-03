import { generateToken } from "../../utils/generateToken";
import { authRepository } from "./auth.repository";
import { RegisterInput, LoginInput } from "./auth.schema";
import bcrypt from "bcrypt"

export const authService = {
    async register(data: RegisterInput) {
        const { name, username, email, password } = data;

        const emailExists = await authRepository.findByEmail(email);
        if (emailExists) throw new Error("Email already exists");

        const usernameExists = await authRepository.findByUsername(username);
        if (usernameExists) throw new Error("Username already exists");

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await authRepository.createUser({
            ...data,
            password: hashedPassword,
        });

        const token = generateToken(user.id)

        return { user, token };
    },
    async login(data: LoginInput) {
        const { email, password } = data;

        const user = await authRepository.findByEmail(email);
        if (!user) throw new Error("Invalid credentials")

        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new Error("Invalid credentials");

        const token = generateToken(user.id);

        return { user, token }
    }
}