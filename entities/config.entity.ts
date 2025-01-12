import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("config")
export class Config {
    @PrimaryGeneratedColumn("uuid")
    tableId!: string
    @Column()
    generatedID!: string
}