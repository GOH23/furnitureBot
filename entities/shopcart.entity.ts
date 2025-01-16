import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("shopcart")
export class ShopCartEntity {
    @PrimaryGeneratedColumn("increment")
    cartID!: number
    @Column()
    products!: string
    @Column()
    telegramUserName!: string
    @CreateDateColumn()
    createdAt!: Date
    @Column({default: false})
    blocked!: boolean
}