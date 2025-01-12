import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export type Role = "Manager" | "Master"
@Entity("users")
export class Users {
    @PrimaryGeneratedColumn("uuid")
    userID!: string
    @Column()
    userTelegramID!: number
    @Column({unique: true})
    userTelegramName!: string
    @Column({type: "enum",enum: ["Manager", "Master"]})
    userRole!: Role
    @Column({default: ""})
    userPhoto!: string
    @Column()
    activated!: Boolean
}