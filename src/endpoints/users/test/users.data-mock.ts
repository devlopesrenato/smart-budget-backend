import { UserEntity } from "src/endpoints/users/entities/user.entity";

export const UsersDataMock: UserEntity[] = [
    {
        id: 1,
        email: "user@user.com.br",
        name: "User 1",
        password: "$2a$10$3fle9gcBilNtLQEvNXCbqOHs76F38Sm3p4Ra52sYmzDJMc2BMCbvC",
        emailValidated: true,
        emailValidatedAt: new Date("2023-01-01T00:00:00Z"),
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-01-01T00:00:00Z"),
        recoverSentAt: new Date("2023-01-01T00:00:00Z"),
    },
    {
        id: 2,
        email: "user_2@user.com.br",
        name: "User 2",
        password: "$2a$10$3fle9gcBilNtLQEvNXCbqOHs76F38Sm3p4Ra52sYmzDJMc2BMCbvC",
        emailValidated: false,
        emailValidatedAt: new Date("2023-01-01T00:00:00Z"),
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-01-01T00:00:00Z"),
        recoverSentAt: new Date(),
    }
]